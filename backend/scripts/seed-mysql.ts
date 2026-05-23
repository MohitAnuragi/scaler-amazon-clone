import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "../src/config/db";
import { categories, productsByCategory, categorySlugByName } from "../catalog/products";
import { categoryHeroImages, productImage, productImageSet } from "../catalog/images";
import { buildProductDescription, getReviewPool } from "../catalog/copy";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const REVIEW_USERS = [
  { email: "customer@example.com", password: "password123", firstName: "Ravi", lastName: "Sharma" },
  { email: "reviewer@example.com", password: "reviewer123", firstName: "Priya", lastName: "Singh" },
  { email: "amit.reviews@example.com", password: "reviewer123", firstName: "Amit", lastName: "Kapoor" },
  { email: "sneha.reviews@example.com", password: "reviewer123", firstName: "Sneha", lastName: "Reddy" },
  { email: "vikram.reviews@example.com", password: "reviewer123", firstName: "Vikram", lastName: "Patel" },
  { email: "ananya.reviews@example.com", password: "reviewer123", firstName: "Ananya", lastName: "Iyer" },
];

const main = async () => {
  let customerId = "";

  await db.withTransaction(async (conn) => {
    await db.query("DELETE FROM order_items", [], conn);
    await db.query("DELETE FROM orders", [], conn);
    await db.query("DELETE FROM cart_items", [], conn);
    await db.query("DELETE FROM wishlist_items", [], conn);
    await db.query("DELETE FROM reviews", [], conn);
    await db.query("DELETE FROM product_specifications", [], conn);
    await db.query("DELETE FROM product_images", [], conn);
    await db.query("DELETE FROM products", [], conn);
    await db.query("DELETE FROM addresses", [], conn);
    await db.query("DELETE FROM categories", [], conn);
    await db.query("DELETE FROM users", [], conn);

    const userIds: string[] = [];
    for (const u of REVIEW_USERS) {
      const id = randomUUID();
      const passwordHash = await bcrypt.hash(u.password, 10);
      await db.query(
        "INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)",
        [id, u.email, passwordHash, u.firstName, u.lastName, "CUSTOMER"],
        conn
      );
      userIds.push(id);
      if (u.email === "customer@example.com") customerId = id;
    }

    const adminId = randomUUID();
    const adminHash = await bcrypt.hash("admin123", 10);
    await db.query(
      "INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)",
      [adminId, "admin@example.com", adminHash, "Admin", "User", "ADMIN"],
      conn
    );

    const addr1Id = randomUUID();
    await db.query(
      "INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        addr1Id,
        customerId,
        "Ravi Sharma",
        "9876543210",
        "221B Baker Street",
        "Near City Center Mall",
        "Mumbai",
        "Maharashtra",
        "400001",
        "India",
        1,
      ],
      conn
    );

    const addr2Id = randomUUID();
    await db.query(
      "INSERT INTO addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        addr2Id,
        customerId,
        "Ravi Sharma",
        "9876543210",
        "Flat 4B, Sunshine Apartments",
        "Koramangala 5th Block",
        "Bengaluru",
        "Karnataka",
        "560095",
        "India",
        0,
      ],
      conn
    );

    const createdCategories: Record<string, string> = {};
    for (const cat of categories) {
      const id = randomUUID();
      await db.query(
        "INSERT INTO categories (id, name, slug, description, image_url) VALUES (?, ?, ?, ?, ?)",
        [
          id,
          cat.name,
          cat.slug,
          `${cat.name} - curated bestsellers and new arrivals for Amazon.in shoppers.`,
          categoryHeroImages[cat.slug] ?? productImage(cat.imageKey),
        ],
        conn
      );
      createdCategories[cat.name] = id;
    }

    const allProductIds: string[] = [];
    const mobileProductIds: string[] = [];
    const beautyProductIds: string[] = [];
    const electronicsProductIds: string[] = [];

    for (const [categoryName, products] of Object.entries(productsByCategory)) {
      const categoryId = createdCategories[categoryName];
      const categorySlug = categorySlugByName[categoryName] ?? "electronics";
      const pool = getReviewPool(categorySlug);

      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const id = randomUUID();
        const nameSlug = slugify(`${p.brand}-${p.name}`);
        const sku = `SKU-${slugify(p.name).toUpperCase().replace(/-/g, "").slice(0, 24)}`;
        const stockQuantity = p.stock ?? 25 + i * 3;
        const rating = p.rating ?? 4.2;
        const totalReviews = p.reviewCount ?? 120 + i * 17;
        const images = productImageSet(p.imageKey, p.name);
        const createdAt = p.createdAt ?? new Date();

        await db.query(
          "INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, stock_quantity, sku, brand, category_id, is_active, is_featured, average_rating, total_reviews, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            p.name,
            nameSlug,
            buildProductDescription(p.name, p.brand, categoryName, p.highlights),
            `${p.brand} - ${p.highlights[0]}.`,
            p.price,
            p.compareAtPrice,
            stockQuantity,
            sku,
            p.brand,
            categoryId,
            1,
            p.featured ?? i % 4 === 0 ? 1 : 0,
            Math.round(rating * 10) / 10,
            totalReviews,
            createdAt,
            createdAt,
          ],
          conn
        );

        const imageValues = images.map((img, idx) => [
          randomUUID(),
          id,
          img.url,
          img.altText ?? null,
          img.sortOrder ?? idx,
          img.isPrimary ? 1 : 0,
        ]);
        const imagePlaceholders = imageValues.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
        await db.query(
          `INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary) VALUES ${imagePlaceholders}`,
          imageValues.flat(),
          conn
        );

        const specValues = p.specs.map(([key, value], si) => [
          randomUUID(),
          id,
          key,
          value,
          si + 1,
        ]);
        const specPlaceholders = specValues.map(() => "(?, ?, ?, ?, ?)").join(", ");
        await db.query(
          `INSERT INTO product_specifications (id, product_id, spec_key, spec_value, sort_order) VALUES ${specPlaceholders}`,
          specValues.flat(),
          conn
        );

        allProductIds.push(id);
        if (categoryName === "Mobiles") mobileProductIds.push(id);
        if (categoryName === "Beauty") beautyProductIds.push(id);
        if (categoryName === "Electronics") electronicsProductIds.push(id);

        const ratings = [5, 5, 4, 4, 3];
        for (let r = 0; r < ratings.length; r++) {
          const userId = userIds[r % userIds.length];
          await db.query(
            "INSERT INTO reviews (id, user_id, product_id, rating, title, comment, is_verified_purchase) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              randomUUID(),
              userId,
              id,
              ratings[r],
              pool.titles[(i + r) % pool.titles.length],
              pool.comments[(i + r) % pool.comments.length],
              r % 2 === 0 ? 1 : 0,
            ],
            conn
          );
        }
      }
    }

    const reviewStats = await db.query<any[]>(
      "SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS total_reviews FROM reviews GROUP BY product_id",
      [],
      conn
    );

    for (const stat of reviewStats) {
      await db.query(
        "UPDATE products SET average_rating = ?, total_reviews = ? WHERE id = ?",
        [Number(stat.avg_rating ?? 0), Number(stat.total_reviews ?? 0), stat.product_id],
        conn
      );
    }

    const addressSnapshot1 = {
      fullName: "Ravi Sharma",
      phone: "9876543210",
      addressLine1: "221B Baker Street",
      addressLine2: "Near City Center Mall",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    };

    const addressSnapshot2 = {
      fullName: "Ravi Sharma",
      phone: "9876543210",
      addressLine1: "Flat 4B, Sunshine Apartments",
      addressLine2: "Koramangala 5th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560095",
      country: "India",
    };

    if (electronicsProductIds.length >= 2) {
      const orderId = randomUUID();
      const order1Subtotal = 24990 + 1299;
      const order1Tax = Math.round(order1Subtotal * 0.18);
      await db.query(
        "INSERT INTO orders (id, order_number, user_id, address_id, address_snapshot, status, payment_status, payment_method, subtotal, tax_amount, shipping_amount, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          "ORD-2024-001",
          customerId,
          addr1Id,
          JSON.stringify(addressSnapshot1),
          "DELIVERED",
          "PAID",
          "COD",
          order1Subtotal,
          order1Tax,
          0,
          order1Subtotal + order1Tax,
        ],
        conn
      );

      const orderItems = [
        {
          productId: electronicsProductIds[0],
          quantity: 1,
          unitPrice: 24990,
          productName: "Sony WH-1000XM5 Wireless Headphones",
          productImageUrl: productImage("headphones"),
          subtotal: 24990,
        },
        {
          productId: electronicsProductIds[3],
          quantity: 1,
          unitPrice: 1299,
          productName: "boAt Airdopes 141 Bluetooth TWS Earbuds",
          productImageUrl: productImage("earbuds"),
          subtotal: 1299,
        },
      ];

      const orderValues = orderItems.map((item) => [
        randomUUID(),
        orderId,
        item.productId,
        item.quantity,
        item.unitPrice,
        item.productName,
        item.productImageUrl,
        item.subtotal,
      ]);
      const orderPlaceholders = orderValues.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, product_name, product_image_url, subtotal) VALUES ${orderPlaceholders}`,
        orderValues.flat(),
        conn
      );
    }

    const fashionCatId = createdCategories["Fashion"];
    const fashionProds = await db.query<any[]>(
      "SELECT p.id, p.name, p.price, pi.url AS image_url FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1 WHERE p.category_id = ? LIMIT 2",
      [fashionCatId],
      conn
    );

    if (fashionProds.length > 0) {
      const orderId = randomUUID();
      const order2Subtotal = fashionProds.reduce((sum, p) => sum + Number(p.price), 0);
      const order2Tax = Math.round(order2Subtotal * 0.18);
      await db.query(
        "INSERT INTO orders (id, order_number, user_id, address_id, address_snapshot, status, payment_status, payment_method, subtotal, tax_amount, shipping_amount, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          "ORD-2024-002",
          customerId,
          addr2Id,
          JSON.stringify(addressSnapshot2),
          "SHIPPED",
          "PAID",
          "UPI",
          order2Subtotal,
          order2Tax,
          49,
          order2Subtotal + order2Tax + 49,
        ],
        conn
      );

      const orderValues = fashionProds.map((fp: any) => [
        randomUUID(),
        orderId,
        fp.id,
        1,
        Number(fp.price),
        fp.name,
        fp.image_url ?? productImage("shoes"),
        Number(fp.price),
      ]);
      const orderPlaceholders = orderValues.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, product_name, product_image_url, subtotal) VALUES ${orderPlaceholders}`,
        orderValues.flat(),
        conn
      );
    }

    const beautyCatId = createdCategories["Beauty"];
    const beautyProds = await db.query<any[]>(
      "SELECT p.id, p.name, p.price, pi.url AS image_url FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1 WHERE p.category_id = ? LIMIT 2",
      [beautyCatId],
      conn
    );

    if (beautyProds.length > 0) {
      const orderId = randomUUID();
      const order3Subtotal = beautyProds.reduce((sum, p) => sum + Number(p.price), 0);
      const order3Tax = Math.round(order3Subtotal * 0.18);
      await db.query(
        "INSERT INTO orders (id, order_number, user_id, address_id, address_snapshot, status, payment_status, payment_method, subtotal, tax_amount, shipping_amount, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          orderId,
          "ORD-2024-003",
          customerId,
          addr1Id,
          JSON.stringify(addressSnapshot1),
          "PROCESSING",
          "PENDING",
          "CARD",
          order3Subtotal,
          order3Tax,
          49,
          order3Subtotal + order3Tax + 49,
        ],
        conn
      );

      const orderValues = beautyProds.map((bp: any) => [
        randomUUID(),
        orderId,
        bp.id,
        1,
        Number(bp.price),
        bp.name,
        bp.image_url ?? productImage("skincare"),
        Number(bp.price),
      ]);
      const orderPlaceholders = orderValues.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, product_name, product_image_url, subtotal) VALUES ${orderPlaceholders}`,
        orderValues.flat(),
        conn
      );
    }

    if (mobileProductIds.length > 0) {
      await db.query(
        "INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)",
        [randomUUID(), customerId, mobileProductIds[0], 1],
        conn
      );
    }

    if (beautyProductIds.length > 1) {
      await db.query(
        "INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)",
        [randomUUID(), customerId, beautyProductIds[0], 2],
        conn
      );
      await db.query(
        "INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)",
        [randomUUID(), customerId, beautyProductIds[1], 1],
        conn
      );
    }

    if (electronicsProductIds.length > 1) {
      await db.query(
        "INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)",
        [randomUUID(), customerId, electronicsProductIds[1], 1],
        conn
      );
    }
  });

  console.log("\nDatabase seeded with category-specific Indian ecommerce catalog");
  console.log(`Customer User ID: ${customerId}`);
  console.log("Email: customer@example.com | Password: password123");
  console.log("Admin Email: admin@example.com | Password: admin123");

  await db.shutdown();
};

main().catch(async (error) => {
  console.error(error);
  await db.shutdown();
  process.exit(1);
});
