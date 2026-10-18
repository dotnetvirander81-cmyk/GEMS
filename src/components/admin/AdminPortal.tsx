import React, { useState } from 'react';
import {
  Product,
  Category,
  Artisan,
  Order,
  SiteContent,
  Customer,
} from '../../types';
import {
  getAdminSession,
  verifyAdminLogin,
  adminLogout,
  saveProduct,
  deleteProduct,
  duplicateProduct,
  adjustStock,
  saveCategory,
  saveArtisan,
  updateOrderStatus,
  saveSiteContent,
  generateNextProductId,
  resetDatabaseToDefaults,
} from '../../services/storageService';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { KridayLogo } from '../common/KridayLogo';
import {
  LayoutDashboard,
  Package,
  Layers,
  Users,
  ShoppingBag,
  Sliders,
  FileText,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  CheckCircle,
  AlertTriangle,
  Upload,
  ArrowLeft,
  DollarSign,
  Github,
  RefreshCw,
  ExternalLink,
  Shield,
  Eye,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  artisans: Artisan[];
  orders: Order[];
  customers: Customer[];
  siteContent: SiteContent;
  onViewProductOnStorefront: (product: Product) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  artisans,
  orders,
  customers,
  siteContent,
  onViewProductOnStorefront,
}) => {
  const [session, setSession] = useState(getAdminSession());
  const [loginEmail, setLoginEmail] = useState('admin@kriday.com');
  const [loginPassword, setLoginPassword] = useState('artisan2026');
  const [loginError, setLoginError] = useState('');

  // Active section
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'artisans' | 'orders' | 'inventory' | 'content' | 'github'
  >('dashboard');

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productFormError, setProductFormError] = useState('');
  const [productFormSuccess, setProductFormSuccess] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Order inspection state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Content form state
  const [contentForm, setContentForm] = useState<SiteContent>(siteContent);
  const [contentSavedMsg, setContentSavedMsg] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = verifyAdminLogin(loginPassword, loginEmail);
    if (success) {
      setSession(getAdminSession());
    } else {
      setLoginError('Invalid administrator credentials. Default password is "artisan2026".');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setSession(null);
  };

  // If not logged in, show secure login dialog
  if (!session || !session.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
        <div className="bg-[#F8F5F0] border border-[#DED6CD] max-w-md w-full p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#716A63] hover:text-[#292521] p-1 cursor-pointer"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#292521] text-[#B89559] rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 stroke-[1.5]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89559] font-medium block">
              MANAGEMENT CONSOLE
            </span>
            <h2 className="font-serif-luxury text-2xl text-[#292521] mt-1">Admin Portal Sign In</h2>
            <p className="text-xs text-[#716A63] mt-1">
              Access product inventory, orders, artisans, and marketplace controls.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#292521]"
              />
            </div>

            {loginError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xs border border-red-200">{loginError}</p>}

            <div className="bg-[#F0EAE2] p-3 text-[11px] text-[#716A63] space-y-1 border border-[#DED6CD]">
              <p className="font-semibold text-[#292521]">Default Master Credentials:</p>
              <p>Email: <code className="text-[#292521] font-mono">admin@kriday.com</code></p>
              <p>Passkey: <code className="text-[#292521] font-mono">artisan2026</code></p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-widest font-medium transition-colors shadow-sm cursor-pointer"
            >
              Sign In to Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.fulfillmentStatus === 'processing' || o.fulfillmentStatus === 'unfulfilled'
  ).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);

  // File upload handler for product images
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProductFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          mainImage: dataUrl,
          images: [dataUrl, ...(editingProduct.images || [])],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Product Form Save
  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError('');
    setProductFormSuccess('');

    if (!editingProduct) return;

    const res = saveProduct({
      id: editingProduct.id,
      productId: editingProduct.productId || '',
      sku: editingProduct.sku || `SKU-${Date.now()}`,
      name: editingProduct.name || '',
      slug:
        editingProduct.slug ||
        (editingProduct.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: editingProduct.shortDescription || '',
      fullDescription: editingProduct.fullDescription || '',
      categoryId: editingProduct.categoryId || 'cat-rings',
      categoryName:
        categories.find((c) => c.id === editingProduct.categoryId)?.name || 'RINGS',
      artisanId: editingProduct.artisanId || 'art-elena',
      artisanName:
        artisans.find((a) => a.id === editingProduct.artisanId)?.name || 'Elena R.',
      price: Number(editingProduct.price) || 0,
      salePrice: editingProduct.salePrice ? Number(editingProduct.salePrice) : undefined,
      currency: 'USD',
      mainImage:
        editingProduct.mainImage ||
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      images: editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : [editingProduct.mainImage || ''],
      material: editingProduct.material || '14k Recycled Yellow Gold',
      gemstone: editingProduct.gemstone || 'None',
      availableSizes: editingProduct.availableSizes || ['5', '6', '7', '8'],
      stockQuantity: Number(editingProduct.stockQuantity) || 10,
      lowStockThreshold: Number(editingProduct.lowStockThreshold) || 3,
      weight: editingProduct.weight || '3.2g',
      dimensions: editingProduct.dimensions || 'Standard fine jewelry gauge',
      shippingInfo: editingProduct.shippingInfo || 'Ships in 24 hours with insured delivery.',
      returnEligibility: '30-day effortless return guarantee.',
      isFeatured: !!editingProduct.isFeatured,
      isBestSeller: !!editingProduct.isBestSeller,
      isNewArrival: !!editingProduct.isNewArrival,
      status: (editingProduct.status as any) || 'active',
    });

    if (!res.success) {
      setProductFormError(res.error || 'Failed to save product.');
    } else {
      setProductFormSuccess(`Piece "${res.product?.name}" saved successfully with Product ID ${res.product?.productId}!`);
      setTimeout(() => {
        setEditingProduct(null);
        setProductFormSuccess('');
      }, 1200);
    }
  };

  // Filter products for table
  const displayedProducts = products.filter((p) => {
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.productId.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1B18]/85 backdrop-blur-xs flex overflow-hidden animate-fadeIn">
      {/* Admin Sidebar Navigation */}
      <div className="w-64 bg-[#292521] text-[#F8F5F0] flex flex-col justify-between shrink-0 border-r border-[#3A3530]">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-[#3A3530]">
            <KridayLogo variant="header" theme="dark" />
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1 text-xs">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'products' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="ml-auto bg-[#B89559] text-black font-semibold text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('inventory');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'inventory' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Inventory & Stock</span>
              {lowStockCount > 0 && (
                <span className="ml-auto bg-amber-600 text-white font-semibold text-[10px] px-1.5 py-0.2 rounded-full">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('categories');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'categories' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('artisans');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'artisans' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Makers & Artisans ({artisans.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('content');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'content' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Homepage Content</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('github');
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs transition-colors text-left cursor-pointer ${
                activeTab === 'github' ? 'bg-[#3A3530] text-[#B89559] font-medium' : 'text-[#B9A99A] hover:text-white'
              }`}
            >
              <Github className="w-4 h-4 text-[#B89559]" />
              <span>GitHub Hosting Guide</span>
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#3A3530] space-y-2">
          <button
            onClick={resetDatabaseToDefaults}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#B9A99A] hover:text-white hover:bg-[#3A3530] transition-colors rounded-xs"
            title="Reload initial seed catalogue"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Database</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-400 hover:text-red-300 hover:bg-[#3A3530] transition-colors rounded-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Administrator</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content Area */}
      <div className="flex-1 bg-[#F8F5F0] flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-white border-b border-[#DED6CD] px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif-luxury text-xl text-[#292521] uppercase tracking-wider">
              {activeTab === 'dashboard' && 'Marketplace Performance & Status'}
              {activeTab === 'products' && (editingProduct ? 'Product Editor' : 'Product Management')}
              {activeTab === 'orders' && 'Customer Orders & Fulfillment'}
              {activeTab === 'inventory' && 'Inventory Levels & Audits'}
              {activeTab === 'categories' && 'Jewelry Category Hierarchy'}
              {activeTab === 'artisans' && 'Artisans & Makers'}
              {activeTab === 'content' && 'Storefront Editorial Copy & Banners'}
              {activeTab === 'github' && 'GitHub Pages & Deployment Instructions'}
            </h3>
            <p className="text-xs text-[#716A63]">Signed in as {session.user.name} ({session.user.email})</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#F0EAE2] hover:bg-[#E5D9CC] text-[#292521] text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-[#DED6CD] cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* =========================================================================
              VIEW 1: DASHBOARD OVERVIEW
          ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-[#DED6CD] p-5 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#716A63] font-semibold block mb-1">
                    TOTAL SALES REVENUE
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-[#292521]">
                      ₹{totalRevenue.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">Verified Paid</span>
                  </div>
                </div>

                <div className="bg-white border border-[#DED6CD] p-5 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#716A63] font-semibold block mb-1">
                    TOTAL ORDERS
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-[#292521]">{totalOrdersCount}</span>
                    <span className="text-xs text-[#716A63]">
                      ({pendingOrdersCount} pending dispatch)
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-[#DED6CD] p-5 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#716A63] font-semibold block mb-1">
                    ACTIVE PIECES
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-[#292521]">{activeProducts}</span>
                    <span className="text-xs text-[#716A63]">of {totalProducts} items</span>
                  </div>
                </div>

                <div className="bg-white border border-[#DED6CD] p-5 shadow-2xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#716A63] font-semibold block mb-1">
                    LOW-STOCK WARNINGS
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold font-mono ${lowStockCount > 0 ? 'text-amber-700' : 'text-[#292521]'}`}>
                      {lowStockCount}
                    </span>
                    <span className="text-xs text-[#716A63]">Needs restock</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-white border border-[#DED6CD] p-6 shadow-2xs">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-serif-luxury text-lg text-[#292521] uppercase tracking-wider">
                    Recent Customer Orders
                  </h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#B89559] hover:underline uppercase tracking-wider"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#292521]">
                    <thead className="bg-[#F8F5F0] text-[#716A63] uppercase tracking-wider text-[10px] border-b border-[#DED6CD]">
                      <tr>
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DED6CD]/60 font-mono-nums">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-[#F8F5F0]/60">
                          <td className="py-3 px-3 font-mono font-medium text-[#292521]">{o.orderNumber}</td>
                          <td className="py-3 px-3 text-[#716A63]">{new Date(o.date).toLocaleDateString()}</td>
                          <td className="py-3 px-3 font-sans">{o.customerName}</td>
                          <td className="py-3 px-3 font-semibold">₹{o.total.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-sans">
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-[#F0EAE2] text-[#292521] text-[10px] uppercase font-sans font-medium">
                              {o.fulfillmentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: PRODUCT MANAGEMENT & FORM
          ========================================================================= */}
          {activeTab === 'products' && (
            <div>
              {/* If editing or creating a product */}
              {editingProduct ? (
                <div className="bg-white border border-[#DED6CD] p-8 max-w-4xl mx-auto shadow-sm">
                  <div className="flex justify-between items-center pb-4 mb-6 border-b border-[#DED6CD]">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#B89559] font-medium block">
                        PRODUCT DATABASE CATALOG
                      </span>
                      <h3 className="font-serif-luxury text-2xl text-[#292521]">
                        {editingProduct.id ? `Edit Piece: ${editingProduct.name}` : 'Add New Handcrafted Product'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-1.5 bg-[#F0EAE2] hover:bg-[#E5D9CC] text-xs uppercase tracking-wider text-[#292521] border border-[#DED6CD] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {productFormError && (
                    <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs border border-red-200">
                      {productFormError}
                    </div>
                  )}
                  {productFormSuccess && (
                    <div className="p-3 mb-4 bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                      {productFormSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSaveProductSubmit} className="space-y-6 text-xs">
                    {/* Row 1: Product ID & SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8F5F0] p-4 border border-[#DED6CD]">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] uppercase tracking-wider text-[#292521] font-semibold">
                            Product ID *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const slug = categories.find((c) => c.id === editingProduct.categoryId)?.slug || 'rings';
                              const suggested = generateNextProductId(slug);
                              setEditingProduct({ ...editingProduct, productId: suggested });
                            }}
                            className="text-[10px] text-[#B89559] hover:underline"
                          >
                            Auto-Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CC-RING-0005"
                          value={editingProduct.productId || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, productId: e.target.value.toUpperCase() })
                          }
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 font-mono text-[#292521] uppercase focus:outline-none focus:border-[#292521]"
                        />
                        <span className="text-[10px] text-[#716A63] mt-1 block">
                          Must be unique in database.
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Inventory SKU
                        </label>
                        <input
                          type="text"
                          placeholder="SKU-XXXX"
                          value={editingProduct.sku || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 font-mono text-[#292521] focus:outline-none focus:border-[#292521]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Publish Status
                        </label>
                        <select
                          value={editingProduct.status || 'active'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521] focus:outline-none focus:border-[#292521]"
                        >
                          <option value="active">Active (Visible on Storefront)</option>
                          <option value="draft">Draft (Hidden)</option>
                          <option value="archived">Archived (Retired)</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Name, Price, Sale Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521] focus:outline-none focus:border-[#292521]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Price (INR ₹) *
                        </label>
                        <input
                          type="number"
                          step="1"
                          required
                          value={editingProduct.price ?? ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 font-mono text-[#292521] focus:outline-none focus:border-[#292521]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Sale Price (INR ₹, Optional)
                        </label>
                        <input
                          type="number"
                          step="1"
                          value={editingProduct.salePrice ?? ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              salePrice: e.target.value ? parseFloat(e.target.value) : undefined,
                            })
                          }
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 font-mono text-[#292521] focus:outline-none focus:border-[#292521]"
                        />
                      </div>
                    </div>

                    {/* Row 3: Category & Artisan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Category
                        </label>
                        <select
                          value={editingProduct.categoryId || 'cat-rings'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521] focus:outline-none focus:border-[#292521]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Artisan / Maker
                        </label>
                        <select
                          value={editingProduct.artisanId || 'art-elena'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, artisanId: e.target.value })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521] focus:outline-none focus:border-[#292521]"
                        >
                          {artisans.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.location})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Image Management */}
                    <div className="border border-[#DED6CD] p-4 bg-[#F8F5F0]">
                      <label className="text-[11px] uppercase tracking-wider text-[#292521] font-semibold block mb-2">
                        Product Imagery & File Upload
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="w-24 h-24 bg-[#E5D9CC] border border-[#DED6CD] shrink-0 overflow-hidden relative">
                          <ImageWithFallback
                            src={editingProduct.mainImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center gap-3">
                            <label className="px-3 py-2 bg-[#292521] hover:bg-[#B89559] text-white text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Image from Device</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[11px] text-[#716A63]">or paste image URL:</span>
                          </div>

                          <input
                            type="url"
                            placeholder="https://..."
                            value={editingProduct.mainImage || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                            className="w-full bg-white border border-[#DED6CD] px-3 py-1.5 text-xs text-[#292521]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Material, Gemstone, Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Material
                        </label>
                        <input
                          type="text"
                          value={editingProduct.material || '14k Recycled Yellow Gold'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Gemstone
                        </label>
                        <input
                          type="text"
                          value={editingProduct.gemstone || 'None'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, gemstone: e.target.value })}
                          className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                          Stock Quantity & Alert
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Stock"
                            value={editingProduct.stockQuantity ?? 10}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value) || 0 })
                            }
                            className="w-1/2 bg-white border border-[#DED6CD] px-3 py-2 font-mono text-[#292521]"
                          />
                          <input
                            type="number"
                            min="1"
                            placeholder="Low threshold"
                            value={editingProduct.lowStockThreshold ?? 3}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, lowStockThreshold: parseInt(e.target.value) || 3 })
                            }
                            className="w-1/2 bg-white border border-[#DED6CD] px-3 py-2 font-mono text-[#716A63]"
                            title="Low Stock Alert Threshold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 6: Descriptions */}
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={editingProduct.shortDescription || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                        className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                        Full Atelier Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingProduct.fullDescription || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                        className="w-full bg-white border border-[#DED6CD] px-3 py-2 text-[#292521]"
                      />
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap gap-6 p-3 bg-[#F0EAE2] border border-[#DED6CD]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isFeatured}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                          className="accent-[#292521]"
                        />
                        <span className="font-medium text-[#292521]">Featured Piece (Homepage Grid)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isBestSeller}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                          className="accent-[#292521]"
                        />
                        <span className="font-medium text-[#292521]">Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isNewArrival}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                          className="accent-[#292521]"
                        />
                        <span className="font-medium text-[#292521]">New Arrival</span>
                      </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-4 border-t border-[#DED6CD] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-5 py-2.5 bg-[#F0EAE2] text-[#292521] hover:bg-[#E5D9CC] transition-colors"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-2.5 bg-[#292521] hover:bg-[#B89559] text-white uppercase tracking-widest font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        {editingProduct.id ? 'Save Changes' : 'Create & Publish Piece'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Products Table */
                <div className="bg-white border border-[#DED6CD] shadow-sm">
                  {/* Top table controls */}
                  <div className="p-4 border-b border-[#DED6CD] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search product name, ID, artisan..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-1.5 text-xs text-[#292521] pl-8"
                        />
                        <Search className="w-3.5 h-3.5 text-[#716A63] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>

                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-[#F8F5F0] border border-[#DED6CD] text-xs text-[#292521] px-2.5 py-1.5"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        const newId = generateNextProductId('rings');
                        setEditingProduct({
                          productId: newId,
                          name: '',
                          price: 120,
                          categoryId: 'cat-rings',
                          artisanId: 'art-elena',
                          stockQuantity: 10,
                          lowStockThreshold: 3,
                          status: 'active',
                          isFeatured: false,
                          isBestSeller: false,
                          isNewArrival: true,
                        });
                      }}
                      className="px-4 py-2 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#292521]">
                      <thead className="bg-[#F8F5F0] text-[#716A63] uppercase tracking-wider text-[10px] border-b border-[#DED6CD]">
                        <tr>
                          <th className="py-3 px-4">Product ID</th>
                          <th className="py-3 px-4">Piece</th>
                          <th className="py-3 px-4">Artisan</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Stock</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DED6CD]/60 font-mono-nums">
                        {displayedProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F8F5F0]/60">
                            <td className="py-3 px-4 font-mono font-medium text-[#292521] whitespace-nowrap">
                              {p.productId}
                            </td>
                            <td className="py-3 px-4 font-sans">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 shrink-0 bg-[#E5D9CC] overflow-hidden border border-[#DED6CD]">
                                  <ImageWithFallback src={p.mainImage} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="font-medium text-[#292521] block line-clamp-1">{p.name}</span>
                                  {p.isFeatured && (
                                    <span className="text-[9px] uppercase tracking-wider text-[#B89559] font-semibold">
                                      ★ Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-sans text-[#716A63]">{p.artisanName}</td>
                            <td className="py-3 px-4 font-sans text-[#716A63]">{p.categoryName}</td>
                            <td className="py-3 px-4 font-semibold">₹{p.price}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 text-[10px] uppercase font-sans font-medium ${
                                  p.stockQuantity <= 0
                                    ? 'bg-red-100 text-red-800'
                                    : p.stockQuantity <= p.lowStockThreshold
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {p.stockQuantity} in stock
                              </span>
                            </td>
                            <td className="py-3 px-4 font-sans">
                              <span className="capitalize">{p.status}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 font-sans">
                                <button
                                  onClick={() => onViewProductOnStorefront(p)}
                                  className="p-1.5 hover:text-[#B89559] text-[#716A63]"
                                  title="View on Storefront"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1.5 hover:text-[#292521] text-[#716A63]"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => duplicateProduct(p.id)}
                                  className="p-1.5 hover:text-[#292521] text-[#716A63]"
                                  title="Duplicate Product"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${p.name} (${p.productId})?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 hover:text-red-700 text-[#716A63]"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 3: ORDERS MANAGEMENT
          ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {selectedOrder ? (
                <div className="bg-white border border-[#DED6CD] p-8 shadow-sm">
                  <div className="flex justify-between items-center pb-4 mb-6 border-b border-[#DED6CD]">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#B89559] font-medium">
                        ORDER FULFILLMENT AUDIT
                      </span>
                      <h3 className="font-serif-luxury text-2xl text-[#292521]">
                        Order #{selectedOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-[#716A63]">
                        Placed on {new Date(selectedOrder.date).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-1.5 bg-[#F0EAE2] text-xs uppercase tracking-wider text-[#292521] border border-[#DED6CD]"
                    >
                      Back to Orders
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs mb-6">
                    <div className="space-y-2 bg-[#F8F5F0] p-4 border border-[#DED6CD]">
                      <h4 className="font-semibold uppercase tracking-wider text-[#292521]">Customer Details</h4>
                      <p><span className="text-[#716A63]">Name:</span> {selectedOrder.customerName}</p>
                      <p><span className="text-[#716A63]">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="text-[#716A63]">Phone:</span> {selectedOrder.customerPhone || 'N/A'}</p>
                      <p><span className="text-[#716A63]">Address:</span> {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    </div>

                    <div className="space-y-3 bg-[#F8F5F0] p-4 border border-[#DED6CD]">
                      <h4 className="font-semibold uppercase tracking-wider text-[#292521]">Status & Dispatch Controls</h4>
                      <div className="flex items-center gap-3">
                        <label className="text-[#716A63]">Fulfillment:</label>
                        <select
                          value={selectedOrder.fulfillmentStatus}
                          onChange={(e) => {
                            const newStatus = e.target.value as any;
                            updateOrderStatus(selectedOrder.id, newStatus);
                            setSelectedOrder({ ...selectedOrder, fulfillmentStatus: newStatus });
                          }}
                          className="bg-white border border-[#DED6CD] px-3 py-1 font-medium"
                        >
                          <option value="unfulfilled">Unfulfilled</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[#716A63] block mb-1">Tracking Number:</label>
                        <input
                          type="text"
                          defaultValue={selectedOrder.trackingNumber || ''}
                          onBlur={(e) => {
                            updateOrderStatus(
                              selectedOrder.id,
                              selectedOrder.fulfillmentStatus,
                              selectedOrder.paymentStatus,
                              e.target.value
                            );
                          }}
                          placeholder="e.g. TRK-USPS-998822"
                          className="w-full bg-white border border-[#DED6CD] px-3 py-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Purchased items table */}
                  <h4 className="font-semibold uppercase tracking-wider text-[#292521] text-xs mb-2">
                    Purchased Pieces
                  </h4>
                  <div className="border border-[#DED6CD]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5F0] text-[#716A63] uppercase text-[10px] border-b border-[#DED6CD]">
                        <tr>
                          <th className="p-3">Piece</th>
                          <th className="p-3">Unit Price</th>
                          <th className="p-3">Quantity</th>
                          <th className="p-3 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DED6CD]/60 font-mono-nums">
                        {selectedOrder.items.map((i, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-sans">
                              <span className="font-medium text-[#292521]">{i.productName}</span>
                              {i.size && <span className="text-[#716A63] ml-2">(Size: {i.size})</span>}
                            </td>
                            <td className="p-3">₹{i.price}</td>
                            <td className="p-3">{i.quantity}</td>
                            <td className="p-3 text-right font-semibold">₹{i.price * i.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#DED6CD] shadow-sm">
                  <div className="p-4 border-b border-[#DED6CD]">
                    <h4 className="font-semibold uppercase tracking-wider text-[#292521] text-xs">
                      All Customer Orders ({orders.length})
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#292521]">
                      <thead className="bg-[#F8F5F0] text-[#716A63] uppercase tracking-wider text-[10px] border-b border-[#DED6CD]">
                        <tr>
                          <th className="py-3 px-4">Order #</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DED6CD]/60 font-mono-nums">
                        {orders.map((o) => (
                          <tr key={o.id} className="hover:bg-[#F8F5F0]/60">
                            <td className="py-3 px-4 font-mono font-medium text-[#292521]">{o.orderNumber}</td>
                            <td className="py-3 px-4 text-[#716A63]">{new Date(o.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 font-sans">{o.customerName}</td>
                            <td className="py-3 px-4 font-sans">{o.items.length} piece(s)</td>
                            <td className="py-3 px-4 font-semibold">₹{o.total.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-sans">
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-sans">
                              <span className="capitalize">{o.fulfillmentStatus}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="px-2.5 py-1 bg-[#F0EAE2] hover:bg-[#E5D9CC] text-[11px] uppercase tracking-wider transition-colors"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 4: INVENTORY MANAGEMENT
          ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="bg-white border border-[#DED6CD] p-6 max-w-6xl mx-auto shadow-sm">
              <h4 className="font-serif-luxury text-xl text-[#292521] uppercase tracking-wider mb-2">
                Live Inventory Audit & Low Stock Monitor
              </h4>
              <p className="text-xs text-[#716A63] mb-6">
                Directly adjust stock quantities in the database with instant storefront synchronization.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#292521]">
                  <thead className="bg-[#F8F5F0] text-[#716A63] uppercase tracking-wider text-[10px] border-b border-[#DED6CD]">
                    <tr>
                      <th className="py-3 px-4">Product ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Threshold</th>
                      <th className="py-3 px-4">Condition</th>
                      <th className="py-3 px-4 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DED6CD]/60 font-mono-nums">
                    {products.map((p) => {
                      const isLow = p.stockQuantity <= p.lowStockThreshold;
                      const isOut = p.stockQuantity === 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#F8F5F0]/60">
                          <td className="py-3 px-4 font-mono font-medium">{p.productId}</td>
                          <td className="py-3 px-4 font-sans font-medium">{p.name}</td>
                          <td className="py-3 px-4 font-sans text-[#716A63]">{p.categoryName}</td>
                          <td className="py-3 px-4 font-semibold text-sm">{p.stockQuantity}</td>
                          <td className="py-3 px-4 text-[#716A63]">{p.lowStockThreshold}</td>
                          <td className="py-3 px-4 font-sans">
                            {isOut ? (
                              <span className="text-red-700 font-semibold uppercase text-[10px]">Sold Out</span>
                            ) : isLow ? (
                              <span className="text-amber-700 font-semibold uppercase text-[10px]">Low Stock</span>
                            ) : (
                              <span className="text-emerald-700 uppercase text-[10px]">Healthy</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-sans">
                            <div className="inline-flex items-center gap-1 border border-[#DED6CD]">
                              <button
                                onClick={() => adjustStock(p.id, Math.max(0, p.stockQuantity - 1))}
                                className="px-2 py-0.5 hover:bg-[#F0EAE2] text-sm"
                              >
                                -
                              </button>
                              <span className="px-2 font-mono text-xs">{p.stockQuantity}</span>
                              <button
                                onClick={() => adjustStock(p.id, p.stockQuantity + 5)}
                                className="px-2 py-0.5 hover:bg-[#F0EAE2] text-xs font-semibold"
                                title="Add 5 units"
                              >
                                +5
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: CATEGORIES & ARTISANS
          ========================================================================= */}
          {activeTab === 'categories' && (
            <div className="bg-white border border-[#DED6CD] p-6 max-w-4xl mx-auto shadow-sm">
              <h4 className="font-serif-luxury text-xl text-[#292521] uppercase tracking-wider mb-4">
                Jewelry Categories ({categories.length})
              </h4>
              <div className="space-y-3">
                {categories.map((c) => (
                  <div key={c.id} className="p-4 border border-[#DED6CD] flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-[#292521] uppercase tracking-wider">{c.name}</h5>
                      <p className="text-xs text-[#716A63]">{c.subtitle}</p>
                    </div>
                    <span className="text-xs font-mono text-[#716A63]">Order: {c.sortOrder}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'artisans' && (
            <div className="bg-white border border-[#DED6CD] p-6 max-w-4xl mx-auto shadow-sm">
              <h4 className="font-serif-luxury text-xl text-[#292521] uppercase tracking-wider mb-4">
                Artisans & Independent Jewelers ({artisans.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artisans.map((a) => (
                  <div key={a.id} className="p-4 border border-[#DED6CD] flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#B89559]">
                      <ImageWithFallback src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="font-medium text-[#292521]">{a.name}</h5>
                      <p className="text-xs text-[#B89559] font-medium">{a.craftSpecialty}</p>
                      <p className="text-[11px] text-[#716A63]">{a.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 6: HOMEPAGE CONTENT MANAGEMENT
          ========================================================================= */}
          {activeTab === 'content' && (
            <div className="bg-white border border-[#DED6CD] p-8 max-w-3xl mx-auto shadow-sm text-xs">
              <h4 className="font-serif-luxury text-2xl text-[#292521] mb-2">
                Storefront Editorial & Announcement Customizer
              </h4>
              <p className="text-[#716A63] mb-6">
                Edit the announcement bar, hero banner heading, and thresholds live.
              </p>

              {contentSavedMsg && (
                <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {contentSavedMsg}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSiteContent(contentForm);
                  setContentSavedMsg('Storefront content updated and saved to database successfully!');
                  setTimeout(() => setContentSavedMsg(''), 2500);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                    Top Announcement Strip Text
                  </label>
                  <input
                    type="text"
                    value={contentForm.announcementText}
                    onChange={(e) => setContentForm({ ...contentForm, announcementText: e.target.value })}
                    className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 text-[#292521]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                    Free Shipping Threshold (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={contentForm.freeShippingThreshold}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, freeShippingThreshold: parseFloat(e.target.value) || 250 })
                    }
                    className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 font-mono text-[#292521]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                    Hero Main Heading
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.heroHeading}
                    onChange={(e) => setContentForm({ ...contentForm, heroHeading: e.target.value })}
                    className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 font-serif text-[#292521]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#716A63] block mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroSubheading}
                    onChange={(e) => setContentForm({ ...contentForm, heroSubheading: e.target.value })}
                    className="w-full bg-[#F8F5F0] border border-[#DED6CD] px-3 py-2 text-[#292521]"
                  />
                </div>

                <div className="pt-4 border-t border-[#DED6CD]">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#292521] hover:bg-[#B89559] text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
                  >
                    Save Storefront Content
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 7: GITHUB HOSTING GUIDE (User prompt requirement: "jisko me github ke through hosting kar saku")
          ========================================================================= */}
          {activeTab === 'github' && (
            <div className="bg-white border border-[#DED6CD] p-8 max-w-3xl mx-auto shadow-sm text-xs space-y-6">
              <div className="border-b border-[#DED6CD] pb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#B89559] font-medium block">
                  DEPLOYMENT GUIDE
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#292521]">
                  How to Host on GitHub Pages (Free & 100% Functional)
                </h3>
                <p className="text-[#716A63] mt-1">
                  Aap is website ko direct GitHub repository me push karke GitHub Pages par free me host kar sakte hain.
                </p>
              </div>

              <div className="space-y-4 text-[#292521] leading-relaxed">
                <div className="p-4 bg-[#F8F5F0] border border-[#DED6CD] space-y-2">
                  <h4 className="font-semibold text-sm text-[#292521]">Step 1: Code ko GitHub par push karein</h4>
                  <p className="text-[#716A63]">Apne terminal me ye commands run karein:</p>
                  <pre className="p-3 bg-[#292521] text-emerald-400 font-mono text-[11px] overflow-x-auto rounded-xs">
{`git init
git add .
git commit -m "Initial Kriday Gems & Jeweler Marketplace Storefront & Admin"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
git push -u origin main`}
                  </pre>
                </div>

                <div className="p-4 bg-[#F8F5F0] border border-[#DED6CD] space-y-2">
                  <h4 className="font-semibold text-sm text-[#292521]">Step 2: GitHub Pages Action Setup (Automatic Build)</h4>
                  <p className="text-[#716A63]">
                    1. GitHub repo open karein aur <strong>Settings &gt; Pages</strong> par jaayein.<br />
                    2. "Build and deployment" me <strong>Source: GitHub Actions</strong> choose karein.<br />
                    3. Static HTML / Vite template select karein, ya `npm run build` se direct `dist/` deploy ho jaayega!
                  </p>
                </div>

                <div className="p-4 bg-[#F8F5F0] border border-[#DED6CD] space-y-2">
                  <h4 className="font-semibold text-sm text-[#292521]">Step 3: Admin Panel Data Persistence</h4>
                  <p className="text-[#716A63]">
                    Sari products, orders, categories, aur inventory browser ke local storage repository engine me persist rehti hain. Agar aap koi new product add karte hain, wo turant customer storefront par live show hoga aur refresh ke baad bhi save rahega!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
