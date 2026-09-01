import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import seedAdmin from "./src/utils/seedAdmin.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.TEST_PORT || 3005;
const API_URL = `http://localhost:${PORT}/api`;

async function main() {
  await connectDB();
  await seedAdmin();
  const server = app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
      console.log('--- STARTING END-TO-END AUTOMATED VERIFICATION ---');

      // 1. HEALTH CHECK
      const healthRes = await fetch(`${API_URL}/health`);
      const healthData = await healthRes.json();
      console.log('Health check:', healthRes.status, healthData);
      if (healthRes.status !== 200) throw new Error('Health check failed');

      // A. LOGIN TEST
      console.log('\n--- Testing Authentication ---');
      // Invalid login
      const invalidLoginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@alumital.com', password: 'wrongpassword' }),
      });
      console.log('Invalid login status:', invalidLoginRes.status);
      if (invalidLoginRes.status !== 401) throw new Error('Invalid login did not return 401');

      // Valid login
      const validLoginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@alumital.com', password: 'admin123456' }),
      });
      const loginData = await validLoginRes.json();
      console.log('Valid login status:', validLoginRes.status, 'Token acquired:', !!loginData.token);
      if (validLoginRes.status !== 200 || !loginData.token) throw new Error('Valid login failed');
      const token = loginData.token;
      const authHeader = { Authorization: `Bearer ${token}` };

      // B. IMAGE UPLOAD TEST
      console.log('\n--- Testing Image Upload ---');
      const validPngBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64'
      );

      const formData = new FormData();
      const fileBlob = new Blob([validPngBuffer], { type: 'image/png' });
      formData.append('image', fileBlob, 'test_sample.png');

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: authHeader,
        body: formData,
      });
      const uploadData = await uploadRes.json();
      console.log('Image upload status:', uploadRes.status, 'URL:', uploadData.url);
      if (uploadRes.status !== 200 || !uploadData.url) throw new Error('Image upload failed');

      // Verify public image URL resolves over HTTPS/HTTP
      const staticFileRes = await fetch(uploadData.url);
      console.log('Public image GET status:', staticFileRes.status);
      if (staticFileRes.status !== 200) throw new Error('Public image URL fetch failed');

      // C. CATEGORY & NOTIFICATIONS TEST
      console.log('\n--- Testing Category Creation & Notification ---');
      const catName = 'تصنيف تجريبي ' + Date.now();
      const createCatRes = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName }),
      });
      const catData = await createCatRes.json();
      console.log('Category creation status:', createCatRes.status, 'Category ID:', catData.category?._id);
      if (createCatRes.status !== 201) throw new Error('Category creation failed');
      const categoryId = catData.category._id;

      // Check Category Deletion 409 Safety
      console.log('\n--- Testing Product Creation, Visibility & Category 409 Safety ---');
      const createProdRes = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'شباك جرار ممتاز',
          description: 'وصف شباك جرار قطاع جامبو عالي الجودة والعزل',
          image: uploadData.url,
          material: 'ألومنيوم معزول + زجاج',
          category: categoryId,
          isVisible: true,
        }),
      });
      const prodData = await createProdRes.json();
      console.log('Product creation status:', createProdRes.status, 'Product ID:', prodData.product?._id);
      if (createProdRes.status !== 201) throw new Error('Product creation failed');
      const productId = prodData.product._id;

      // Try to delete non-empty category -> expect 409
      const deleteCatFailRes = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: authHeader,
      });
      console.log('Category deletion with products status (expected 409):', deleteCatFailRes.status);
      if (deleteCatFailRes.status !== 409) throw new Error('Expected 409 conflict when deleting non-empty category');

      // Verify Product Visibility Flow
      // 1. Client fetch (no token) -> product should appear
      const clientProds1 = await fetch(`${API_URL}/products`).then(r => r.json());
      const foundInClient1 = clientProds1.products?.some(p => p._id === productId);
      console.log('Product visible on Client initially:', foundInClient1);
      if (!foundInClient1) throw new Error('Product was expected to be visible on Client');

      // 2. Hide Product from Admin
      const hideRes = await fetch(`${API_URL}/products/${productId}/visibility`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: false }),
      });
      console.log('Hide product status:', hideRes.status);
      if (hideRes.status !== 200) throw new Error('Hiding product failed');

      // 3. Client fetch again -> product must NOT appear
      const clientProds2 = await fetch(`${API_URL}/products`).then(r => r.json());
      const foundInClient2 = clientProds2.products?.some(p => p._id === productId);
      console.log('Product visible on Client after hiding (expected false):', foundInClient2);
      if (foundInClient2) throw new Error('Hidden product unexpectedly appeared on Client');

      // 4. Admin fetch (with token) -> product MUST appear
      const adminProds = await fetch(`${API_URL}/products`, { headers: authHeader }).then(r => r.json());
      const foundInAdmin = adminProds.products?.some(p => p._id === productId);
      console.log('Product visible in Admin fetch while hidden:', foundInAdmin);
      if (!foundInAdmin) throw new Error('Hidden product failed to show up in Admin fetch');

      // 5. Show product again
      const showRes = await fetch(`${API_URL}/products/${productId}/visibility`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: true }),
      });
      console.log('Show product status:', showRes.status);

      // D. MESSAGES & NOTIFICATIONS VERIFICATION
      console.log('\n--- Testing Contact Message & Notifications API ---');
      const msgRes = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'أحمد محمود',
          phone: '01012345678',
          city: 'القاهرة',
          message: 'أحتاج استفسار عن أسعار شبابيك جامبو للفيلا',
        }),
      });
      console.log('Send contact message status:', msgRes.status);
      if (msgRes.status !== 201) throw new Error('Sending contact message failed');

      // Get notifications
      const notifsRes = await fetch(`${API_URL}/notifications`, { headers: authHeader });
      const notifsData = await notifsRes.json();
      console.log('Notifications count:', notifsData.notifications?.length);
      if (!notifsData.notifications || notifsData.notifications.length === 0) {
        throw new Error('Notifications list was empty');
      }

      // Get unread count
      const unreadRes = await fetch(`${API_URL}/notifications/unread-count`, { headers: authHeader });
      const unreadData = await unreadRes.json();
      console.log('Unread notifications count:', unreadData.count);

      // Mark first notification read
      const notifId = notifsData.notifications[0]._id;
      const readOneRes = await fetch(`${API_URL}/notifications/${notifId}/read`, {
        method: 'PATCH',
        headers: authHeader,
      });
      console.log('Mark single notification read status:', readOneRes.status);

      // Mark all read
      const readAllRes = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: authHeader,
      });
      console.log('Mark all notifications read status:', readAllRes.status);

      // E. SETTINGS CMS TEST
      console.log('\n--- Testing Settings CMS ---');
      const getSettingsRes = await fetch(`${API_URL}/settings`);
      const settingsData = await getSettingsRes.json();
      console.log('Initial settings company name:', settingsData.settings?.companyName);

      const updateSettingsRes = await fetch(`${API_URL}/settings`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '+20 123 456 7890',
          whatsapp: '+20 123 456 7890',
          email: 'contact@alalikhwa.com',
          address: 'المعادي، القاهرة، مصر',
        }),
      });
      const updatedSettingsData = await updateSettingsRes.json();
      console.log('Updated settings phone:', updatedSettingsData.settings?.phone);
      if (updatedSettingsData.settings?.phone !== '+20 123 456 7890') {
        throw new Error('Settings update failed');
      }

      // F. ABOUT CMS TEST
      console.log('\n--- Testing About CMS ---');
      const getAboutRes = await fetch(`${API_URL}/about`);
      const aboutData = await getAboutRes.json();
      console.log('Initial About title:', aboutData.about?.mainTitle);

      const updateAboutRes = await fetch(`${API_URL}/about`, {
        method: 'PATCH',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainTitle: 'عن شركة الأخوة المتخصصة للألوميتال',
          vision: 'أن نصبح أكبر مصنع واجهات زجاجية وألوميتال في الشرق الأوسط.',
        }),
      });
      const updatedAboutData = await updateAboutRes.json();
      console.log('Updated About vision:', updatedAboutData.about?.vision);
      if (updatedAboutData.about?.vision !== 'أن نصبح أكبر مصنع واجهات زجاجية وألوميتال في الشرق الأوسط.') {
        throw new Error('About update failed');
      }

      // CLEANUP TEST PRODUCT & CATEGORY
      console.log('\n--- Cleaning up Test Artifacts ---');
      await fetch(`${API_URL}/products/${productId}`, { method: 'DELETE', headers: authHeader });
      await fetch(`${API_URL}/categories/${categoryId}`, { method: 'DELETE', headers: authHeader });
      console.log('Test product and category cleaned up successfully.');

      console.log('\n==================================================');
      console.log('ALL BACKEND API AND DATA INTEGRITY TESTS PASSED!');
      console.log('==================================================');

      server.close(() => {
        process.exit(0);
      });
    } catch (err) {
      console.error('\n❌ E2E VERIFICATION TEST FAILED:', err);
      server.close(() => {
        process.exit(1);
      });
    }
  });
}

main();
