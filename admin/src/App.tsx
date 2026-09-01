import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { AddProduct } from './pages/AddProduct';
import { ProductDetails } from './pages/ProductDetails';
import { Categories } from './pages/Categories';
import { ContactRequests } from './pages/ContactRequests';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { api } from './services/api';
import { Product, Category, ContactRequest, NotificationItem } from './types';

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(api.getToken());
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for unauthorized 401 events to return to Login screen cleanly
  useEffect(() => {
    const handleUnauthorized = () => setToken(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const catsData = await api.getCategories();
      const formattedCats: Category[] = (catsData || []).map((c: any) => ({
        id: c._id || c.id,
        name: c.name,
        productCount: 0,
        image: c.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        iconName: 'LayoutGrid',
      }));
      setCategories(formattedCats);

      const prodsData = await api.getProducts();
      const formattedProds: Product[] = (prodsData || []).map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        code: p._id ? p._id.slice(-6).toUpperCase() : 'PROD',
        category: typeof p.category === 'object' ? p.category.name : p.category,
        material: p.material,
        description: p.description,
        features: Array.isArray(p.features) ? p.features : [],
        status: 'active',
        isVisible: p.isVisible !== false,
        createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-EG') : 'الآن',
        image: p.image || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200',
      }));
      setProducts(formattedProds);

      if (token) {
        try {
          const msgsData = await api.getMessages();
          const formattedMsgs: ContactRequest[] = (msgsData || []).map((m: any) => ({
            id: m._id || m.id,
            clientName: m.fullName,
            phone: m.phone,
            email: m.city || 'غير محددة',
            requestType: 'طلب تواصل',
            message: m.message,
            date: m.createdAt ? new Date(m.createdAt).toLocaleDateString('ar-EG') : 'الآن',
            status: m.isRead ? 'replied' : 'new',
          }));
          setContactRequests(formattedMsgs);
        } catch (e) {
          setContactRequests([]);
        }

        try {
          const notifsData = await api.getNotifications();
          const formattedNotifs: NotificationItem[] = (notifsData || []).map((n: any) => ({
            id: n._id || n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            isRead: n.isRead,
            createdAt: n.createdAt,
            relatedId: n.relatedId,
            relatedType: n.relatedType,
          }));
          setNotifications(formattedNotifs);
        } catch (e) {
          setNotifications([]);
        }
      }
    } catch (e) {
      console.error('Error loading API data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Categories CRUD
  const handleAddCategory = async (newCat: Category) => {
    const created = await api.createCategory({ name: newCat.name });
    if (created) {
      await loadData();
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    const updated = await api.updateCategory(id, { name });
    if (updated) {
      await loadData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await api.deleteCategory(id);
    await loadData();
  };

  // Products CRUD & Visibility
  const handleAddProduct = async (newProduct: Product) => {
    const created = await api.createProduct({
      name: newProduct.name,
      description: newProduct.description,
      image: newProduct.image,
      material: newProduct.material,
      category: newProduct.category,
      features: newProduct.features || [],
      isVisible: newProduct.isVisible,
    });
    if (created) {
      await loadData();
    }
  };

  const handleUpdateProduct = async (id: string, updatedData: any) => {
    const updated = await api.updateProduct(id, updatedData);
    if (updated) {
      await loadData();
    }
  };

  const handleToggleProductVisibility = async (id: string, isVisible: boolean) => {
    const updated = await api.toggleProductVisibility(id, isVisible);
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isVisible: updated.isVisible } : p))
      );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    await loadData();
  };

  // Messages CRUD
  const handleMarkAsRead = async (id: string) => {
    const updated = await api.markMessageAsRead(id);
    if (updated) {
      setContactRequests((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'replied' } : m))
      );
    }
  };

  const handleDeleteRequest = async (id: string) => {
    await api.deleteMessage(id);
    setContactRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Notifications CRUD
  const handleMarkNotificationAsRead = async (id: string) => {
    await api.markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = async () => {
    await api.markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = async (id: string) => {
    await api.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  if (!token) {
    return <Login onLoginSuccess={() => setToken(api.getToken())} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout unreadNotificationsCount={unreadNotificationsCount} />}>
          <Route
            index
            element={
              <Dashboard
                products={products}
                categories={categories}
                contactRequests={contactRequests}
                notifications={notifications}
                onDeleteProduct={handleDeleteProduct}
                loading={loading}
              />
            }
          />
          <Route
            path="products"
            element={
              <Products
                products={products}
                categories={categories}
                onDeleteProduct={handleDeleteProduct}
                onToggleVisibility={handleToggleProductVisibility}
                loading={loading}
              />
            }
          />
          <Route
            path="products/new"
            element={
              <AddProduct
                categories={categories}
                onAddProduct={handleAddProduct}
              />
            }
          />
          <Route
            path="products/:id"
            element={
              <ProductDetails
                products={products}
                categories={categories}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProduct={handleUpdateProduct}
              />
            }
          />
          <Route
            path="categories"
            element={
              <Categories
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                loading={loading}
              />
            }
          />
          <Route
            path="contact-requests"
            element={
              <ContactRequests
                requests={contactRequests}
                onMarkAsRead={handleMarkAsRead}
                onDeleteRequest={handleDeleteRequest}
                loading={loading}
              />
            }
          />
          <Route
            path="notifications"
            element={
              <Notifications
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onDeleteNotification={handleDeleteNotification}
                loading={loading}
              />
            }
          />
          <Route
            path="settings"
            element={<Settings />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
