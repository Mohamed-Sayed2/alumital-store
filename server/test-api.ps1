$baseUrl = "http://localhost:3000/api"

Write-Host "=========================================="
Write-Host "1. Testing Server Health Check"
Write-Host "=========================================="
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "SUCCESS: Health Status: $($health.status) - $($health.message)"
} catch {
    Write-Host "FAILED: Health check failed: $_"
}

Write-Host "`n=========================================="
Write-Host "2. Testing Admin Login"
Write-Host "=========================================="
# Invalid login
try {
    $badLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@alumital.com","password":"wrongpassword"}'
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "SUCCESS: Invalid login rejected with HTTP $statusCode"
}

# Valid login
$token = ""
try {
    $loginResp = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@alumital.com","password":"admin123456"}'
    $token = $loginResp.token
    Write-Host "SUCCESS: Valid login succeeded! Token received."
    Write-Host "Admin Email: $($loginResp.admin.email)"
    Write-Host "Password present in response? $(!([string]::IsNullOrEmpty($loginResp.admin.password)))"
} catch {
    Write-Host "FAILED: Admin login failed: $_"
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n=========================================="
Write-Host "3. Testing Protected Endpoint Without Token"
Write-Host "=========================================="
try {
    Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -ContentType "application/json" -Body '{"name":"Test Category"}'
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "SUCCESS: Unauthenticated POST /api/categories rejected with HTTP $statusCode"
}

Write-Host "`n=========================================="
Write-Host "4. Testing Category Endpoints"
Write-Host "=========================================="
# Create category
$cat1 = $null
try {
    $catResp = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Headers $headers -Body '{"name":"شبابيك ألوميتال معزولة"}'
    $cat1 = $catResp.category
    Write-Host "SUCCESS: Created Category: $($cat1.name) (ID: $($cat1._id))"
} catch {
    Write-Host "FAILED: Create category failed: $_"
}

# Try duplicate category
try {
    Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Headers $headers -Body '{"name":"شبابيك ألوميتال معزولة"}'
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "SUCCESS: Duplicate category rejected with HTTP $statusCode"
}

# Public GET categories
try {
    $allCats = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get
    Write-Host "SUCCESS: Fetched $($allCats.categories.Count) categories publicly"
} catch {
    Write-Host "FAILED: Get categories failed: $_"
}

# Test invalid ObjectId
try {
    Invoke-RestMethod -Uri "$baseUrl/categories/invalid-id-123" -Method Get
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "SUCCESS: Invalid category ObjectId rejected with HTTP $statusCode"
}

Write-Host "`n=========================================="
Write-Host "5. Testing Product Endpoints"
Write-Host "=========================================="
$prod1 = $null
if ($cat1) {
    try {
        $prodBody = @{
            name = "شباك جامبو 100 معزول"
            description = "شباك جرار ممتاز عازل للصوت والحرارة"
            image = "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200"
            material = "قطاع Jumbo 100"
            category = $cat1._id
        } | ConvertTo-Json

        $prodResp = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Headers $headers -Body $prodBody
        $prod1 = $prodResp.product
        Write-Host "SUCCESS: Created Product: $($prod1.name) with category $($prod1.category.name)"
    } catch {
        Write-Host "FAILED: Create product failed: $_"
    }
}

# Public GET products
try {
    $allProds = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    Write-Host "SUCCESS: Fetched $($allProds.products.Count) products publicly"
} catch {
    Write-Host "FAILED: Get products failed: $_"
}

# Public GET products by Category
if ($cat1) {
    try {
        $catProds = Invoke-RestMethod -Uri "$baseUrl/products?category=$($cat1._id)" -Method Get
        Write-Host "SUCCESS: Fetched $($catProds.products.Count) products for category $($cat1._id)"
    } catch {
        Write-Host "FAILED: Get products by category failed: $_"
    }
}

Write-Host "`n=========================================="
Write-Host "6. Testing Category Deletion Safety (409 Conflict)"
Write-Host "=========================================="
if ($cat1) {
    try {
        Invoke-RestMethod -Uri "$baseUrl/categories/$($cat1._id)" -Method Delete -Headers $headers
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "SUCCESS: Deleting category with existing products rejected with HTTP $statusCode"
    }
}

Write-Host "`n=========================================="
Write-Host "7. Testing Messages Endpoints"
Write-Host "=========================================="
$msg1 = $null
# Public message submission
try {
    $msgBody = @{
        fullName = "علي حسن"
        phone = "01099887766"
        city = "الإسكندرية"
        message = "استفسار عن أسعار واجهات الزجاج السيكوريت"
    } | ConvertTo-Json -Compress

    $msgResp = Invoke-RestMethod -Uri "$baseUrl/messages" -Method Post -ContentType "application/json" -Body $msgBody
    $msg1 = $msgResp.data
    Write-Host "SUCCESS: Created Public Message: ID $($msg1._id) from $($msg1.fullName)"
} catch {
    Write-Host "FAILED: Public message submission failed: $_"
}

# Admin GET messages
try {
    $adminMsgs = Invoke-RestMethod -Uri "$baseUrl/messages" -Method Get -Headers $headers
    Write-Host "SUCCESS: Admin fetched $($adminMsgs.data.Count) messages"
} catch {
    Write-Host "FAILED: Admin get messages failed: $_"
}

# Admin Mark message as read
if ($msg1) {
    try {
        $readResp = Invoke-RestMethod -Uri "$baseUrl/messages/$($msg1._id)/read" -Method Patch -Headers $headers
        Write-Host "SUCCESS: Marked message $($msg1._id) as read: isRead=$($readResp.data.isRead)"
    } catch {
        Write-Host "FAILED: Mark message as read failed: $_"
    }
}

# Clean up test product and category
Write-Host "`n=========================================="
Write-Host "8. Cleanup & Product Deletion"
Write-Host "=========================================="
if ($prod1) {
    try {
        $delProd = Invoke-RestMethod -Uri "$baseUrl/products/$($prod1._id)" -Method Delete -Headers $headers
        Write-Host "SUCCESS: Deleted product $($prod1._id)"
    } catch {
        Write-Host "FAILED: Delete product failed: $_"
    }
}
if ($cat1) {
    try {
        $delCat = Invoke-RestMethod -Uri "$baseUrl/categories/$($cat1._id)" -Method Delete -Headers $headers
        Write-Host "SUCCESS: Deleted category $($cat1._id) after product cleanup"
    } catch {
        Write-Host "FAILED: Delete category failed: $_"
    }
}

Write-Host "`n=========================================="
Write-Host "API VERIFICATION TEST SUITE COMPLETE"
Write-Host "=========================================="
