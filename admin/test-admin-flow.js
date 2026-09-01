const API_BASE_URL = "http://localhost:3000/api";

async function runAdminFlowTest() {
  console.log("==========================================");
  console.log("ADMIN DASHBOARD FULL INTEGRATION VERIFICATION");
  console.log("==========================================");

  // 1. Invalid Login Test
  console.log("\n[Scenario 1] Testing Invalid Login");
  const badRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@alumital.com", password: "wrong" }),
  });
  console.log(`-> Invalid login rejected with status ${badRes.status} (Expected 401)`);

  // 2. Valid Login Test
  console.log("\n[Scenario 2] Testing Valid Admin Login");
  const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@alumital.com", password: "admin123456" }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`-> Login success status ${loginRes.status}. Token received: ${!!token}`);
  console.log(`-> Admin profile email: ${loginData.admin?.email}`);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 3. Categories Management
  console.log("\n[Scenario 3] Testing Categories CRUD");
  // Create Category
  const createCatRes = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: "تصنيف تجريبي جديد" }),
  });
  const createCatData = await createCatRes.json();
  const cat = createCatData.category;
  console.log(`-> Category created (${createCatRes.status}): "${cat?.name}" (ID: ${cat?._id})`);

  // Edit Category
  const editCatRes = await fetch(`${API_BASE_URL}/categories/${cat._id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name: "تصنيف تجريبي مٌعدل" }),
  });
  const editCatData = await editCatRes.json();
  console.log(`-> Category edited (${editCatRes.status}): "${editCatData.category?.name}"`);

  // 4. Products Management
  console.log("\n[Scenario 4] Testing Products CRUD with Category ObjectId");
  // Create Product
  const createProdRes = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "منتج تجريبي ألوميتال",
      description: "وصف منتج تجريبي واجهة زجاجية",
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200",
      material: "قطاع Jumbo 100",
      category: cat._id,
    }),
  });
  const createProdData = await createProdRes.json();
  const prod = createProdData.product;
  console.log(`-> Product created (${createProdRes.status}): "${prod?.name}" linked to Category "${prod?.category?.name}"`);

  // Edit Product
  const editProdRes = await fetch(`${API_BASE_URL}/products/${prod._id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      name: "منتج تجريبي مٌعدل",
      material: "قطاع PS 50 مٌعدل",
    }),
  });
  const editProdData = await editProdRes.json();
  console.log(`-> Product edited (${editProdRes.status}): "${editProdData.product?.name}" (${editProdData.product?.material})`);

  // 5. Category Deletion Conflict Safety (HTTP 409)
  console.log("\n[Scenario 5] Testing Category Deletion Conflict Safety (HTTP 409)");
  const delCatConflictRes = await fetch(`${API_BASE_URL}/categories/${cat._id}`, {
    method: "DELETE",
    headers,
  });
  const delCatConflictData = await delCatConflictRes.json();
  console.log(`-> Delete category with existing products returned HTTP ${delCatConflictRes.status}: "${delCatConflictData.message}"`);

  // 6. Messages Management
  console.log("\n[Scenario 6] Testing Client Messages Management");
  // Submit Public Message
  const sendMsgRes = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "محمد أحمد",
      phone: "01000000000",
      city: "القاهرة",
      message: "طلب تسعير شباك ألوميتال",
    }),
  });
  const sendMsgData = await sendMsgRes.json();
  const msg = sendMsgData.data;
  console.log(`-> Public message created (${sendMsgRes.status}): ID ${msg?._id} from ${msg?.fullName}`);

  // Fetch Messages as Admin
  const getMsgsRes = await fetch(`${API_BASE_URL}/messages`, { headers });
  const getMsgsData = await getMsgsRes.json();
  console.log(`-> Admin fetched ${getMsgsData.data?.length} messages (${getMsgsRes.status})`);

  // Mark Message as Read
  const readRes = await fetch(`${API_BASE_URL}/messages/${msg._id}/read`, {
    method: "PATCH",
    headers,
  });
  const readData = await readRes.json();
  console.log(`-> Marked message as read (${readRes.status}): isRead = ${readData.data?.isRead}`);

  // Delete Message
  const delMsgRes = await fetch(`${API_BASE_URL}/messages/${msg._id}`, {
    method: "DELETE",
    headers,
  });
  console.log(`-> Deleted message (${delMsgRes.status})`);

  // 7. Cleanup & Teardown
  console.log("\n[Scenario 7] Cleanup Product & Category");
  const delProdRes = await fetch(`${API_BASE_URL}/products/${prod._id}`, {
    method: "DELETE",
    headers,
  });
  console.log(`-> Deleted product (${delProdRes.status})`);

  const delCatRes = await fetch(`${API_BASE_URL}/categories/${cat._id}`, {
    method: "DELETE",
    headers,
  });
  console.log(`-> Deleted category after product cleanup (${delCatRes.status})`);

  // 8. Invalid JWT Protection
  console.log("\n[Scenario 8] Testing Invalid JWT Protection");
  const unauthRes = await fetch(`${API_BASE_URL}/messages`, {
    headers: { Authorization: "Bearer invalid_token_123" },
  });
  console.log(`-> Invalid JWT request rejected with HTTP ${unauthRes.status} (Expected 401)`);

  console.log("\n==========================================");
  console.log("ADMIN DASHBOARD FULL INTEGRATION VERIFICATION COMPLETE!");
  console.log("==========================================");
}

runAdminFlowTest().catch(console.error);
