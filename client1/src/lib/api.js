const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export function getImageUrl(path) {
  if (!path) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SERVER_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Settings API
  getSettings: async () => {
    try {
      const data = await fetchApi("/settings");
      return data.settings || {};
    } catch (e) {
      return {
        companyName: "الأخوة",
        subtitle: "ALUMITAE & GLASS SOLUTIONS",
        phone: "0101335854",
        email: "contact@alalikhwa.com",
        address: "المعادي، القاهرة، مصر",
        description: "حلول ألومينتال حديثة للمنازل والفيلل والشركات بأفضل القطاعات المحلية والعالمية وتنفيذ احترافي وعزل تام.",
        copyright: "جميع الحقوق محفوظة. الأخوة للألوميتال والزجاج.",
        socialLinks: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
        },
      };
    }
  },

  // Categories API
  getCategories: async () => {
    try {
      const data = await fetchApi("/categories");
      return data.categories || [];
    } catch (e) {
      return [];
    }
  },

  // Products API
  getProducts: async (categoryId) => {
    try {
      const endpoint = categoryId ? `/products?category=${categoryId}` : "/products";
      const data = await fetchApi(endpoint);
      return data.products || [];
    } catch (e) {
      return [];
    }
  },

  // Get Single Product by ID
  getProduct: async (id) => {
    try {
      const data = await fetchApi(`/products/${id}`);
      return data.product || null;
    } catch (e) {
      return null;
    }
  },

  // About API
  getAbout: async () => {
    try {
      const data = await fetchApi("/about");
      return data.about || {};
    } catch (e) {
      return {};
    }
  },

  // Contact / Message API
  sendMessage: async (messageData) => {
    return await fetchApi("/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },
};

export default api;
