const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'حدث خطأ في الطلب');
  }
  return data;
};

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event('auth:unauthorized'));
  },

  getToken() {
    return localStorage.getItem('adminToken');
  },

  // Image Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await handleResponse(res);
    return data; // { message, url, filename }
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تحميل التصنيفات');
    return data.categories || [];
  },

  async getCategoryById(id: string) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تحميل التصنيف');
    return data.category;
  },

  async createCategory(categoryData: { name: string }) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await handleResponse(res);
    return data.category;
  },

  async updateCategory(id: string, categoryData: { name: string }) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await handleResponse(res);
    return data.category;
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  },

  // Products
  async getProducts(categoryId?: string) {
    const url = categoryId 
      ? `${API_BASE_URL}/products?category=${categoryId}`
      : `${API_BASE_URL}/products`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تحميل المنتجات');
    return data.products || [];
  },

  async getProductById(id: string) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تحميل تفاصيل المنتج');
    return data.product;
  },

  async createProduct(productData: {
    name: string;
    description: string;
    image: string;
    material: string;
    category: string;
    features?: string[];
    isVisible?: boolean;
  }) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await handleResponse(res);
    return data.product;
  },

  async updateProduct(
    id: string,
    productData: Partial<{
      name: string;
      description: string;
      image: string;
      material: string;
      category: string;
      features: string[];
      isVisible: boolean;
    }>
  ) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    const data = await handleResponse(res);
    return data.product;
  },

  async toggleProductVisibility(id: string, isVisible: boolean) {
    const res = await fetch(`${API_BASE_URL}/products/${id}/visibility`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isVisible }),
    });
    const data = await handleResponse(res);
    return data.product;
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.notifications || [];
  },

  async getUnreadNotificationCount() {
    const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.count || 0;
  },

  async markNotificationAsRead(id: string) {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.notification;
  },

  async markAllNotificationsAsRead() {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  },

  async deleteNotification(id: string) {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تحميل الإعدادات');
    return data.settings;
  },

  async updateSettings(settingsData: any) {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(settingsData),
    });
    const data = await handleResponse(res);
    return data.settings;
  },

  // About CMS
  async getAbout() {
    const res = await fetch(`${API_BASE_URL}/about`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تحميل معلومات عن الشركة');
    return data.about;
  },

  async updateAbout(aboutData: any) {
    const res = await fetch(`${API_BASE_URL}/about`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(aboutData),
    });
    const data = await handleResponse(res);
    return data.about;
  },

  // Messages / Contact Requests
  async getMessages() {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.data || [];
  },

  async getMessageById(id: string) {
    const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async markMessageAsRead(id: string) {
    const res = await fetch(`${API_BASE_URL}/messages/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async deleteMessage(id: string) {
    const res = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  },
};
