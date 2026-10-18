export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size 6" or "14k Yellow Gold"
  sku: string;
  stock: number;
  priceDelta?: number;
}

export interface Product {
  id: string; // internal UUID
  productId: string; // User-facing unique Product ID, e.g. "CC-RING-0001"
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  categoryName: string;
  artisanId: string;
  artisanName: string;
  price: number;
  salePrice?: number;
  currency: string;
  mainImage: string;
  images: string[];
  material: string;
  gemstone?: string;
  availableSizes?: string[];
  variants?: ProductVariant[];
  stockQuantity: number;
  lowStockThreshold: number;
  weight?: string;
  dimensions?: string;
  shippingInfo?: string;
  returnEligibility?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  iconName: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Artisan {
  id: string;
  name: string;
  location: string;
  avatar: string;
  shortBio: string;
  fullBio: string;
  craftSpecialty: string;
  joinedYear: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedVariant?: string;
  selectedSize?: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSku: string;
  price: number;
  quantity: number;
  variant?: string;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CC-ORD-8921"
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: 'credit_card' | 'cod' | 'paypal';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  location?: string;
  date: string;
  isVerified: boolean;
  isApproved: boolean;
  isHomepageFeatured: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readTime: string;
  date: string;
  author: string;
  isPublished: boolean;
}

export interface SiteContent {
  announcementText: string;
  announcementLinkText?: string;
  freeShippingThreshold: number;
  heroHeading: string;
  heroSubheading: string;
  heroButtonText: string;
  heroImage: string;
  materialsHeading: string;
  materialsDescription: string;
  newsletterHeading: string;
  newsletterDescription: string;
  currencySymbol: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  registeredDate: string;
  defaultAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
