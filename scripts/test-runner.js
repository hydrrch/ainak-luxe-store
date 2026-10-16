const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTestSuite() {
  console.log(`\n======================================================`);
  console.log(`Starting OptiStyle / Ainak Luxe Full-Stack Verification Suite`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  try {
    // 1. Homepage & Static HTML Verification
    console.log(`[Test 1] Storefront Homepage & Metadata`);
    const homeRes = await fetch(`${BASE_URL}/`);
    assert(homeRes.status === 200, "Homepage returns HTTP 200 OK");
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes("AINAK") || homeHtml.includes("Ainak"), "Homepage contains brand identity");
    assert(homeHtml.includes("Virtual Try-On") || homeHtml.includes("Virtual"), "Homepage contains Virtual Try-On references");

    // 2. Virtual Try-On SVG Assets Verification
    console.log(`\n[Test 2] Virtual Try-On Transparent Frame Overlays`);
    const svgAssets = [
      "/glasses/wayfarer-black.svg",
      "/glasses/aviator-gold.svg",
      "/glasses/round-metal.svg",
      "/glasses/cat-eye.svg",
      "/glasses/transparent-crystal.svg",
      "/glasses/clubmaster.svg",
    ];
    for (const asset of svgAssets) {
      const assetRes = await fetch(`${BASE_URL}${asset}`);
      assert(assetRes.status === 200, `Asset ${asset} returns HTTP 200`);
      const svgText = await assetRes.text();
      assert(svgText.includes("<svg"), `Asset ${asset} is a valid SVG document`);
    }

    // 3. Products Catalogue & Real Database Filtering
    console.log(`\n[Test 3] Products Catalogue & Database Query Filtering`);
    const productsRes = await fetch(`${BASE_URL}/api/products`);
    assert(productsRes.status === 200, "GET /api/products returns HTTP 200");
    const productsData = await productsRes.json();
    assert(Array.isArray(productsData.products), "Products returned as array");
    assert(productsData.products.length >= 10, `Found ${productsData.products.length} products in database`);
    assert(productsData.facets && productsData.facets.brands.length > 0, "Brand facets returned");

    // Test search filter
    const searchRes = await fetch(`${BASE_URL}/api/products?search=Ray-Ban`);
    const searchData = await searchRes.json();
    assert(searchData.products.every(p => p.name.includes("Ray-Ban") || p.brand.name.includes("Ray-Ban")), "Search by 'Ray-Ban' returned only matching products");

    // Test shape filter
    const shapeRes = await fetch(`${BASE_URL}/api/products?shape=AVIATOR`);
    const shapeData = await shapeRes.json();
    assert(shapeData.products.every(p => p.frameShape === "AVIATOR"), "Shape filter AVIATOR returned matching products");

    // Test price range filter
    const priceRes = await fetch(`${BASE_URL}/api/products?minPrice=5000&maxPrice=15000`);
    const priceData = await priceRes.json();
    assert(priceData.products.every(p => p.basePrice >= 5000 && p.basePrice <= 15000), "Price range filter 5000-15000 respected");

    // 4. Single Product Detail API
    console.log(`\n[Test 4] Product Detail API with Lens Options & Reviews`);
    const sampleProduct = productsData.products[0];
    const detailRes = await fetch(`${BASE_URL}/api/products/${sampleProduct.slug}`);
    assert(detailRes.status === 200, `Product detail ${sampleProduct.slug} returns HTTP 200`);
    const detailData = await detailRes.json();
    assert(detailData.product.id === sampleProduct.id, "Correct product retrieved");
    assert(Array.isArray(detailData.lensOptions), "Lens options list included");
    assert(detailData.lensOptions.length >= 5, "Includes Blue Cut, Anti-Glare, Photochromic, and Progressive lenses");

    // 5. Customer Authentication
    console.log(`\n[Test 5] Customer Authentication & Session Cookies`);
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPassword = "Password123!@#";

    // Register
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Customer PK",
        email: testEmail,
        password: testPassword,
        phone: "03001234567",
      }),
    });
    assert(regRes.status === 200, "Registration returns HTTP 200");
    const regCookie = regRes.headers.get("set-cookie") || "";
    assert(regCookie.includes("optistyle_token"), "Auth token cookie set upon registration");

    // Login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    assert(loginRes.status === 200, "Login returns HTTP 200");
    const loginCookie = loginRes.headers.get("set-cookie") || "";
    const tokenCookieStr = loginCookie.split(";")[0];

    // Auth Me Profile
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: tokenCookieStr },
    });
    const meData = await meRes.json();
    assert(meData.user && meData.user.email === testEmail, "Current user profile matches logged in account");

    // 6. Shopping Cart & Coupon Discount Calculation
    console.log(`\n[Test 6] Shopping Cart, Prescription Storage & Coupon Engine`);
    const selectedLens = detailData.lensOptions.find(l => l.price > 0) || detailData.lensOptions[0];

    // Add item to cart with prescription
    const addCartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: tokenCookieStr,
      },
      body: JSON.stringify({
        productId: sampleProduct.id,
        lensOptionId: selectedLens?.id,
        quantity: 1,
        prescriptionType: "DISTANCE",
        sphereOD: "-2.00",
        cylinderOD: "-0.50",
        axisOD: "180",
        sphereOS: "-1.75",
        cylinderOS: "0.00",
        axisOS: "0",
        pupillaryDistance: "63",
      }),
    });
    assert(addCartRes.status === 200, "Added product to cart with custom prescription");
    const cartData = await addCartRes.json();
    assert(cartData.cart.items.length >= 1, "Cart item created");
    const item = cartData.cart.items[0];
    assert(item.sphereOD === "-2.00", "Prescription right eye sphere saved");
    assert(item.pupillaryDistance === "63", "Pupillary distance saved");

    // Test Coupon Validation
    const couponRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "AINAK10",
        cartSubtotal: cartData.totals.subtotal,
      }),
    });
    assert(couponRes.status === 200, "Coupon AINAK10 validated successfully");
    const couponData = await couponRes.json();
    assert(couponData.valid === true, "Coupon valid flag true");
    assert(couponData.discountValue === 10, "10% percentage discount recognized");

    // 7. Pakistani Checkout & Cash on Delivery (COD) Order Placement
    console.log(`\n[Test 7] Checkout Flow with Pakistani Address & COD`);
    const checkoutRes = await fetch(`${BASE_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: tokenCookieStr,
      },
      body: JSON.stringify({
        customerName: "Test Customer PK",
        customerEmail: testEmail,
        customerPhone: "0300-9876543",
        streetAddress: "House 14-A, Street 3, DHA Phase 5",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54000",
        paymentMethod: "COD",
        couponCode: "AINAK10",
        notes: "Call upon arrival at DHA gate",
      }),
    });
    assert(checkoutRes.status === 200, "Order placed successfully with COD");
    const orderData = await checkoutRes.json();
    assert(orderData.success === true, "Order success confirmed");
    assert(orderData.orderNumber.startsWith("OPT-"), `Valid order number generated: ${orderData.orderNumber}`);

    // Verify cart is now empty
    const emptyCartRes = await fetch(`${BASE_URL}/api/cart`, {
      headers: { Cookie: tokenCookieStr },
    });
    const emptyCartData = await emptyCartRes.json();
    assert(emptyCartData.cart.items.length === 0, "Cart cleared after checkout");

    // 8. Order Tracking & Customer History
    console.log(`\n[Test 8] Customer Order Lookup & Public Tracking`);
    const trackRes = await fetch(`${BASE_URL}/api/orders/${orderData.orderNumber}`);
    assert(trackRes.status === 200, "Track order endpoint returns order");
    const trackData = await trackRes.json();
    assert(trackData.order.customerPhone === "03009876543", "Customer phone matches");
    assert(trackData.order.orderStatus === "PENDING", "Initial status is PENDING");
    assert(trackData.order.paymentMethod === "COD", "Payment method is COD");

    // 9. Admin Security, Order Management & Status Updates
    console.log(`\n[Test 9] Admin Security Enforcement & Order Lifecycle Management`);
    // Customer should NOT be able to access admin stats
    const forbiddenRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: tokenCookieStr },
    });
    assert(forbiddenRes.status === 403, "Non-admin user correctly blocked from admin stats (HTTP 403)");

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@ainakluxe.pk",
        password: "Admin123!@#",
      }),
    });
    assert(adminLoginRes.status === 200, "Admin login successful");
    const adminCookieStr = (adminLoginRes.headers.get("set-cookie") || "").split(";")[0];

    // Admin Stats
    const adminStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Cookie: adminCookieStr },
    });
    assert(adminStatsRes.status === 200, "Admin stats accessible by administrator");
    const adminStats = await adminStatsRes.json();
    assert(adminStats.metrics.totalOrders >= 2, "Admin sees total order count in database");

    // Admin updates order status
    const updateOrderRes = await fetch(`${BASE_URL}/api/admin/orders`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieStr,
      },
      body: JSON.stringify({
        orderId: orderData.orderId,
        orderStatus: "PROCESSING",
        paymentStatus: "PENDING",
        trackingNumber: "TCS-99881122",
      }),
    });
    assert(updateOrderRes.status === 200, "Admin updated order status to PROCESSING with TCS tracking");

    // Verify customer tracking reflects the updated status
    const updatedTrackRes = await fetch(`${BASE_URL}/api/orders/${orderData.orderNumber}`);
    const updatedTrackData = await updatedTrackRes.json();
    assert(updatedTrackData.order.orderStatus === "PROCESSING", "Customer sees updated status: PROCESSING");
    assert(updatedTrackData.order.trackingNumber === "TCS-99881122", "Customer sees assigned tracking number");

    // 10. SEO Sitemap & Robots.txt
    console.log(`\n[Test 10] SEO Sitemap & Robots Validation`);
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    assert(robotsRes.status === 200, "robots.txt returns HTTP 200");
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    assert(sitemapRes.status === 200, "sitemap.xml returns HTTP 200");

    // 11. Optical Lenses Public & Admin CRUD APIs
    console.log(`\n[Test 11] Optical Lenses Public & Admin CRUD APIs`);
    const publicLensesRes = await fetch(`${BASE_URL}/api/lenses`);
    assert(publicLensesRes.status === 200, "GET /api/lenses returns HTTP 200");
    const publicLensesData = await publicLensesRes.json();
    assert(Array.isArray(publicLensesData.lenses), "Public lenses returned as array");
    assert(publicLensesData.lenses.length >= 4, "Active optical lens tiers returned (Blue Cut, Anti-Glare, Transitions, Progressives)");
    const blueCutLens = publicLensesData.lenses.find(l => l.name.toLowerCase().includes("blue cut"));
    assert(blueCutLens && blueCutLens.features.includes("Blue Light"), "Blue Cut lens features verified");

    // Admin Lens Creation
    const newLensRes = await fetch(`${BASE_URL}/api/admin/lenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieStr,
      },
      body: JSON.stringify({
        name: "Test DriveSafe Polarized Lenses",
        type: "SINGLE_VISION",
        price: 2500,
        description: "Specialized polarization for high glare highway driving",
        features: "Polarized Filter, UV400, AR Coating",
        isActive: true,
      }),
    });
    assert(newLensRes.status === 200, "Admin created new optical lens option");
    const newLensData = await newLensRes.json();
    const createdLensId = newLensData.lens.id;

    // Admin Lens Update
    const updateLensRes = await fetch(`${BASE_URL}/api/admin/lenses`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookieStr,
      },
      body: JSON.stringify({
        id: createdLensId,
        price: 2800,
        isActive: false,
      }),
    });
    assert(updateLensRes.status === 200, "Admin updated lens price and active status");

    // Admin Lens Delete
    const deleteLensRes = await fetch(`${BASE_URL}/api/admin/lenses?id=${createdLensId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookieStr },
    });
    assert(deleteLensRes.status === 200, "Admin deleted/deactivated test lens option");

    // 12. Prescription Doctor Slip Upload & Order Glazing Flow
    console.log(`\n[Test 12] Prescription Doctor Slip Upload & Glazing Order Flow`);
    const slipFormData = new FormData();
    const slipBlob = new Blob(["Prescription doctor card: OD -2.00, OS -1.75, PD 63mm"], { type: "image/jpeg" });
    slipFormData.append("file", slipBlob, "rx-test-card.jpg");

    const uploadRes = await fetch(`${BASE_URL}/api/upload/prescription`, {
      method: "POST",
      body: slipFormData,
    });
    assert(uploadRes.status === 200, "Prescription slip uploaded successfully");
    const uploadData = await uploadRes.json();
    assert(uploadData.url && uploadData.url.startsWith("/uploads/prescriptions/"), "Prescription image URL returned");

    // Add frame to cart with uploaded prescription slip & Blue Cut lens
    const cartRxRes = await fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: tokenCookieStr,
      },
      body: JSON.stringify({
        productId: sampleProduct.id,
        lensOptionId: blueCutLens.id,
        quantity: 1,
        prescriptionMethod: "UPLOAD",
        prescriptionImage: uploadData.url,
      }),
    });
    assert(cartRxRes.status === 200, "Added frame with uploaded prescription slip to cart");
    const cartRxData = await cartRxRes.json();
    assert(cartRxData.cart.items.some(it => it.prescriptionImage === uploadData.url), "Prescription image stored on cart item");

    // Place Order with Prescription Slip
    const rxOrderRes = await fetch(`${BASE_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: tokenCookieStr,
      },
      body: JSON.stringify({
        customerName: "Prescription Patient Ali",
        customerEmail: `patient_${Date.now()}@example.com`,
        customerPhone: "0321-4455667",
        streetAddress: "Apartment 5-C, Gulberg III",
        city: "Lahore",
        province: "Punjab",
        postalCode: "54000",
        paymentMethod: "COD",
        notes: "Please call on WhatsApp if prescription handwriting is unclear",
      }),
    });
    assert(rxOrderRes.status === 200, "Prescription order placed successfully with COD");
    const rxOrderData = await rxOrderRes.json();

    // Verify Admin sees this order with prescription slip
    const adminOrdersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: { Cookie: adminCookieStr },
    });
    const adminOrdersData = await adminOrdersRes.json();
    const placedOrder = adminOrdersData.orders.find(o => o.orderNumber === rxOrderData.orderNumber);
    assert(placedOrder && placedOrder.items.length > 0, "Placed prescription order retrieved in admin orders");
    const orderedItem = placedOrder.items[0];
    assert(orderedItem.prescriptionImage === uploadData.url, "Admin order item has attached prescription slip image");
    assert(orderedItem.lensName === blueCutLens.name, "Admin order item has correct glazed lens tier name");

    // 13. Dedicated Optical Lenses Storefront Showcase Page
    console.log(`\n[Test 13] Dedicated Optical Lenses Storefront Page`);
    const lensesPageRes = await fetch(`${BASE_URL}/lenses`);
    assert(lensesPageRes.status === 200, "GET /lenses returns HTTP 200");
    const lensesHtml = await lensesPageRes.text();
    assert(lensesHtml.includes("Blue Cut"), "Lenses page showcases Blue Cut lenses");
    assert(lensesHtml.includes("Photochromic") || lensesHtml.includes("Transition"), "Lenses page showcases Transition lenses");
    assert(lensesHtml.includes("Progressive"), "Lenses page showcases Progressive lenses");
    assert(lensesHtml.includes("Anti-Glare"), "Lenses page showcases Anti-Glare lenses");
    assert(lensesHtml.includes("Comparison"), "Lenses page includes Comparison Matrix");

    console.log(`\n======================================================`);
    console.log(`All ${passedTests} Test Assertions PASSED Successfully!`);
    console.log(`Failed Tests: ${failedTests}`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`\nTest suite encountered an error:`, err);
    process.exit(1);
  }
}

runTestSuite();
