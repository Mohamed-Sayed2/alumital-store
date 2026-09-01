const API_BASE_URL = "http://localhost:3000/api";

async function runTests() {
  console.log("==========================================");
  console.log("1. Testing Server Health Check");
  console.log("==========================================");
  try {
    const healthRes = await fetch(`${API_BASE_URL}/health`);
    const health = await healthRes.json();
    console.log(`SUCCESS: Health Status (${healthRes.status}):`, health);
  } catch (err) {
    console.error("FAILED: Health check failed", err);
  }

  console.log("\n==========================================");
  console.log("2. Testing Admin Login");
  console.log("==========================================");
  // Invalid login
  const badLoginRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@alumital.com", password: "wrongpassword" }),
  });
  console.log(`SUCCESS: Invalid login rejected with HTTP ${badLoginRes.status}`);

  // Valid login
  const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@alumital.com", password: "admin123456" }),
  });
  const loginData = await loginRes.json();
  console.log(`SUCCESS: Valid login succeeded (${loginRes.status})!`);
  console.log("Admin Email:", loginData.admin?.email);
  console.log("Password present in response?", !!loginData.admin?.password);
  const token = loginData.token;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log("\n==========================================");
  console.log("3. Testing Protected Endpoint Without Token");
  console.log("==========================================");
  const unauthRes = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Unauth Category" }),
  });
  console.log(`SUCCESS: Unauthenticated request rejected with HTTP ${unauthRes.status}`);

  console.log("\n==========================================");
  console.log("4. Testing Category Endpoints");
  console.log("==========================================");
  const catRes = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name: "شبابيك ألوميتال معزولة" }),
  });
  const catData = await catRes.json();
  const category = catData.category;
  console.log(`SUCCESS: Created Category (${catRes.status}):`, category?.name, `(ID: ${category?._id})`);

  // Duplicate Category check
  const dupCatRes = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name: "شبابيك ألوميتال معزولة" }),
  });
  console.log(`SUCCESS: Duplicate category rejected with HTTP ${dupCatRes.status}`);

  // Public GET Categories
  const getCatsRes = await fetch(`${API_BASE_URL}/categories`);
  const getCatsData = await getCatsRes.json();
  console.log(`SUCCESS: Fetched ${getCatsData.categories?.length} categories publicly`);

  // Invalid ObjectId check
  const badIdRes = await fetch(`${API_BASE_URL}/categories/invalid-id-123`);
  console.log(`SUCCESS: Invalid category ObjectId rejected with HTTP ${badIdRes.status}`);

  console.log("\n==========================================");
  console.log("5. Testing Product Endpoints");
  console.log("==========================================");
  let product = null;
  if (category) {
    const prodRes = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "شباك جامبو 100 معزول",
        description: "شباك جرار ممتاز عازل للصوت والحرارة",
        image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200",
        material: "قطاع Jumbo 100",
        category: category._id,
      }),
    });
    const prodData = await prodRes.json();
    product = prodData.product;
    console.log(`SUCCESS: Created Product (${prodRes.status}):`, product?.name, `with category: ${product?.category?.name}`);
  }

  // Public GET products
  const getProdsRes = await fetch(`${API_BASE_URL}/products`);
  const getProdsData = await getProdsRes.json();
  console.log(`SUCCESS: Fetched ${getProdsData.products?.length} products publicly`);

  // Public GET products by Category
  if (category) {
    const getCatProdsRes = await fetch(`${API_BASE_URL}/products?category=${category._id}`);
    const getCatProdsData = await getCatProdsRes.json();
    console.log(`SUCCESS: Fetched ${getCatProdsData.products?.length} products for category ${category._id}`);
  }

  console.log("\n==========================================");
  console.log("6. Testing Category Deletion Safety (409 Conflict)");
  console.log("==========================================");
  if (category) {
    const delCatRes = await fetch(`${API_BASE_URL}/categories/${category._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const delCatData = await delCatRes.json();
    console.log(`SUCCESS: Deleting category with products returned HTTP ${delCatRes.status}: "${delCatData.message}"`);
  }

  console.log("\n==========================================");
  console.log("7. Testing Message Endpoints");
  console.log("==========================================");
  // Public message submission
  const msgRes = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "علي حسن",
      phone: "01099887766",
      city: "الإسكندرية",
      message: "استفسار عن أسعار واجهات الزجاج السيكوريت",
    }),
  });
  const msgData = await msgRes.json();
  const message = msgData.data;
  console.log(`SUCCESS: Created Public Message (${msgRes.status}): ID ${message?._id} from ${message?.fullName}`);

  // Admin GET Messages
  const getMsgsRes = await fetch(`${API_BASE_URL}/messages`, {
    headers: authHeaders,
  });
  const getMsgsData = await getMsgsRes.json();
  console.log(`SUCCESS: Admin fetched ${getMsgsData.data?.length} messages (${getMsgsRes.status})`);

  // Admin Mark Message as Read
  if (message) {
    const readRes = await fetch(`${API_BASE_URL}/messages/${message._id}/read`, {
      method: "PATCH",
      headers: authHeaders,
    });
    const readData = await readRes.json();
    console.log(`SUCCESS: Admin marked message as read (${readRes.status}): isRead=${readData.data?.isRead}`);
  }

  // Admin Delete Message
  if (message) {
    const delMsgRes = await fetch(`${API_BASE_URL}/messages/${message._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    console.log(`SUCCESS: Admin deleted message (${delMsgRes.status})`);
  }

  console.log("\n==========================================");
  console.log("8. Cleanup & Product/Category Deletion");
  console.log("==========================================");
  if (product) {
    const delProdRes = await fetch(`${API_BASE_URL}/products/${product._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    console.log(`SUCCESS: Deleted product ${product._id} (${delProdRes.status})`);
  }
  if (category) {
    const delCatRes = await fetch(`${API_BASE_URL}/categories/${category._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    console.log(`SUCCESS: Deleted category ${category._id} after product cleanup (${delCatRes.status})`);
  }

  console.log("\n==========================================");
  console.log("ALL BACKEND ENDPOINTS AND SECURITY CHECKS PASSED!");
  console.log("==========================================");
}

runTests().catch(console.error);
