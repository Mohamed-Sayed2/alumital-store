# Products

GET    /api/products          // كل المنتجات
GET    /api/products/:id      // بيانات منتج واحد (للتعديل)
POST   /api/products          // إضافة منتج
PATCH  /api/products/:id      // تعديل منتج
DELETE /api/products/:id      // حذف منتج
---

# Categories

GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
## Delete Category

DELETE /api/categories/:id

Behavior:
- Delete the category.
- Delete all products that belong to this category.
---

# Messages

POST   /api/messages
GET    /api/messages
PATCH /api/messages/:id

---

# Admin

POST   /api/admin/login