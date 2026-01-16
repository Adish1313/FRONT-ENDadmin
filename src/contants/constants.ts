export const API_URLS = {
  // Admin Auth
  ADMIN_LOGIN: "admin/auth/login",
  ADMIN_PROFILE: "admin/auth/profile",
  ADMIN_CHANGE_PASSWORD: "admin/auth/change-password",
  ADMIN_LOGOUT: "admin/auth/logout",

  // Admin Dashboard
  DASHBOARD_OVERVIEW: "admin/dashboard/overview",
  DASHBOARD_RECENT_ORDERS: "admin/dashboard/recent-orders",
  DASHBOARD_SALES_STATS: "admin/dashboard/sales-stats",
  DASHBOARD_TOP_PRODUCTS: "admin/dashboard/top-products",
  DASHBOARD_LOW_STOCK: "admin/dashboard/low-stock",

  // Admin Users
  ADMIN_USERS: "admin/users",
  ADMIN_USER_BLOCK: (id: string) => `admin/users/${id}/block`,
  ADMIN_USER_UNBLOCK: (id: string) => `admin/users/${id}/unblock`,
  ADMIN_USER_STATS: "admin/users/stats",

  // Admin Products
  ADMIN_PRODUCTS: "admin/products",
  ADMIN_PRODUCT_DETAILS: (id: string) => `admin/products/${id}`,
  ADMIN_PRODUCT_IMAGES: (id: string) => `admin/products/${id}/images`,

  // Admin Orders
  ADMIN_ORDERS: "admin/orders",
  ADMIN_ORDER_DETAILS: (id: string) => `admin/orders/${id}`,
  ADMIN_ORDER_STATUS: (id: string) => `admin/orders/${id}/status`,

  // Admin Inventory
  ADMIN_INVENTORY: "admin/inventory",
  ADMIN_STOCK_UPDATE: (id: string) => `admin/inventory/${id}`,

  // Others
  IMAGE_UPLOAD: "auth/image-upload",
};

export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  USERS: "/users",
  INVENTORY: "/inventory",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

const ENVIRONMENT = {
  ENABLE_ENCRYPTION: import.meta.env.VITE_ENABLE_ENCRYPTION,
  API_HOST: import.meta.env.VITE_API_HOST,
  S3_BUCKET_URL: import.meta.env.VITE_S3_BUCKET,
  STRING: import.meta.env.VITE_STRING,

  // CHAIN
  RPC_URL: import.meta.env.VITE_RPC_URL,
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID,
  CHAIN_SYMBOL: import.meta.env.VITE_CHAIN_SYMBOL,
  CHAIN_NAME: import.meta.env.VITE_CHAIN_NAME,

  // CONTRACT
  EXAM_CONTRACT_ADD: import.meta.env.VITE_EXAM_CONTRACT_ADD,
  STUDENT_CONTRACT_ADD: import.meta.env.VITE_STUDENT_CONTRACT_ADD,
  RSA_PRIVATE_KEY: import.meta.env.VITE_RSA_PRIVATE_KEY,

  // AWS S3 Configuration
  AWS_S3_BUCKET_NAME: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  AWS_REGION: import.meta.env.VITE_AWS_REGION,
  S3_BUCKET_CDN_LINK: import.meta.env.VITE_S3_BUCKET_CDN_LINK,
  IMAGE_KIT_URL: import.meta.env.VITE_IMAGE_KIT_URL,
};
export const ENCRYPTION_EXCLUDED = [API_URLS?.IMAGE_UPLOAD];

export default ENVIRONMENT;
