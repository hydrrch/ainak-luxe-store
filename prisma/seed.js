const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding OptiStyle / Ainak Luxe database...');

  // Clean existing tables
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.lensOption.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.storeSetting.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash('Admin123!@#', 10);
  const customerPassword = await bcrypt.hash('Customer123!@#', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@ainakluxe.pk',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+923001234567',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Hamza Khan',
      email: 'customer@example.com',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      phone: '+923214567890',
      addresses: {
        create: {
          fullName: 'Hamza Khan',
          phone: '+923214567890',
          streetAddress: 'House 42-B, Sector Y, Phase 3, DHA',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
          isDefault: true,
        },
      },
    },
  });

  console.log('Created users: admin@ainakluxe.pk & customer@example.com');

  // Create Categories
  const catEyeglasses = await prisma.category.create({
    data: {
      name: 'Eyeglasses',
      slug: 'eyeglasses',
      description: 'Prescription & fashion eyeglass frames for men, women and kids',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catSunglasses = await prisma.category.create({
    data: {
      name: 'Sunglasses',
      slug: 'sunglasses',
      description: '100% UV-protected, polarized, and gradient designer sunglasses',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catLenses = await prisma.category.create({
    data: {
      name: 'Lenses',
      slug: 'lenses',
      description: 'Blue cut, computer anti-glare, transition and progressive optics',
      image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80',
    },
  });

  const catContactLenses = await prisma.category.create({
    data: {
      name: 'Contact Lenses',
      slug: 'contact-lenses',
      description: 'Colored and transparent prescription contact lenses',
      image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80',
    },
  });

  // Create Brands
  const brandRayBan = await prisma.brand.create({ data: { name: 'Ray-Ban', slug: 'ray-ban' } });
  const brandGucci = await prisma.brand.create({ data: { name: 'Gucci', slug: 'gucci' } });
  const brandPrada = await prisma.brand.create({ data: { name: 'Prada', slug: 'prada' } });
  const brandTomFord = await prisma.brand.create({ data: { name: 'Tom Ford', slug: 'tom-ford' } });
  const brandLV = await prisma.brand.create({ data: { name: 'Louis Vuitton', slug: 'louis-vuitton' } });
  const brandOliver = await prisma.brand.create({ data: { name: 'Oliver Peoples', slug: 'oliver-peoples' } });
  const brandCartier = await prisma.brand.create({ data: { name: 'Cartier', slug: 'cartier' } });
  const brandBoss = await prisma.brand.create({ data: { name: 'Hugo Boss', slug: 'hugo-boss' } });
  const brandBeckham = await prisma.brand.create({ data: { name: 'David Beckham', slug: 'david-beckham' } });
  const brandMoscot = await prisma.brand.create({ data: { name: 'Moscot', slug: 'moscot' } });

  // Create Lens Options
  const lensOptions = await Promise.all([
    prisma.lensOption.create({
      data: {
        name: 'Frame Only (Default Lens)',
        description: 'Standard clear display lenses without vision power',
        price: 0,
        type: 'SINGLE_VISION',
      },
    }),
    prisma.lensOption.create({
      data: {
        name: 'Blue Cut / Computer Glasses',
        description: 'Blocks harmful blue light emitted from screens, smartphones & laptops',
        price: 1500,
        type: 'BLUE_LIGHT',
      },
    }),
    prisma.lensOption.create({
      data: {
        name: 'Anti-Glare High Clarity AR',
        description: 'Anti-reflective multi-coating that eliminates glare during night driving and screens',
        price: 1200,
        type: 'ANTI_GLARE',
      },
    }),
    prisma.lensOption.create({
      data: {
        name: 'Photochromic / Transition (Adaptive)',
        description: 'Clear indoors and turns into dark sunglasses outdoors in direct sunlight',
        price: 2500,
        type: 'PHOTOCHROMIC',
      },
    }),
    prisma.lensOption.create({
      data: {
        name: 'Bifocal Prescription Lenses',
        description: 'Dual-vision lenses with distinct reading segment and distance correction',
        price: 3500,
        type: 'BIFOCAL',
      },
    }),
    prisma.lensOption.create({
      data: {
        name: 'Progressive HD Multi-Focal',
        description: 'Smooth seamless progression from distance to intermediate and near reading',
        price: 5000,
        type: 'PROGRESSIVE',
      },
    }),
  ]);

  console.log('Created lens options');

  // Products Data
  const sampleProducts = [
    {
      name: 'Ray-Ban Wayfarer Classic 50mm',
      slug: 'ray-ban-wayfarer-classic',
      sku: 'RB-WAY-2140',
      description: 'The most iconic silhouette in eyewear history since 1952. Crafted from high-density hand-polished acetate with signature sculptured temples and silver hinge studs.',
      brandId: brandRayBan.id,
      categoryId: catSunglasses.id,
      gender: 'UNISEX',
      basePrice: 9500,
      salePrice: 8500,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: false,
      frameShape: 'WAYFARER',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For slim to normal faces',
      lensWidth: 50,
      bridgeWidth: 22,
      templeLength: 150,
      lensHeight: 45,
      totalWidth: 142,
      virtualTryOnOverlay: '/glasses/wayfarer-black.svg',
      tryOnScale: 1.0,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Glossy Black', colorCode: '#111111', sku: 'RB-WAY-2140-BLK', stockCount: 15, tryOnOverlay: '/glasses/wayfarer-black.svg' },
        { colorName: 'Havana Tortoise', colorCode: '#78350f', sku: 'RB-WAY-2140-TOR', stockCount: 8, tryOnOverlay: '/glasses/cat-eye.svg' },
      ],
    },
    {
      name: 'Ray-Ban Aviator Polarized 58mm',
      slug: 'ray-ban-aviator-polarized-58mm',
      sku: 'RB-AVI-3025',
      description: 'Originally developed in 1937 for US military aviators. Ultra-lightweight gold-tone alloy wire frame with classic teardrop lenses and double brow bar.',
      brandId: brandRayBan.id,
      categoryId: catSunglasses.id,
      gender: 'UNISEX',
      basePrice: 13500,
      salePrice: 12000,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: false,
      frameShape: 'AVIATOR',
      material: 'METAL',
      rimType: 'FULL_RIM',
      frameSize: 'LARGE',
      faceFit: 'For normal to bulky faces',
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 140,
      lensHeight: 50,
      totalWidth: 145,
      virtualTryOnOverlay: '/glasses/aviator-gold.svg',
      tryOnScale: 1.05,
      tryOnOffsetY: 0.05,
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Polished Gold', colorCode: '#d4af37', sku: 'RB-AVI-3025-GLD', stockCount: 12, tryOnOverlay: '/glasses/aviator-gold.svg' },
        { colorName: 'Silver Chrome', colorCode: '#cccccc', sku: 'RB-AVI-3025-SLV', stockCount: 6, tryOnOverlay: '/glasses/round-metal.svg' },
      ],
    },
    {
      name: 'Prada PR A19V Bold Acetate',
      slug: 'prada-pr-a19v-bold-acetate',
      sku: 'PRD-A19V-01',
      description: 'High-fashion modern geometry from Milan. Sharp rectangular profiles with sculptural beveled temples bearing the raised Prada Milano triangle emblem.',
      brandId: brandPrada.id,
      categoryId: catEyeglasses.id,
      gender: 'MEN',
      basePrice: 16500,
      salePrice: 14900,
      isBestseller: false,
      isFeatured: true,
      isNewArrival: true,
      frameShape: 'RECTANGLE',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For normal faces',
      lensWidth: 53,
      bridgeWidth: 19,
      templeLength: 145,
      lensHeight: 40,
      totalWidth: 141,
      virtualTryOnOverlay: '/glasses/wayfarer-black.svg',
      tryOnScale: 0.98,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Deep Onyx Black', colorCode: '#000000', sku: 'PRD-A19V-BLK', stockCount: 10, tryOnOverlay: '/glasses/wayfarer-black.svg' },
      ],
    },
    {
      name: 'Tom Ford TF1044 Luxury Edition',
      slug: 'tom-ford-tf1044-luxury-edition',
      sku: 'TF-1044-BLK',
      description: 'Exquisite bespoke design crafted in Italy featuring the signature gold metal "T" temple logo inserts and premium weighted acetate build.',
      brandId: brandTomFord.id,
      categoryId: catSunglasses.id,
      gender: 'MEN',
      basePrice: 15000,
      salePrice: 13500,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: false,
      frameShape: 'SQUARE',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'LARGE',
      faceFit: 'For bulky faces',
      lensWidth: 55,
      bridgeWidth: 20,
      templeLength: 145,
      lensHeight: 46,
      totalWidth: 144,
      virtualTryOnOverlay: '/glasses/wayfarer-black.svg',
      tryOnScale: 1.02,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Midnight Black', colorCode: '#050505', sku: 'TF-1044-BLK-VAR', stockCount: 7, tryOnOverlay: '/glasses/wayfarer-black.svg' },
      ],
    },
    {
      name: 'Hugo Boss T1612 Transparent Crystal',
      slug: 'hugo-boss-t1612-transparent-crystal',
      sku: 'HB-T1612-CLR',
      description: 'Modern minimalist aesthetics crafted with crystal-clear German TR90 acetate. Lightweight, hypoallergenic, and perfect for prolonged everyday computer usage.',
      brandId: brandBoss.id,
      categoryId: catEyeglasses.id,
      gender: 'UNISEX',
      basePrice: 7500,
      salePrice: 6500,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: true,
      frameShape: 'ROUND',
      material: 'TR90',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For slim to normal faces',
      lensWidth: 49,
      bridgeWidth: 20,
      templeLength: 145,
      lensHeight: 44,
      totalWidth: 138,
      virtualTryOnOverlay: '/glasses/transparent-crystal.svg',
      tryOnScale: 1.0,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Crystal Clear', colorCode: '#e2e8f0', sku: 'HB-T1612-CLR-VAR', stockCount: 20, tryOnOverlay: '/glasses/transparent-crystal.svg' },
        { colorName: 'Smoky Grey', colorCode: '#64748b', sku: 'HB-T1612-GRY-VAR', stockCount: 14, tryOnOverlay: '/glasses/transparent-crystal.svg' },
      ],
    },
    {
      name: 'Gucci GG1746OA Statement Cat-Eye',
      slug: 'gucci-gg1746oa-statement-cat-eye',
      sku: 'GC-1746-CAT',
      description: 'Sophisticated vintage flair designed for modern elegance. Uplifted cat-eye outer corners accented with gold interlocking GG monogram logos.',
      brandId: brandGucci.id,
      categoryId: catEyeglasses.id,
      gender: 'WOMEN',
      basePrice: 9500,
      salePrice: 8500,
      isBestseller: false,
      isFeatured: true,
      isNewArrival: true,
      frameShape: 'CAT_EYE',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For normal faces',
      lensWidth: 52,
      bridgeWidth: 18,
      templeLength: 140,
      lensHeight: 43,
      totalWidth: 139,
      virtualTryOnOverlay: '/glasses/cat-eye.svg',
      tryOnScale: 0.98,
      tryOnOffsetY: -0.02,
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Amber Tortoise', colorCode: '#d97706', sku: 'GC-1746-CAT-TOR', stockCount: 11, tryOnOverlay: '/glasses/cat-eye.svg' },
        { colorName: 'Classic Black', colorCode: '#0f172a', sku: 'GC-1746-CAT-BLK', stockCount: 9, tryOnOverlay: '/glasses/wayfarer-black.svg' },
      ],
    },
    {
      name: 'Moscot Lemtosh Iconic Round',
      slug: 'moscot-lemtosh-iconic-round',
      sku: 'MSC-LEM-46',
      description: 'The beloved New York neighborhood classic with diamond rivets, keyhole bridge, and comfortable ergonomic acetate contouring.',
      brandId: brandMoscot.id,
      categoryId: catEyeglasses.id,
      gender: 'UNISEX',
      basePrice: 8500,
      salePrice: 7500,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: false,
      frameShape: 'ROUND',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For slim to normal faces',
      lensWidth: 46,
      bridgeWidth: 24,
      templeLength: 145,
      lensHeight: 42,
      totalWidth: 137,
      virtualTryOnOverlay: '/glasses/round-metal.svg',
      tryOnScale: 0.95,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Blonde Amber', colorCode: '#f59e0b', sku: 'MSC-LEM-46-AMB', stockCount: 8, tryOnOverlay: '/glasses/round-metal.svg' },
        { colorName: 'Matte Black', colorCode: '#18181b', sku: 'MSC-LEM-46-BLK', stockCount: 12, tryOnOverlay: '/glasses/round-metal.svg' },
      ],
    },
    {
      name: 'Cartier CT0270S Premier Rimless Gold',
      slug: 'cartier-ct0270s-premier-rimless-gold',
      sku: 'CRT-0270-GLD',
      description: 'The pinnacle of French luxury eyewear. 24K gold plated titanium temples featuring Cartier signature C Décor hinges and beveled diamond-cut lenses.',
      brandId: brandCartier.id,
      categoryId: catSunglasses.id,
      gender: 'UNISEX',
      basePrice: 15000,
      salePrice: 14000,
      isBestseller: false,
      isFeatured: true,
      isNewArrival: true,
      frameShape: 'RECTANGLE',
      material: 'TITANIUM',
      rimType: 'RIMLESS',
      frameSize: 'MEDIUM',
      faceFit: 'For normal faces',
      lensWidth: 54,
      bridgeWidth: 18,
      templeLength: 140,
      lensHeight: 38,
      totalWidth: 138,
      virtualTryOnOverlay: '/glasses/aviator-gold.svg',
      tryOnScale: 0.95,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Precious Gold', colorCode: '#ffd700', sku: 'CRT-0270-GLD-VAR', stockCount: 5, tryOnOverlay: '/glasses/aviator-gold.svg' },
      ],
    },
    {
      name: 'Ray-Ban Clubmaster Classic Browline',
      slug: 'ray-ban-clubmaster-classic-browline',
      sku: 'RB-CLUB-3016',
      description: 'Vintage 1950s retro browline design favored by intellectuals and trendsetters. Solid black acetate upper arch with polished gold metallic underwire.',
      brandId: brandRayBan.id,
      categoryId: catSunglasses.id,
      gender: 'UNISEX',
      basePrice: 8500,
      salePrice: 7800,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: false,
      frameShape: 'CLUBMASTER',
      material: 'MIX_MATERIAL',
      rimType: 'HALF_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For slim to normal faces',
      lensWidth: 51,
      bridgeWidth: 21,
      templeLength: 145,
      lensHeight: 44,
      totalWidth: 140,
      virtualTryOnOverlay: '/glasses/clubmaster.svg',
      tryOnScale: 1.0,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Ebony & Gold', colorCode: '#171717', sku: 'RB-CLUB-3016-EBN', stockCount: 14, tryOnOverlay: '/glasses/clubmaster.svg' },
      ],
    },
    {
      name: 'Louis Vuitton Z2828U Monogram Chic',
      slug: 'louis-vuitton-z2828u-monogram-chic',
      sku: 'LV-Z2828-GLD',
      description: 'Bold oversized runway frame with gold metallic flower accents along the rims and laser-etched LV logos across top bridge.',
      brandId: brandLV.id,
      categoryId: catSunglasses.id,
      gender: 'WOMEN',
      basePrice: 16500,
      salePrice: null,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: true,
      frameShape: 'SQUARE',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'LARGE',
      faceFit: 'For normal faces',
      lensWidth: 56,
      bridgeWidth: 18,
      templeLength: 145,
      lensHeight: 50,
      totalWidth: 145,
      virtualTryOnOverlay: '/glasses/wayfarer-black.svg',
      tryOnScale: 1.05,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Black & Gold', colorCode: '#000000', sku: 'LV-Z2828-GLD-VAR', stockCount: 6, tryOnOverlay: '/glasses/wayfarer-black.svg' },
      ],
    },
    {
      name: 'Reality 3251 Everyday Featherlight',
      slug: 'reality-3251-everyday-featherlight',
      sku: 'RLT-3251-GRY',
      description: 'Best-selling affordable daily prescription frame in Pakistan. Weighs only 14 grams with flexible temples and comfortable nose pads.',
      brandId: brandBoss.id,
      categoryId: catEyeglasses.id,
      gender: 'UNISEX',
      basePrice: 2200,
      salePrice: 1999,
      isBestseller: true,
      isFeatured: false,
      isNewArrival: false,
      frameShape: 'RECTANGLE',
      material: 'PLASTIC',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For normal faces',
      lensWidth: 51,
      bridgeWidth: 17,
      templeLength: 140,
      lensHeight: 38,
      totalWidth: 136,
      virtualTryOnOverlay: '/glasses/transparent-crystal.svg',
      tryOnScale: 0.96,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Slate Grey', colorCode: '#475569', sku: 'RLT-3251-GRY-VAR', stockCount: 25, tryOnOverlay: '/glasses/transparent-crystal.svg' },
        { colorName: 'Midnight Black', colorCode: '#0f172a', sku: 'RLT-3251-BLK-VAR', stockCount: 30, tryOnOverlay: '/glasses/wayfarer-black.svg' },
      ],
    },
    {
      name: 'David Beckham DB1002 Magnetic Clip-on',
      slug: 'david-beckham-db1002-magnetic-clip-on',
      sku: 'DB-1002-CLIP',
      description: '2-in-1 versatility! Optical eyeglass frame with custom magnetic polarized sun clip-on. Transforms into designer sunglasses in one second.',
      brandId: brandBeckham.id,
      categoryId: catEyeglasses.id,
      gender: 'MEN',
      basePrice: 11000,
      salePrice: 9999,
      isBestseller: true,
      isFeatured: true,
      isNewArrival: false,
      frameShape: 'ROUND',
      material: 'ACETATE',
      rimType: 'FULL_RIM',
      frameSize: 'MEDIUM',
      faceFit: 'For normal faces',
      lensWidth: 49,
      bridgeWidth: 20,
      templeLength: 145,
      lensHeight: 43,
      totalWidth: 139,
      virtualTryOnOverlay: '/glasses/round-metal.svg',
      tryOnScale: 0.98,
      tryOnOffsetY: 0.0,
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { colorName: 'Dark Havana Tortoise', colorCode: '#78350f', sku: 'DB-1002-TOR', stockCount: 9, tryOnOverlay: '/glasses/round-metal.svg' },
      ],
    },
  ];

  for (const prodData of sampleProducts) {
    const { images, variants, ...prodFields } = prodData;
    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images.map((url, idx) => ({
            url,
            sortOrder: idx,
            isPrimary: idx === 0,
            alt: prodData.name,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            colorName: v.colorName,
            colorCode: v.colorCode,
            sku: v.sku,
            stockCount: v.stockCount,
            tryOnOverlay: v.tryOnOverlay,
          })),
        },
        reviews: {
          create: [
            {
              authorName: 'Usman Tariq',
              authorEmail: 'usman@gmail.com',
              rating: 5,
              title: 'Superb quality and fast delivery in Lahore!',
              comment: 'Ordered yesterday and received today in Johar Town Lahore. The frame finishing is top notch, better than many optical shops. 10/10.',
              isVerifiedPurchase: true,
              isApproved: true,
            },
            {
              authorName: 'Ayesha Malik',
              authorEmail: 'ayesha@yahoo.com',
              rating: 5,
              title: 'Virtual Try-on was remarkably accurate',
              comment: 'I was hesitant about ordering glasses online without trying them on, but the camera try-on showed the exact fit. Looks fabulous in person.',
              isVerifiedPurchase: true,
              isApproved: true,
            },
          ],
        },
      },
    });
  }

  console.log(`Created ${sampleProducts.length} sample products with variants, images, and reviews`);

  // Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'AINAK10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 2000,
        maxUses: 1000,
        isActive: true,
      },
      {
        code: 'WELCOME500',
        discountType: 'FIXED',
        discountValue: 500,
        minOrderAmount: 3000,
        maxUses: 500,
        isActive: true,
      },
      {
        code: 'FREESHIP',
        discountType: 'FIXED',
        discountValue: 200, // Shipping fee rebate
        minOrderAmount: 1500,
        isActive: true,
      },
    ],
  });

  // Create Store Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Luxury Eyewear Collection 2026',
        subtitle: 'Handcrafted Acetates, Titanium Metal & Blue-Cut Lenses',
        linkUrl: '/category/eyeglasses',
        imageUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1600&q=80',
        position: 'HERO',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Polarized Sunglasses For Men & Women',
        subtitle: '100% UV400 Protection with Gradient & Mirror Tints',
        linkUrl: '/category/sunglasses',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1600&q=80',
        position: 'HERO',
        sortOrder: 2,
        isActive: true,
      },
    ],
  });

  // Create Store Settings
  const settings = [
    { key: 'store_name', value: 'Ainak Luxe Pakistan' },
    { key: 'store_phone', value: '+92 322 5705757' },
    { key: 'store_whatsapp', value: '+92 322 5705757' },
    { key: 'store_email', value: 'support@ainakluxe.pk' },
    { key: 'store_address', value: 'Mall of Lahore, Cantt, Lahore, Punjab, Pakistan' },
    { key: 'default_shipping_fee', value: '200' },
    { key: 'free_shipping_threshold', value: '4999' },
    { key: 'announcement_bar', value: 'Pay with bank transfer or cards and get up to 15% discount! Free shipping across Pakistan on orders over Rs 4,999.' },
  ];

  for (const s of settings) {
    await prisma.storeSetting.create({
      data: s,
    });
  }

  // Create an initial sample order for demonstration
  const firstProduct = await prisma.product.findFirst({
    include: { variants: true },
  });

  if (firstProduct) {
    await prisma.order.create({
      data: {
        orderNumber: 'OPT-2026-1001',
        userId: customer.id,
        customerName: 'Hamza Khan',
        customerEmail: 'customer@example.com',
        customerPhone: '+923214567890',
        shippingAddress: JSON.stringify({
          street: 'House 42-B, Sector Y, Phase 3, DHA',
          city: 'Lahore',
          province: 'Punjab',
          postalCode: '54000',
        }),
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54000',
        subtotal: firstProduct.salePrice || firstProduct.basePrice,
        discount: 0,
        shippingFee: 0,
        total: firstProduct.salePrice || firstProduct.basePrice,
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'CONFIRMED',
        trackingNumber: 'TCS-98421034',
        notes: 'Please call before delivery',
        items: {
          create: {
            productId: firstProduct.id,
            variantId: firstProduct.variants[0]?.id,
            productName: firstProduct.name,
            variantName: firstProduct.variants[0]?.colorName,
            lensName: 'Blue Cut / Computer Glasses',
            unitPrice: firstProduct.salePrice || firstProduct.basePrice,
            quantity: 1,
            subtotal: firstProduct.salePrice || firstProduct.basePrice,
            prescriptionDetails: JSON.stringify({
              type: 'COMPUTER_GLASSES',
              sphereOD: '-0.50',
              cylinderOD: '0.00',
              axisOD: '0',
              sphereOS: '-0.75',
              cylinderOS: '0.00',
              axisOS: '0',
              pd: '63mm',
            }),
          },
        },
      },
    });
    console.log('Created sample initial order OPT-2026-1001');
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
