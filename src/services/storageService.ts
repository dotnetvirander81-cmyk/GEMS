import {
  Product,
  Category,
  Artisan,
  Order,
  Review,
  JournalArticle,
  SiteContent,
  Customer,
  CartItem,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ARTISANS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_JOURNAL_ARTICLES,
  INITIAL_SITE_CONTENT,
  INITIAL_CUSTOMERS,
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'craftcode_products_v2',
  CATEGORIES: 'craftcode_categories_v2',
  ARTISANS: 'craftcode_artisans_v2',
  ORDERS: 'craftcode_orders_v2',
  REVIEWS: 'craftcode_reviews_v2',
  JOURNAL: 'craftcode_journal_v2',
  CONTENT: 'craftcode_content_v2',
  CUSTOMERS: 'craftcode_customers_v2',
  CART: 'craftcode_cart_v2',
  WISHLIST: 'craftcode_wishlist_v2',
  ADMIN_AUTH: 'craftcode_admin_session_v2',
  SUBSCRIBERS: 'craftcode_subscribers_v2',
  CURRENT_USER: 'craftcode_current_user_v2',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener notification error:', e);
    }
  });
};

export const subscribeToStorage = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Storage get error for ${key}:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Storage set error for ${key}:`, err);
  }
}

/* =========================================================================
   PRODUCTS REPOSITORY
========================================================================= */

export const getProducts = (includeAllStatus = false): Product[] => {
  const products = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  if (includeAllStatus) return products;
  return products.filter((p) => p.status === 'active');
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts(true);
  return products.find((p) => p.id === id || p.productId === id || p.slug === id);
};

export const generateNextProductId = (categorySlug: string): string => {
  const prefixMap: Record<string, string> = {
    rings: 'CC-RING',
    necklaces: 'CC-NECK',
    earrings: 'CC-EARR',
    bracelets: 'CC-BRAC',
    'custom-made': 'CC-CUST',
    wedding: 'CC-WEDD',
  };
  const prefix = prefixMap[categorySlug.toLowerCase()] || 'CC-JEWL';
  const products = getProducts(true);
  const matching = products.filter((p) => p.productId.startsWith(prefix));
  const nextNum = matching.length + 1;
  return `${prefix}-${String(nextNum).padStart(4, '0')}`;
};

export const saveProduct = (
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): { success: boolean; product?: Product; error?: string } => {
  const products = getProducts(true);
  const now = new Date().toISOString();

  // Validate required fields
  if (!productData.productId || !productData.productId.trim()) {
    return { success: false, error: 'Product ID is mandatory and cannot be empty.' };
  }
  if (!productData.name || !productData.name.trim()) {
    return { success: false, error: 'Product Name is required.' };
  }
  if (productData.price <= 0 || isNaN(productData.price)) {
    return { success: false, error: 'Valid price greater than $0 is required.' };
  }

  const cleanProductId = productData.productId.trim().toUpperCase();

  // Check unique Product ID
  const duplicate = products.find(
    (p) => p.productId.toUpperCase() === cleanProductId && p.id !== productData.id
  );
  if (duplicate) {
    return {
      success: false,
      error: `Product ID "${cleanProductId}" is already assigned to "${duplicate.name}". Each piece must have a unique Product ID.`,
    };
  }

  let updatedList: Product[];
  let savedProduct: Product;

  if (productData.id) {
    // Update existing
    const existingIndex = products.findIndex((p) => p.id === productData.id);
    if (existingIndex === -1) {
      return { success: false, error: 'Product not found in database.' };
    }
    savedProduct = {
      ...products[existingIndex],
      ...productData,
      productId: cleanProductId,
      id: productData.id,
      updatedAt: now,
    };
    updatedList = [...products];
    updatedList[existingIndex] = savedProduct;
  } else {
    // Insert new
    savedProduct = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: cleanProductId,
      createdAt: now,
      updatedAt: now,
    };
    updatedList = [savedProduct, ...products];
  }

  setStoredItem(STORAGE_KEYS.PRODUCTS, updatedList);
  return { success: true, product: savedProduct };
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts(true);
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  setStoredItem(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
};

export const duplicateProduct = (id: string): { success: boolean; product?: Product; error?: string } => {
  const original = getProductById(id);
  if (!original) return { success: false, error: 'Product not found' };

  const newProductId = `${original.productId}-COPY-${Math.floor(Math.random() * 900 + 100)}`;
  const clone: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
    ...original,
    productId: newProductId,
    sku: `${original.sku}-COPY`,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    status: 'draft',
    isFeatured: false,
  };
  return saveProduct(clone);
};

export const adjustStock = (productId: string, newStock: number): boolean => {
  const products = getProducts(true);
  const index = products.findIndex((p) => p.id === productId || p.productId === productId);
  if (index === -1) return false;

  products[index] = {
    ...products[index],
    stockQuantity: Math.max(0, newStock),
    updatedAt: new Date().toISOString(),
  };
  setStoredItem(STORAGE_KEYS.PRODUCTS, products);
  return true;
};

/* =========================================================================
   CATEGORIES REPOSITORY
========================================================================= */

export const getCategories = (): Category[] => {
  return getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
};

export const saveCategory = (category: Category): void => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  setStoredItem(STORAGE_KEYS.CATEGORIES, categories);
};

/* =========================================================================
   ARTISANS REPOSITORY
========================================================================= */

export const getArtisans = (): Artisan[] => {
  return getStoredItem<Artisan[]>(STORAGE_KEYS.ARTISANS, INITIAL_ARTISANS);
};

export const saveArtisan = (artisan: Artisan): void => {
  const artisans = getArtisans();
  const index = artisans.findIndex((a) => a.id === artisan.id);
  if (index >= 0) {
    artisans[index] = artisan;
  } else {
    artisans.push(artisan);
  }
  setStoredItem(STORAGE_KEYS.ARTISANS, artisans);
};

/* =========================================================================
   ORDERS REPOSITORY
========================================================================= */

export const getOrders = (): Order[] => {
  return getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
};

export const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
  const orders = getOrders();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber: `CC-ORD-${randomNum}`,
    date: new Date().toISOString(),
  };

  // Safely decrement inventory for each purchased item
  const products = getProducts(true);
  for (const item of newOrder.items) {
    const prodIndex = products.findIndex((p) => p.id === item.productId || p.productId === item.productId);
    if (prodIndex >= 0) {
      products[prodIndex].stockQuantity = Math.max(0, products[prodIndex].stockQuantity - item.quantity);
      products[prodIndex].updatedAt = new Date().toISOString();
    }
  }
  setStoredItem(STORAGE_KEYS.PRODUCTS, products);

  // Update customer order count
  updateCustomerOrderStats(newOrder.customerEmail, newOrder.customerName, newOrder.total);

  // Clear current cart
  clearCart();

  const updatedOrders = [newOrder, ...orders];
  setStoredItem(STORAGE_KEYS.ORDERS, updatedOrders);
  return newOrder;
};

export const updateOrderStatus = (
  orderId: string,
  fulfillmentStatus: Order['fulfillmentStatus'],
  paymentStatus?: Order['paymentStatus'],
  trackingNumber?: string,
  carrier?: string
): boolean => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return false;

  orders[index].fulfillmentStatus = fulfillmentStatus;
  if (paymentStatus) orders[index].paymentStatus = paymentStatus;
  if (trackingNumber !== undefined) orders[index].trackingNumber = trackingNumber;
  if (carrier !== undefined) orders[index].carrier = carrier;

  setStoredItem(STORAGE_KEYS.ORDERS, orders);
  return true;
};

/* =========================================================================
   CUSTOMERS REPOSITORY
========================================================================= */

export const getCustomers = (): Customer[] => {
  return getStoredItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
};

const updateCustomerOrderStats = (email: string, name: string, orderTotal: number) => {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());
  if (index >= 0) {
    customers[index].ordersCount += 1;
    customers[index].totalSpent += orderTotal;
  } else {
    customers.push({
      id: `cust-${Date.now()}`,
      name,
      email,
      ordersCount: 1,
      totalSpent: orderTotal,
      registeredDate: new Date().toISOString().split('T')[0],
    });
  }
  setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);
};

/* =========================================================================
   CART & WISHLIST REPOSITORY
========================================================================= */

export const getCart = (): CartItem[] => {
  return getStoredItem<CartItem[]>(STORAGE_KEYS.CART, []);
};

export const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedVariant?: string): CartItem[] => {
  const cart = getCart();
  const existing = cart.find(
    (item) =>
      item.productId === product.id &&
      item.selectedSize === selectedSize &&
      item.selectedVariant === selectedVariant
  );

  if (existing) {
    existing.quantity = Math.min(product.stockQuantity, existing.quantity + quantity);
  } else {
    cart.push({
      productId: product.id,
      product,
      quantity: Math.min(product.stockQuantity, quantity),
      selectedSize,
      selectedVariant,
      price: product.salePrice ?? product.price,
    });
  }

  setStoredItem(STORAGE_KEYS.CART, cart);
  return cart;
};

export const updateCartItemQuantity = (
  productId: string,
  quantity: number,
  selectedSize?: string,
  selectedVariant?: string
): CartItem[] => {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(
      (item) =>
        !(item.productId === productId && item.selectedSize === selectedSize && item.selectedVariant === selectedVariant)
    );
  } else {
    const item = cart.find(
      (i) =>
        i.productId === productId &&
        i.selectedSize === selectedSize &&
        i.selectedVariant === selectedVariant
    );
    if (item) {
      item.quantity = Math.min(item.product.stockQuantity, quantity);
    }
  }
  setStoredItem(STORAGE_KEYS.CART, cart);
  return cart;
};

export const removeFromCart = (productId: string, selectedSize?: string, selectedVariant?: string): CartItem[] => {
  return updateCartItemQuantity(productId, 0, selectedSize, selectedVariant);
};

export const clearCart = (): void => {
  setStoredItem(STORAGE_KEYS.CART, []);
};

export const getWishlist = (): string[] => {
  return getStoredItem<string[]>(STORAGE_KEYS.WISHLIST, ['prod-1', 'prod-3']);
};

export const toggleWishlist = (productId: string): boolean => {
  const list = getWishlist();
  let next: string[];
  let isSaved: boolean;
  if (list.includes(productId)) {
    next = list.filter((id) => id !== productId);
    isSaved = false;
  } else {
    next = [...list, productId];
    isSaved = true;
  }
  setStoredItem(STORAGE_KEYS.WISHLIST, next);
  return isSaved;
};

/* =========================================================================
   JOURNAL & REVIEWS REPOSITORY
========================================================================= */

export const getJournalArticles = (): JournalArticle[] => {
  return getStoredItem<JournalArticle[]>(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL_ARTICLES);
};

export const getReviews = (): Review[] => {
  return getStoredItem<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
};

export const addReview = (review: Omit<Review, 'id' | 'date' | 'isApproved' | 'isVerified'>): Review => {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    isVerified: true,
    isApproved: true,
    isHomepageFeatured: false,
  };
  setStoredItem(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);
  return newReview;
};

/* =========================================================================
   SITE CONTENT & NEWSLETTER REPOSITORY
========================================================================= */

export const getSiteContent = (): SiteContent => {
  return getStoredItem<SiteContent>(STORAGE_KEYS.CONTENT, INITIAL_SITE_CONTENT);
};

export const saveSiteContent = (content: SiteContent): void => {
  setStoredItem(STORAGE_KEYS.CONTENT, content);
};

export const subscribeEmail = (email: string): { success: boolean; message: string } => {
  if (!email || !email.includes('@') || !email.includes('.')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  const subs = getStoredItem<string[]>(STORAGE_KEYS.SUBSCRIBERS, [
    'collector@artisanlovers.com',
    'editor@jewelryjournal.com',
  ]);
  const clean = email.trim().toLowerCase();
  if (subs.includes(clean)) {
    return { success: true, message: 'You are already subscribed to the journal and private releases!' };
  }
  subs.push(clean);
  setStoredItem(STORAGE_KEYS.SUBSCRIBERS, subs);
  return { success: true, message: 'Welcome to Kriday! Check your inbox for your 10% welcome gift.' };
};

export const getSubscribers = (): string[] => {
  return getStoredItem<string[]>(STORAGE_KEYS.SUBSCRIBERS, [
    'collector@artisanlovers.com',
    'editor@jewelryjournal.com',
  ]);
};

/* =========================================================================
   ADMIN AUTHENTICATION
========================================================================= */

export interface AdminSession {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  };
  token: string;
  loginAt: string;
}

export const getAdminSession = (): AdminSession | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const verifyAdminLogin = (password: string, email = 'admin@kriday.com'): boolean => {
  // Production authentication check
  // Default passkey for the marketplace master administrator: 'artisan2026'
  const cleanEmail = email.trim().toLowerCase();
  if (
    (cleanEmail === 'admin@kriday.com' ||
      cleanEmail === 'admin@craftandcode.com' ||
      cleanEmail === 'admin') &&
    password === 'artisan2026'
  ) {
    const session: AdminSession = {
      isAuthenticated: true,
      user: {
        name: 'Kriday Master Admin',
        email: 'admin@kriday.com',
        role: 'super_admin',
      },
      token: `sess_${Date.now()}_auth_${Math.random().toString(36).substring(2)}`,
      loginAt: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(session));
    notifyListeners();
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  notifyListeners();
};

export const resetDatabaseToDefaults = (): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.ARTISANS, JSON.stringify(INITIAL_ARTISANS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(INITIAL_JOURNAL_ARTICLES));
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(INITIAL_SITE_CONTENT));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.removeItem(STORAGE_KEYS.CART);
  notifyListeners();
};
