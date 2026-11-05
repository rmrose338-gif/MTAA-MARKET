INSERT OR IGNORE INTO categories (id, name) VALUES
  (1, 'Home & Living'),
  (2, 'Fashion'),
  (3, 'Food & Pantry'),
  (4, 'Art & Crafts'),
  (5, 'Clothing & Accessories'),
  (6, 'Shoes & Footwear'),
  (7, 'Baby & Kids'),
  (8, 'Groceries'),
  (9, 'Snacks & Drinks'),
  (10, 'Animal Feed'),
  (11, 'Beauty & Personal Care'),
  (12, 'Kids'' Clothing'),
  (13, 'Teen Clothing'),
  (14, 'Adult Clothing'),
  (15, 'Older Adults'' Clothing'),
  (16, 'Fresh Produce'),
  (17, 'Farm Produce'),
  (18, 'Household Essentials'),
  (19, 'Kiosk & Shop Goods'),
  (20, 'Phone Accessories'),
  (21, 'School & Office Supplies'),
  (22, 'Hardware & Repair Supplies'),
  (23, 'Personal Care & Cleaning');

INSERT OR IGNORE INTO users (id, name, email, phone, market_area, public_contact, portrait_url, is_demo_profile, password_hash, role) VALUES
  (1, 'Mtaa Market Maker', 'maker@example.test', '0700000001', 'Kibera Market', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller'),
  (2, 'Njeri Kamau', 'njeri@example.test', '0700000002', 'Githurai', 1, 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller'),
  (3, 'Achieng Otieno', 'achieng@example.test', '0700000003', 'Kawangware', 1, 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller'),
  (4, 'Kamau Mwangi', 'kamau@example.test', '0700000004', 'Mathare', 1, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller'),
  (5, 'Faith Chebet', 'faith@example.test', '0700000005', 'Umoja', 1, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller'),
  (6, 'Brian Ouma', 'brian@example.test', '0700000006', 'Kibera', 1, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller'),
  (7, 'Wanjiku Njoroge', 'wanjiku@example.test', '0700000007', 'Kariobangi', 1, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=85', 1, '$2a$10$E4vTt3iE8kUfhJJVzF8w4.GvTq3YGw1X7LJ3f4V9W2J9gP2s9H5xm', 'seller');

UPDATE users SET portrait_url = CASE id
  WHEN 1 THEN 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85'
  WHEN 2 THEN 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=85'
  WHEN 3 THEN 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=300&q=85'
  WHEN 4 THEN 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85'
  WHEN 5 THEN 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=85'
  WHEN 6 THEN 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85'
  WHEN 7 THEN 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=85'
END,
is_demo_profile = CASE WHEN id BETWEEN 1 AND 7 THEN 1 ELSE is_demo_profile END;

UPDATE products
SET name = CASE name
      WHEN 'Hand-painted Clay Mug' THEN 'Pink Glass Tumbler with Cork Coaster'
      WHEN 'Soft Cotton Throw' THEN 'Handmade Crochet Throw Blanket'
      WHEN 'Pressed Flower Cards' THEN 'Handmade Floral Greeting Cards'
      WHEN 'Painted Wooden Coaster Pair' THEN 'Pattern-Painted Clay Cup'
      WHEN 'Plain White Ceramic Coffee Mug' THEN 'Pattern-Painted Clay Cup'
      WHEN 'Small Handmade Greeting Card Set' THEN 'Handmade Greeting Card Set'
      WHEN 'Handmade Beaded Key Ring' THEN 'Handmade Beaded Key Rings'
      WHEN 'Handwoven Paper Bookmark' THEN 'Handmade Paper Bookmark Pair'
      WHEN 'Reusable Market Carry Bag' THEN 'Reusable Cotton Tote Bag'
      WHEN 'Fresh Sweet Potatoes, 1 kg' THEN 'Fresh Potatoes, 1 kg'
      WHEN 'Raw Groundnuts, 500 g' THEN 'Groundnuts, 500 g'
      WHEN 'Assorted Nails, 500 g' THEN 'Assorted Metal Fasteners, 500 g'
      WHEN 'Moisturizing Petroleum Jelly, 250 ml' THEN 'Moisturizing Skin Cream, 50 ml'
      WHEN 'Family Shampoo, 400 ml' THEN 'Anti-Dandruff Shampoo, 700 ml'
      WHEN 'Coconut Hair Oil, 150 ml' THEN 'Hair Oil, 150 ml'
      WHEN 'Everyday Body Oil, 200 ml' THEN 'Aromatic Perfume Oil, 10 ml'
      WHEN 'Face Foundation' THEN 'Foundation Primer, 30 ml'
      WHEN 'Gentle Facial Cleanser, 200 ml' THEN 'Nourishing Facial Serum, 30 ml'
      WHEN 'Daily Face Moisturizer, 100 ml' THEN 'Sea Buckthorn Body Butter, 200 ml'
      WHEN 'Refreshing Body Mist, 100 ml' THEN 'Refreshing Facial Mist, 100 ml'
      ELSE name
    END,
    category_id = CASE name
      WHEN 'Hand-painted Clay Mug' THEN (SELECT id FROM categories WHERE name = 'Home & Living')
      ELSE category_id
    END
WHERE seller_id IN (SELECT id FROM users WHERE is_demo_profile = 1)
  AND name IN (
    'Hand-painted Clay Mug', 'Soft Cotton Throw', 'Pressed Flower Cards',
    'Painted Wooden Coaster Pair', 'Plain White Ceramic Coffee Mug',
    'Small Handmade Greeting Card Set', 'Handmade Beaded Key Ring',
    'Handwoven Paper Bookmark', 'Reusable Market Carry Bag',
    'Fresh Sweet Potatoes, 1 kg', 'Raw Groundnuts, 500 g',
    'Assorted Nails, 500 g', 'Moisturizing Petroleum Jelly, 250 ml',
    'Family Shampoo, 400 ml', 'Coconut Hair Oil, 150 ml',
    'Everyday Body Oil, 200 ml', 'Face Foundation',
    'Gentle Facial Cleanser, 200 ml', 'Daily Face Moisturizer, 100 ml',
    'Refreshing Body Mist, 100 ml'
  );

INSERT OR IGNORE INTO products (id, seller_id, category_id, name, description, price, image_url, stock) VALUES
  (1, 1, 1, 'Woven Market Basket', 'A sturdy, handwoven basket made for market mornings, picnics, and everyday storage.', 28.00, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80', 14),
  (2, 1, 2, 'Everyday Linen Tote', 'A roomy natural linen carryall, sewn in small batches and ready for daily errands.', 24.50, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80', 10),
  (3, 1, 3, 'Small-Batch Wildflower Honey', 'Golden local honey with a bright floral finish. A lovely little addition to the pantry.', 12.00, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80', 18),
  (4, 1, 1, 'Pink Glass Tumbler with Cork Coaster', 'A clear glass tumbler served with a square cork coaster.', 32.00, '/images/catalog/home/glass-tumbler-coaster.jpg', 7),
  (5, 1, 1, 'Handmade Crochet Throw Blanket', 'A handmade granny-square crochet throw blanket for a chair or sofa.', 46.00, '/images/catalog/home/crochet-throw.jpg', 6),
  (6, 1, 4, 'Handmade Floral Greeting Cards', 'Handmade greeting cards decorated with colorful floral embellishments.', 16.00, '/images/catalog/craft/flower-greeting-cards.jpg', 20);

UPDATE products SET seller_id = CASE id
  WHEN 1 THEN 2
  WHEN 2 THEN 3
  WHEN 3 THEN 4
  WHEN 4 THEN 5
  WHEN 5 THEN 6
  WHEN 6 THEN 7
  ELSE seller_id
END
WHERE id BETWEEN 1 AND 6;

INSERT OR IGNORE INTO job_listings (id, user_id, category, title, skills, description) VALUES
  (1, 2, 'tailoring', 'Njeri sews and alters clothes', 'Sewing, hemming, zips, fitting and repairs', 'I tailor everyday clothes and school uniforms, adjust hems and replace zips. Bring your garment or call to discuss a fitting, fabric and price.'),
  (2, 3, 'hair-and-barber', 'Achieng for braids and home styling', 'Braiding, protective styles, styling and home visits', 'I create neat everyday and occasion hairstyles at my home or agreed nearby location. Call to discuss the style, hair products and timing.'),
  (3, 4, 'carpentry', 'Kamau repairs furniture and shelves', 'Woodwork, door repairs, shelving and furniture fitting', 'I repair chairs, tables and doors, and make practical shelves for homes and kiosks. Send a photo or call to agree the work and materials.'),
  (4, 5, 'beauty-and-nails', 'Faith manicure and nail care', 'Manicure, pedicure, nail care and simple nail art', 'I provide clean, careful nail care for everyday and special occasions. Call to choose a style, appointment and nearby location.'),
  (5, 6, 'plumbing', 'Brian fixes leaks and blocked drains', 'Tap repairs, leak checks, drain clearing and pipe fittings', 'I help with leaking taps, sink blocks and common pipe repairs around the neighborhood. Send a clear photo or describe the issue when you call.'),
  (6, 7, 'cooking', 'Wanjiku cooks for homes and gatherings', 'Chapati, stew, meal preparation and small catering', 'I prepare affordable home-cooked meals and snacks for families and small events. Call to discuss the menu, number of people and collection or delivery.');

UPDATE job_listings
SET work_images = CASE id
  WHEN 1 THEN '["/images/service-work/tailoring.jpg"]'
  WHEN 2 THEN '["/images/service-work/hair-braiding.jpg"]'
  WHEN 3 THEN '["/images/service-work/carpentry.jpg"]'
  WHEN 4 THEN '["/images/service-work/nail-care.jpg"]'
  WHEN 5 THEN '["/images/service-work/plumbing.jpg"]'
  WHEN 6 THEN '["/images/service-work/cooking.jpg"]'
  ELSE work_images
END
WHERE id BETWEEN 1 AND 6
  AND user_id IN (SELECT id FROM users WHERE is_demo_profile = 1);

UPDATE users SET name = CASE id
  WHEN 1 THEN 'Mtaa Market Maker'
  WHEN 2 THEN 'Njeri Kamau'
  WHEN 3 THEN 'Achieng Otieno'
  WHEN 4 THEN 'Kamau Mwangi'
  WHEN 5 THEN 'Faith Chebet'
  WHEN 6 THEN 'Brian Ouma'
  WHEN 7 THEN 'Wanjiku Njoroge'
END
WHERE id BETWEEN 1 AND 7;

UPDATE job_listings SET title = CASE id
  WHEN 1 THEN 'Njeri sews and alters clothes'
  WHEN 2 THEN 'Achieng for braids and home styling'
  WHEN 3 THEN 'Kamau repairs furniture and shelves'
  WHEN 4 THEN 'Faith manicure and nail care'
  WHEN 5 THEN 'Brian fixes leaks and blocked drains'
  WHEN 6 THEN 'Wanjiku cooks for homes and gatherings'
END
WHERE id BETWEEN 1 AND 6;

UPDATE products SET price = CASE name
  WHEN 'Woven Market Basket' THEN 900
  WHEN 'Everyday Linen Tote' THEN 650
  WHEN 'Small-Batch Wildflower Honey' THEN 500
  WHEN 'Hand-painted Clay Mug' THEN 600
  WHEN 'Pink Glass Tumbler with Cork Coaster' THEN 600
  WHEN 'Soft Cotton Throw' THEN 1800
  WHEN 'Handmade Crochet Throw Blanket' THEN 1800
  WHEN 'Pressed Flower Cards' THEN 300
  WHEN 'Handmade Floral Greeting Cards' THEN 300
  ELSE price
END
WHERE name IN (
  'Woven Market Basket', 'Everyday Linen Tote', 'Small-Batch Wildflower Honey',
  'Hand-painted Clay Mug', 'Pink Glass Tumbler with Cork Coaster',
  'Soft Cotton Throw', 'Handmade Crochet Throw Blanket',
  'Pressed Flower Cards', 'Handmade Floral Greeting Cards'
) AND price < 100;

UPDATE products
SET name = CASE name
  WHEN 'Adult Everyday Polo Shirt' THEN 'Men''s Everyday Polo Shirt'
  WHEN 'Adult Straight-Leg Trousers' THEN 'Men''s Straight-Leg Trousers'
  WHEN 'Adult Cotton Blouse' THEN 'Women''s Cotton Blouse'
  WHEN 'Adult Button-Down Shirt' THEN 'Men''s Button-Down Shirt'
  WHEN 'Adult Lightweight Cardigan' THEN 'Women''s Lightweight Cardigan'
  WHEN 'Easy-Wear Button-Front Shirt' THEN 'Men''s Easy-Wear Button-Front Shirt'
  WHEN 'Comfort-Fit Elastic-Waist Trousers' THEN 'Men''s Comfort-Fit Elastic-Waist Trousers'
  WHEN 'Soft Warm Knit Cardigan' THEN 'Women''s Soft Warm Knit Cardigan'
  WHEN 'Lightweight Cotton House Dress' THEN 'Women''s Lightweight Cotton House Dress'
  WHEN 'Warm Everyday Shawl' THEN 'Women''s Warm Everyday Shawl'
  WHEN 'Everyday Cotton T-Shirt' THEN 'Men''s Everyday Cotton Tee'
  WHEN 'Warm Everyday Scarf' THEN 'Women''s Warm Everyday Scarf'
  WHEN 'Knit Marvin Beanie' THEN 'Child''s Knit Marvin Beanie'
  WHEN 'Cotton Everyday Vest' THEN 'Men''s Cotton Everyday Vest'
  WHEN 'Everyday Underwear Pack' THEN 'Men''s Everyday Underwear Pack'
  WHEN 'Comfort Cotton Socks' THEN 'Children''s Comfort Cotton Socks'
  ELSE name
END
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND name IN (
    'Adult Everyday Polo Shirt', 'Adult Straight-Leg Trousers', 'Adult Cotton Blouse',
    'Adult Button-Down Shirt', 'Adult Lightweight Cardigan', 'Easy-Wear Button-Front Shirt',
    'Comfort-Fit Elastic-Waist Trousers', 'Soft Warm Knit Cardigan',
    'Lightweight Cotton House Dress', 'Warm Everyday Shawl', 'Everyday Cotton T-Shirt',
    'Warm Everyday Scarf', 'Knit Marvin Beanie', 'Cotton Everyday Vest',
    'Everyday Underwear Pack', 'Comfort Cotton Socks'
  );

WITH catalog(category, name, description, price, image_url, stock) AS (
  VALUES
    ('Baby & Kids', 'Baby Cotton Bodysuit', 'Soft, breathable cotton bodysuit for everyday baby comfort.', 350, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 24),
    ('Baby & Kids', 'Baby First-Step Shoes', 'Lightweight, soft-soled shoes for little feet taking their first steps.', 300, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80', 18),
    ('Baby & Kids', 'Kids Everyday Outfit', 'An easy-to-wash, comfortable top and bottoms set for play and school.', 700, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 16),
    ('Kids'' Clothing', 'Kids Graphic Cotton T-Shirt', 'A colorful, soft cotton t-shirt for children, available in sizes for ages 3–12.', 400, 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80', 24),
    ('Kids'' Clothing', 'Kids School Shorts', 'Comfortable, hard-wearing shorts for school and play, with several children''s sizes.', 500, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 18),
    ('Kids'' Clothing', 'Children''s School Uniform Shirt', 'A neat, durable school shirt for children. Contact the seller to confirm the size and school requirements.', 550, 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=900&q=80', 14),
    ('Kids'' Clothing', 'Children''s School Uniform Skirt', 'A practical school skirt for children. Check sizing and uniform requirements with the seller.', 600, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 12),
    ('Kids'' Clothing', 'Children''s School Uniform Trousers', 'Everyday school trousers for children. Contact the seller to confirm size and uniform color.', 650, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', 12),
    ('Kids'' Clothing', 'Kids Fleece Hoodie', 'A cozy pullover hoodie for cooler days, available in children''s sizes.', 850, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 16),
    ('Kids'' Clothing', 'Kids Everyday Dress', 'A lightweight, easy-care dress for school, family visits, and weekends.', 750, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 14),
    ('Kids'' Clothing', 'Kids Warm Pajama Set', 'A soft long-sleeve top and matching bottoms for a comfortable night''s sleep.', 900, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80', 12),
    ('Teen Clothing', 'Teen Relaxed-Fit T-Shirt', 'A breathable everyday tee with a relaxed fit, available in teen sizes.', 550, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 22),
    ('Teen Clothing', 'Teen Denim Jeans', 'Classic, sturdy denim jeans for school and weekends, available in teen sizes.', 950, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80', 16),
    ('Teen Clothing', 'Teen Zip-Up Hoodie', 'A warm zip-up hoodie with roomy pockets for everyday layering.', 900, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 18),
    ('Teen Clothing', 'Teen Casual Dress', 'A comfortable, versatile casual dress for outings and everyday wear.', 850, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80', 12),
    ('Teen Clothing', 'Teen Track Pants', 'Soft, flexible track pants for relaxing, sports, and after-school activities.', 850, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80', 20),
    ('Adult Clothing', 'Men''s Everyday Polo Shirt', 'A smart-casual cotton polo modeled by a man for work, errands, and weekends.', 800, '/images/catalog/models/man-tee.svg', 20),
    ('Adult Clothing', 'Men''s Straight-Leg Trousers', 'Comfortable, versatile trousers modeled by a man for work or everyday wear.', 950, '/images/catalog/models/man-trousers.svg', 14),
    ('Adult Clothing', 'Women''s Cotton Blouse', 'A breathable blouse modeled by a woman with a relaxed fit for work or casual outings.', 900, '/images/catalog/models/woman-blouse.svg', 16),
    ('Adult Clothing', 'Men''s Button-Down Shirt', 'A classic long-sleeve shirt modeled by a man for celebrations and everyday wear.', 950, '/images/catalog/models/man-shirt.svg', 18),
    ('Adult Clothing', 'Women''s Lightweight Cardigan', 'An easy-layer cardigan modeled by a woman for cool mornings and evenings.', 950, '/images/catalog/models/woman-cardigan.svg', 12),
    ('Adult Clothing', 'Men''s Everyday Cotton T-Shirt', 'A breathable cotton T-shirt modeled by a man for everyday wear.', 650, '/images/catalog/models/man-tee.svg', 24),
    ('Adult Clothing', 'Men''s Casual Denim Jeans', 'Straight-fit denim jeans modeled by a man for workdays and weekends.', 950, '/images/catalog/models/man-trousers.svg', 16),
    ('Adult Clothing', 'Men''s Long-Sleeve Shirt', 'A versatile button-down shirt modeled by a man for everyday outfits.', 950, '/images/catalog/models/man-shirt.svg', 14),
    ('Adult Clothing', 'Men''s Zip-Up Hoodie', 'A comfortable zip-up hoodie modeled by a man with practical pockets.', 950, '/images/catalog/models/man-hoodie.svg', 12),
    ('Adult Clothing', 'Women''s Relaxed Cotton Blouse', 'A soft, breathable blouse modeled by a woman for work or casual outings.', 900, '/images/catalog/models/woman-blouse.svg', 16),
    ('Adult Clothing', 'Women''s Everyday Dress', 'An easy-care dress modeled by a woman for daily wear and family visits.', 950, '/images/catalog/models/woman-dress.svg', 14),
    ('Adult Clothing', 'Women''s Knit Cardigan', 'A soft knit layer modeled by a woman for cool mornings and evenings.', 950, '/images/catalog/models/woman-cardigan.svg', 12),
    ('Adult Clothing', 'Women''s Casual Trousers', 'Comfortable straight-leg trousers modeled by a woman for everyday wear.', 950, '/images/catalog/models/woman-trousers.svg', 14),
    ('Older Adults'' Clothing', 'Men''s Easy-Wear Button-Front Shirt', 'A soft, roomy shirt modeled by a man with easy-to-handle buttons.', 850, '/images/catalog/models/man-shirt.svg', 14),
    ('Older Adults'' Clothing', 'Men''s Comfort-Fit Elastic-Waist Trousers', 'Lightweight trousers modeled by a man with a comfortable elastic waist.', 850, '/images/catalog/models/man-trousers.svg', 14),
    ('Older Adults'' Clothing', 'Women''s Soft Warm Knit Cardigan', 'A warm knit cardigan modeled by a woman that is easy to layer.', 950, '/images/catalog/models/woman-cardigan.svg', 10),
    ('Older Adults'' Clothing', 'Women''s Lightweight Cotton House Dress', 'A breathable house dress modeled by a woman with a relaxed fit.', 850, '/images/catalog/models/woman-dress.svg', 12),
    ('Older Adults'' Clothing', 'Women''s Warm Everyday Shawl', 'A soft, generous shawl modeled by a woman for an extra layer of warmth.', 650, '/images/catalog/models/woman-shawl.svg', 18),
    ('Clothing & Accessories', 'Men''s Everyday Cotton Tee', 'An easy-fit cotton tee modeled by a man for comfortable everyday wear.', 450, '/images/catalog/models/man-tee.svg', 30),
    ('Clothing & Accessories', 'Women''s Warm Everyday Scarf', 'A soft, cozy scarf modeled by a woman for cool mornings and evenings.', 350, '/images/catalog/models/woman-cardigan.svg', 20),
    ('Clothing & Accessories', 'Child''s Knit Marvin Beanie', 'A warm, stretchy knit cap modeled by a child for school and outdoor play.', 250, '/images/catalog/models/child-hoodie.svg', 24),
    ('Clothing & Accessories', 'Men''s Cotton Everyday Vest', 'A comfortable cotton vest modeled by a man for everyday layering.', 300, '/images/catalog/models/man-tee.svg', 26),
    ('Clothing & Accessories', 'Men''s Everyday Underwear Pack', 'A practical three-piece everyday underwear pack modeled by a man.', 450, '/images/catalog/models/man-trousers.svg', 20),
    ('Clothing & Accessories', 'Children''s Comfort Cotton Socks', 'Soft, durable cotton socks modeled by a child. Sold as a pair.', 120, '/images/catalog/models/child-playwear.svg', 40),
    ('Shoes & Footwear', 'Ladies Flat Shoes', 'Simple, comfortable flat shoes for work, errands, and everyday wear.', 900, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80', 14),
    ('Shoes & Footwear', 'Men’s Everyday Shoes', 'Versatile, comfortable lace-up shoes for daily wear.', 950, 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=80', 12),
    ('Shoes & Footwear', 'Rainy-Day Gumboots', 'Water-resistant boots for rainy days, garden work, and muddy paths.', 950, '/images/rain-boots.jpg', 15),
    ('Shoes & Footwear', 'Lightweight Everyday Clogs', 'Easy-clean, lightweight slip-on clogs with a comfortable fit.', 950, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80', 18),
    ('Shoes & Footwear', 'Home Comfort Slippers', 'Soft, affordable slip-on slippers for relaxing around the home.', 350, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80', 22),
    ('Shoes & Footwear', 'Kids Canvas Trainers', 'Lightweight canvas trainers for playtime, school, and weekends.', 800, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80', 15),
    ('Groceries', 'Maize Flour, 2 kg', 'A 2 kg pack of everyday maize flour for family meals.', 160, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80', 50),
    ('Groceries', 'Long-Grain Rice, 1 kg', 'A 1 kg pack of versatile long-grain rice for home cooking.', 180, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80', 45),
    ('Groceries', 'Dry Beans, 1 kg', 'A 1 kg pack of pantry beans, ready for wholesome family meals.', 180, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80', 40),
    ('Groceries', 'Cooking Oil, 1 litre', 'A handy 1 litre bottle of cooking oil for everyday meals.', 280, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80', 30),
    ('Groceries', 'White Sugar, 1 kg', 'A 1 kg pack of everyday sugar for tea, porridge, and baking.', 170, 'https://images.unsplash.com/photo-1581264695897-80f0d95b3c7c?auto=format&fit=crop&w=900&q=80', 35),
    ('Groceries', 'Kenyan Tea Leaves, 250 g', 'Rich, locally grown tea leaves for a comforting cup at home.', 150, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80', 28),
    ('Snacks & Drinks', 'Roasted Groundnuts, 250 g', 'A crunchy, satisfying roasted groundnut snack to share.', 100, 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=900&q=80', 35),
    ('Snacks & Drinks', 'Family Biscuits Pack', 'A family-size pack of crunchy biscuits for tea time.', 80, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80', 40),
    ('Snacks & Drinks', 'Crispy Banana Chips', 'A light, crunchy banana snack for lunch boxes and sharing.', 100, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80', 28),
    ('Snacks & Drinks', 'Family Porridge Flour, 1 kg', 'A nourishing 1 kg porridge flour blend for easy breakfasts.', 200, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80', 30),
    ('Animal Feed', 'Dog Food, 1 kg', 'A handy 1 kg pack of balanced dry food for dogs.', 350, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80', 20),
    ('Animal Feed', 'Layers Mash, 2 kg', 'A practical 2 kg feed pack formulated for laying hens.', 220, 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80', 24),
    ('Animal Feed', 'Dairy Meal, 2 kg', 'A 2 kg dairy meal pack for small-scale and home dairy farming.', 240, 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=900&q=80', 20),
    ('Animal Feed', 'Chick Starter Mash, 2 kg', 'A 2 kg starter feed pack for growing chicks.', 260, 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80', 20),
    ('Fresh Produce', 'Fresh Tomatoes, 1 kg', 'Locally sourced ripe tomatoes for everyday cooking. Availability may vary with the harvest.', 120, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80', 30),
    ('Fresh Produce', 'Red Onions, 1 kg', 'A fresh 1 kg portion of red onions for home cooking.', 140, 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80', 25),
    ('Fresh Produce', 'Irish Potatoes, 2 kg', 'A 2 kg bag of locally sourced potatoes, ready for family meals.', 180, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80', 25),
    ('Fresh Produce', 'Fresh Carrots, 1 kg', 'Crunchy carrots sold in a convenient 1 kg portion.', 130, 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=80', 20),
    ('Fresh Produce', 'Sukuma Wiki Bunch', 'A fresh bunch of sukuma wiki for a quick, affordable family meal.', 40, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80', 35),
    ('Fresh Produce', 'Spinach Bunch', 'Fresh leafy spinach, harvested locally when available.', 50, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80', 24),
    ('Fresh Produce', 'Fresh Cabbage', 'A whole fresh cabbage for salads, stews, and family meals.', 90, 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=900&q=80', 18),
    ('Fresh Produce', 'Ripe Bananas, 1 kg', 'A 1 kg bunch of sweet, ripe bananas, subject to seasonal availability.', 120, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80', 20),
    ('Fresh Produce', 'Seasonal Mangoes, 1 kg', 'Seasonal ripe mangoes sourced from local growers when in season.', 160, 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80', 16),
    ('Fresh Produce', 'Fresh Oranges, 1 kg', 'A 1 kg portion of juicy oranges for snacks and fresh juice.', 150, 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=80', 18),
    ('Farm Produce', 'Farm-Fresh Eggs, Tray of 30', 'A tray of eggs sourced from a local poultry farmer. Handle and store safely.', 450, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=80', 12),
    ('Farm Produce', 'Green Grams, 1 kg', 'Locally grown green grams for nutritious family meals.', 220, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80', 24),
    ('Farm Produce', 'Groundnuts, 500 g', 'A 500 g portion of groundnuts for cooking, roasting, or snacking.', 180, '/images/catalog/farm/groundnuts.jpg', 20),
    ('Farm Produce', 'Local Forest Honey, 500 g', 'Locally harvested honey in a sealed 500 g jar.', 400, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80', 14),
    ('Household Essentials', 'Ariel 3-in-1 Laundry Detergent Pods', 'Ariel 3-in-1 laundry detergent pods for everyday machine washing.', 220, '/images/catalog/photoreal/ariel.jpg', 18),
    ('Household Essentials', 'Toilet Tissue, 4 Rolls', 'A practical four-roll pack of soft toilet tissue.', 180, 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=900&q=80', 24),
    ('Household Essentials', 'Plastic Water Basin', 'A durable household basin for washing and everyday chores.', 350, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80', 10),
    ('Household Essentials', 'Reusable Food Storage Containers', 'A set of reusable containers for storing dry foods and leftovers.', 500, '/images/catalog/product-105.jpg', 12),
    ('Household Essentials', 'Everyday Cooking Utensil Set', 'A basic set of cooking utensils for everyday home meals.', 450, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80', 10),
    ('Kiosk & Shop Goods', 'Fresh Bread Loaf', 'A fresh loaf from a local bakery. Best enjoyed on the day of purchase.', 70, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', 16),
    ('Kiosk & Shop Goods', 'Fresh Milk, 500 ml', 'A sealed 500 ml pack of milk. Keep refrigerated and check the use-by date.', 70, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80', 12),
    ('Kiosk & Shop Goods', 'Table Salt, 1 kg', 'A 1 kg pack of everyday table salt for cooking.', 60, 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442d?auto=format&fit=crop&w=900&q=80', 20),
    ('Kiosk & Shop Goods', 'Bottled Drinking Water, 1 litre', 'Sealed 1 litre bottle of drinking water.', 60, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80', 24),
    ('Phone Accessories', 'Universal USB Phone Charger', 'A compact USB wall charger. Check connector and device compatibility before purchase.', 450, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80', 12),
    ('Phone Accessories', 'USB Charging Cable', 'A 1 metre USB charging cable. Confirm the connector type with the seller.', 250, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80', 20),
    ('Phone Accessories', 'Clear Protective Phone Case', 'A flexible clear phone case. Contact the seller to confirm your phone model fits.', 350, 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80', 14),
    ('Phone Accessories', 'Wired Earphones', 'Everyday wired earphones. Confirm connector compatibility with your device.', 400, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 12),
    ('Phone Accessories', 'Portable Power Bank, 10,000 mAh', 'A portable 10,000 mAh power bank. Confirm model, charging ports, and warranty with seller.', 1800, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80', 8),
    ('School & Office Supplies', 'Exercise Books, 5 Pack', 'Five ruled exercise books for school, home study, or everyday notes.', 250, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80', 24),
    ('School & Office Supplies', 'Blue Ballpoint Pens, 10 Pack', 'A ten-pack of blue ballpoint pens for students and office use.', 180, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80', 30),
    ('School & Office Supplies', 'Pencils and Erasers Set', 'A practical set of pencils and erasers for school or drawing.', 120, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', 25),
    ('School & Office Supplies', 'Mathematical Set', 'A student geometry set with basic drawing and measuring tools.', 250, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80', 16),
    ('School & Office Supplies', 'Everyday School Backpack', 'A practical backpack for books and school supplies. Check size with the seller.', 1200, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 10),
    ('School & Office Supplies', 'Reusable School Lunch Box', 'A reusable lunch box for carrying meals to school or work.', 450, '/images/catalog/product-121.jpg', 12),
    ('School & Office Supplies', 'A4 Printing Paper, 500 Sheets', 'A ream of A4 paper for printing, school assignments, and office work.', 650, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80', 10),
    ('School & Office Supplies', 'Document Files, 5 Pack', 'Five folders for organizing school notes, forms, and office documents.', 300, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80', 14),
    ('School & Office Supplies', 'Writing Notebooks, 3 Pack', 'Three compact notebooks for class notes, planning, or office use.', 280, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80', 18),
    ('School & Office Supplies', 'Business Envelopes, 25 Pack', 'A pack of 25 envelopes for letters, school forms, or office documents.', 200, 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=80', 12),
    ('Hardware & Repair Supplies', 'Assorted Metal Fasteners, 500 g', 'A 500 g assortment of metal fasteners for common household repairs.', 180, '/images/catalog/hardware/assorted-fasteners.jpg', 16),
    ('Hardware & Repair Supplies', 'Wood Screws, 50 Pack', 'A pack of 50 general-purpose wood screws for basic home repairs.', 150, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80', 18),
    ('Hardware & Repair Supplies', 'Steel Padlock', 'A sturdy padlock for gates, doors, and storage. Confirm size and key details with the seller.', 350, 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80', 10),
    ('Hardware & Repair Supplies', 'Door Hinges, Pair', 'A pair of basic metal door hinges for household repairs.', 250, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80', 12),
    ('Hardware & Repair Supplies', 'Household Hammer', 'A general-purpose hammer for simple home and workshop tasks.', 650, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80', 8),
    ('Hardware & Repair Supplies', 'Screwdriver Set, 6 Pieces', 'A six-piece set of common screwdrivers for basic repairs.', 550, 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8a7d?auto=format&fit=crop&w=900&q=80', 8),
    ('Hardware & Repair Supplies', 'Measuring Tape, 5 m', 'A retractable five-metre measuring tape for household and DIY projects.', 250, 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8a7d?auto=format&fit=crop&w=900&q=80', 12),
    ('Hardware & Repair Supplies', 'Paint Brush, 2 Inch', 'A two-inch brush for small painting jobs and touch-ups.', 180, 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=80', 14),
    ('Hardware & Repair Supplies', 'LED Household Bulb', 'An energy-saving LED bulb. Confirm the fitting and wattage needed before purchase.', 250, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', 16),
    ('Hardware & Repair Supplies', 'Basic Light Switch', 'A replacement light switch for home repair. Installation should be done safely by a qualified person.', 180, 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=80', 10),
    ('Hardware & Repair Supplies', 'Plumbing Tap Fittings Set', 'Common plumbing washers and fittings for minor maintenance. Ask a qualified plumber if unsure.', 300, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80', 10),
    ('Personal Care & Cleaning', 'Toothbrush, 2 Pack', 'A two-pack of everyday toothbrushes for personal oral care.', 100, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80', 20),
    ('Personal Care & Cleaning', 'Sanitary Pads, 8 Pack', 'An affordable sealed eight-pack of sanitary pads.', 100, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80', 22),
    ('Personal Care & Cleaning', 'Everyday Shampoo, 400 ml', 'A sealed 400 ml bottle of shampoo for everyday hair care.', 350, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80', 18),
    ('Personal Care & Cleaning', 'Everyday Body Lotion, 250 ml', 'A sealed 250 ml moisturizer for everyday body care.', 280, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80', 18),
    ('Personal Care & Cleaning', 'Deodorant, 150 ml', 'A sealed 150 ml deodorant for everyday personal care.', 300, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80', 16),
    ('Personal Care & Cleaning', 'Dishwashing Liquid, 500 ml', 'A 500 ml bottle of dishwashing liquid for everyday kitchen cleaning.', 220, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80', 18),
    ('Personal Care & Cleaning', 'Multi-Purpose Household Cleaner, 500 ml', 'A sealed 500 ml multi-purpose cleaner. Follow the product label and keep away from children.', 280, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80', 14),
    ('Personal Care & Cleaning', 'Household Broom', 'A sturdy broom for everyday home and shop cleaning.', 350, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 10),
    ('Personal Care & Cleaning', 'Floor Mop', 'A basic floor mop for everyday household cleaning.', 500, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 8),
    ('Personal Care & Cleaning', 'Cleaning Sponges, 3 Pack', 'A three-pack of reusable household cleaning sponges.', 100, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 20),
    ('Personal Care & Cleaning', 'Household Dustbin', 'A compact dustbin for everyday kitchen, office, or bedroom use.', 450, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', 8),
    ('Beauty & Personal Care', 'Makeup Collection', 'A curated set of everyday makeup essentials, from lipstick and foundation to powder, mascara, eyeliner, nail polish, and brushes.', 2200, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', 6),
    ('Beauty & Personal Care', 'Gentle Bathing Soap, 2 Bars', 'A practical two-bar bathing soap pack for everyday family use.', 120, 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=900&q=80', 35),
    ('Beauty & Personal Care', 'Everyday Body Lotion, 250 ml', 'A simple 250 ml moisturizer for everyday body care.', 280, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80', 25),
    ('Beauty & Personal Care', 'Moisturizing Skin Cream, 50 ml', 'A 50 ml jar of moisturizing skin cream for everyday care.', 180, '/images/catalog/beauty/skin-cream.jpg', 25),
    ('Beauty & Personal Care', 'Anti-Dandruff Shampoo, 700 ml', 'A 700 ml anti-dandruff shampoo for regular hair washing.', 350, '/images/catalog/beauty/shampoo.jpg', 18),
    ('Beauty & Personal Care', 'Hair Oil, 150 ml', 'A 150 ml bottle of nourishing hair oil.', 220, '/images/catalog/beauty/coconut-hair-oil.jpg', 20),
    ('Beauty & Personal Care', 'Toothpaste, 100 ml', 'A convenient 100 ml tube of everyday toothpaste.', 150, 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80', 30),
    ('Beauty & Personal Care', 'Sanitary Towels, 8 Pack', 'An affordable eight-piece pack of everyday sanitary towels.', 100, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80', 22),
    ('Beauty & Personal Care', 'Aromatic Perfume Oil, 10 ml', 'A small bottle of aromatic perfume oil for personal fragrance.', 240, '/images/catalog/beauty/body-oil.jpg', 18),
    ('Beauty & Personal Care', 'Everyday Lipstick', 'A smooth, comfortable lipstick for adding color to everyday or special-occasion looks.', 350, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80', 18),
    ('Beauty & Personal Care', 'Foundation Primer, 30 ml', 'A 30 ml cosmetic foundation primer for preparing skin before makeup.', 750, '/images/catalog/beauty/foundation-primer.jpg', 14),
    ('Beauty & Personal Care', 'Compact Face Powder', 'A compact powder for setting makeup or reducing shine during the day.', 500, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', 16),
    ('Beauty & Personal Care', 'Lengthening Mascara', 'Everyday mascara designed to define and lengthen lashes.', 450, 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=900&q=80', 15),
    ('Beauty & Personal Care', 'Black Eyeliner Pencil', 'An easy-to-apply eyeliner pencil for defining the eyes.', 250, 'https://images.unsplash.com/photo-1583241800698-e8ab01830a1b?auto=format&fit=crop&w=900&q=80', 20),
    ('Beauty & Personal Care', 'Nail Polish', 'A quick-drying nail color for a neat manicure at home.', 180, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80', 24),
    ('Beauty & Personal Care', 'Makeup Brush Set', 'A practical set of soft brushes for applying face and eye makeup.', 650, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', 12),
    ('Beauty & Personal Care', 'Nourishing Facial Serum, 30 ml', 'A 30 ml nourishing facial serum for a daily skincare routine.', 400, '/images/catalog/beauty/face-serum-routine.jpg', 18),
    ('Beauty & Personal Care', 'Sea Buckthorn Body Butter, 200 ml', 'A 200 ml jar of sea buckthorn body butter for moisturizing skin.', 480, '/images/catalog/beauty/face-moisturizer.jpg', 16),
    ('Beauty & Personal Care', 'Broad-Spectrum Sunscreen, 100 ml', 'Daily sunscreen to help protect skin from sun exposure.', 600, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80', 14),
    ('Beauty & Personal Care', 'Hair Conditioner, 400 ml', 'A nourishing conditioner for softer, easier-to-comb hair.', 380, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80', 18),
    ('Beauty & Personal Care', 'Refreshing Facial Mist, 100 ml', 'A 100 ml refreshing facial mist for a light skincare spritz.', 350, '/images/catalog/beauty/facial-mist-routine.jpg', 15)
)
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock)
SELECT seller.id, categories.id, catalog.name, catalog.description, catalog.price,
       catalog.image_url, catalog.stock
FROM catalog
JOIN users AS seller ON seller.email = 'maker@example.test'
JOIN categories ON categories.name = catalog.category
WHERE NOT EXISTS (
  SELECT 1 FROM products
  WHERE products.seller_id = seller.id
    AND (
      products.name = catalog.name
      OR (catalog.name = 'Ariel Automatic Laundry Detergent, 1 kg'
          AND products.name = 'Laundry Detergent, 1 kg')
      OR (catalog.name = 'Sunlight Lemon Dishwashing Liquid, 250 ml'
          AND products.name = 'Small Dishwashing Liquid, 250 ml')
    )
);

UPDATE products
SET image_url = CASE name
  WHEN 'Men''s Everyday Polo Shirt' THEN 'https://images.unsplash.com/photo-1625910513413-5fc9bd5d3eaf?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Straight-Leg Trousers' THEN 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Cotton Blouse' THEN 'https://images.unsplash.com/photo-1564257577-4d4d4e1e2d1a?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Button-Down Shirt' THEN 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Lightweight Cardigan' THEN 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Everyday Cotton T-Shirt' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Casual Denim Jeans' THEN 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Long-Sleeve Shirt' THEN 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Zip-Up Hoodie' THEN 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Relaxed Cotton Blouse' THEN 'https://images.unsplash.com/photo-1564257577-4d4d4e1e2d1a?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Everyday Dress' THEN 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Knit Cardigan' THEN 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Casual Trousers' THEN 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Warm Everyday Shawl' THEN 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Everyday Cotton Dress' THEN 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Casual Cotton Shirt' THEN 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Easy-Wear Blouse' THEN 'https://images.unsplash.com/photo-1564257577-4d4d4e1e2d1a?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Everyday Trousers' THEN 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85'
  ELSE image_url
END
WHERE name IN (
  'Men''s Everyday Polo Shirt', 'Men''s Straight-Leg Trousers', 'Women''s Cotton Blouse',
  'Men''s Button-Down Shirt', 'Women''s Lightweight Cardigan', 'Men''s Everyday Cotton T-Shirt',
  'Men''s Casual Denim Jeans', 'Men''s Long-Sleeve Shirt', 'Men''s Zip-Up Hoodie',
  'Women''s Relaxed Cotton Blouse', 'Women''s Everyday Dress', 'Women''s Knit Cardigan',
  'Women''s Casual Trousers', 'Women''s Warm Everyday Shawl', 'Women''s Everyday Cotton Dress',
  'Men''s Casual Cotton Shirt', 'Women''s Easy-Wear Blouse', 'Men''s Everyday Trousers'
);

WITH more_catalog(category, name, description, price, image_url, stock) AS (
  VALUES
    ('Food & Pantry', 'Wheat Grain, 1 kg', 'A one-kilo portion of whole wheat kernels for milling or cooking.', 180, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80', 28),
    ('Food & Pantry', 'Assorted Dry Beans, 500 g', 'A half-kilo mix of assorted dry beans for soups and stews.', 140, 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?auto=format&fit=crop&w=900&q=80', 24),
    ('Food & Pantry', 'Black-Eyed Peas, 500 g', 'A half-kilo pack of black-eyed peas for a filling home-cooked meal.', 120, 'https://images.unsplash.com/photo-1515347272087-685ce5a1fc8b?auto=format&fit=crop&w=900&q=80', 26),
    ('Food & Pantry', 'Roasted Chickpeas, 1 kg', 'A one-kilo pack of crunchy roasted chickpeas for snacks and meals.', 180, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80', 20),
    ('Food & Pantry', 'Roasted Groundnuts, 250 g', 'A small serving of roasted groundnuts for breakfast and snacks.', 220, 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=900&q=80', 16),
    ('Food & Pantry', 'Wheat Porridge Flour, 500 g', 'A half-kilo pack of wheat flour for warm breakfast porridge.', 130, 'https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?auto=format&fit=crop&w=900&q=80', 22),
    ('Home & Living', 'Woven Storage Tray', 'A practical, locally woven tray for serving or keeping small household items.', 450, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80', 12),
    ('Home & Living', 'Reusable Cotton Tote Bag', 'A reusable cotton shoulder bag for market shopping and everyday errands.', 180, '/images/catalog/commons-cotton-tote.jpg', 25),
    ('Home & Living', 'Small Cotton Cushion Cover', 'A simple washable cushion cover to refresh a chair or sofa.', 350, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80', 14),
    ('Home & Living', 'Handwoven Table Mat', 'A handmade table mat that protects surfaces and adds a warm local touch.', 250, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80', 18),
    ('Art & Crafts', 'Handmade Beaded Key Rings', 'A colorful set of handmade beaded key rings.', 100, '/images/catalog/craft/beaded-keyrings.jpg', 30),
    ('Art & Crafts', 'Pattern-Painted Clay Cup', 'A small clay cup with a warm, pattern-painted finish.', 180, '/images/catalog/craft/painted-clay-mug.jpg', 16),
    ('Art & Crafts', 'Handmade Greeting Card Set', 'A small set of handmade floral greeting cards for birthdays and special occasions.', 160, '/images/catalog/craft/flower-greeting-cards.jpg', 20),
    ('Fashion', 'Women''s Everyday Cotton Dress', 'A comfortable cotton dress modeled by a woman for daily errands and family visits.', 850, '/images/catalog/models/woman-dress.svg', 14),
    ('Fashion', 'Men''s Casual Cotton Shirt', 'A simple breathable shirt modeled by a man for work and everyday wear.', 750, '/images/catalog/models/man-shirt.svg', 16),
    ('Fashion', 'Women''s Easy-Wear Blouse', 'An affordable easy-care blouse modeled by a woman for work or weekends.', 600, '/images/catalog/models/woman-blouse.svg', 18),
    ('Fashion', 'Men''s Everyday Trousers', 'Comfortable everyday trousers modeled by a man at an affordable price.', 950, '/images/catalog/models/man-trousers.svg', 14),
    ('Baby & Kids', 'Child''s Play T-Shirt and Shorts', 'A simple washable play outfit modeled by a child for everyday fun.', 450, '/images/catalog/models/child-playwear.svg', 18),
    ('Baby & Kids', 'Child''s School Outfit', 'A neat, comfortable school outfit modeled by a child for the school day.', 700, '/images/catalog/models/child-schoolwear.svg', 12),
    ('Baby & Kids', 'Baby Soft Cotton Sleep Suit', 'A soft, easy-to-wash baby sleep suit for comfortable nights.', 500, '/images/catalog/models/child-playwear.svg', 14),
    ('Kids'' Clothing', 'Children''s Play T-Shirt', 'A light, easy-wash play shirt modeled by a child for everyday wear.', 300, '/images/catalog/models/child-playwear.svg', 24),
    ('Kids'' Clothing', 'Children''s School Cardigan', 'A warm school cardigan modeled by a child for cooler mornings.', 650, '/images/catalog/models/child-schoolwear.svg', 12),
    ('Kids'' Clothing', 'Children''s Weekend Dress', 'An easy-care weekend dress modeled by a child for everyday outings.', 550, '/images/catalog/models/child-dress.svg', 14),
    ('Teen Clothing', 'Teen Boy''s Everyday T-Shirt', 'A comfortable everyday T-shirt modeled by a child for teen sizes.', 450, '/images/catalog/models/child-playwear.svg', 20),
    ('Teen Clothing', 'Teen Girl''s Everyday Skirt', 'An easy-to-wear skirt modeled by a child for teen sizes.', 550, '/images/catalog/models/child-dress.svg', 14),
    ('Clothing & Accessories', 'Men''s Cotton Vest', 'A comfortable, affordable cotton vest modeled by a man for daily layering.', 280, '/images/catalog/models/man-tee.svg', 20),
    ('Clothing & Accessories', 'Women''s Everyday Scarf', 'A soft, light scarf modeled by a woman for cool mornings and evenings.', 300, '/images/catalog/models/woman-cardigan.svg', 18),
    ('Clothing & Accessories', 'Children''s Warm Beanie', 'A stretchy knit beanie modeled by a child for school and outdoor play.', 220, '/images/catalog/models/child-hoodie.svg', 22),
    ('Clothing & Accessories', 'Men''s Everyday Socks, 2 Pairs', 'Two pairs of comfortable everyday socks modeled by a man.', 180, '/images/catalog/models/man-trousers.svg', 30),
    ('Shoes & Footwear', 'Women''s Everyday Sandals', 'Comfortable everyday sandals for women at a budget-friendly price.', 650, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80', 16),
    ('Shoes & Footwear', 'Men''s Canvas Shoes', 'Lightweight everyday canvas shoes for men at an affordable price.', 850, 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=80', 14),
    ('Shoes & Footwear', 'Children''s School Shoes', 'Durable school shoes for children at a lower everyday price.', 800, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80', 16),
    ('Shoes & Footwear', 'Women''s Flat Shoes', 'Simple, comfortable flats for work, errands, and everyday wear.', 750, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80', 14),
    ('Shoes & Footwear', 'Men''s Home Slippers', 'Lightweight, low-cost slippers for everyday comfort at home.', 300, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80', 20),
    ('Shoes & Footwear', 'Children''s Play Sandals', 'Easy-to-wear sandals for children at home and outdoors.', 450, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80', 18),
    ('Animal Feed', 'Layer Chicken Feed, 1 kg', 'A handy one-kilo feed portion for small backyard flocks.', 130, 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80', 20),
    ('Animal Feed', 'Small Dog Food Pack, 500 g', 'A small half-kilo food pack for dogs, convenient for a limited budget.', 180, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80', 18),
    ('Farm Produce', 'Fresh Potatoes, 1 kg', 'A one-kilo portion of locally sourced potatoes for family meals.', 100, '/images/catalog/fresh-produce/potatoes.jpg', 24),
    ('Farm Produce', 'Dry Maize, 1 kg', 'A one-kilo portion of locally grown dry maize.', 90, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80', 25),
    ('Kiosk & Shop Goods', 'Single-Serve Drinking Yoghurt', 'A small chilled yoghurt drink for a quick snack on the go.', 50, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80', 20),
    ('Kiosk & Shop Goods', 'Roasted Peanut Snack Pack', 'A small, affordable pack of roasted peanuts for a quick snack.', 30, 'https://images.unsplash.com/photo-1575399872095-9363bf262e64?auto=format&fit=crop&w=900&q=80', 35),
    ('Household Essentials', 'Small Dishwashing Liquid, 250 ml', 'A small bottle of dishwashing liquid for everyday kitchen cleaning.', 100, 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80', 20),
    ('Art & Crafts', 'Handmade Paper Bookmark Pair', 'A pair of handmade paper bookmarks for keeping your place in a book.', 80, '/images/catalog/craft/paper-bookmarks.jpg', 24),
    ('Fashion', 'Women''s Printed Everyday Skirt', 'An easy-to-style skirt modeled by a woman for everyday wear.', 650, '/images/catalog/models/woman-skirt.svg', 16),
    ('Snacks & Drinks', 'Fresh Mandazi, 2 Pieces', 'A small affordable pack of freshly made mandazi for tea time.', 50, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80', 20),
    ('Snacks & Drinks', 'Roasted Maize Snack', 'A simple roasted maize snack for a quick, affordable break.', 40, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80', 22),
    ('Older Adults'' Clothing', 'Men''s Soft Cotton Everyday Shirt', 'A light, easy-care everyday shirt modeled by a man for comfort.', 750, '/images/catalog/models/man-shirt.svg', 14),
    ('Older Adults'' Clothing', 'Men''s Warm Knit Sweater', 'A comfortable warm sweater modeled by a man for cooler mornings.', 900, '/images/catalog/models/man-hoodie.svg', 12),
    ('Phone Accessories', 'Wired Earphones with Microphone', 'Simple wired earphones for calls, music, and online lessons.', 250, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 18)
)
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock)
SELECT seller.id, categories.id, more_catalog.name, more_catalog.description, more_catalog.price,
       more_catalog.image_url, more_catalog.stock
FROM more_catalog
JOIN users AS seller ON seller.email = 'maker@example.test'
JOIN categories ON categories.name = more_catalog.category
WHERE NOT EXISTS (
  SELECT 1 FROM products
  WHERE products.seller_id = seller.id AND products.name = more_catalog.name
);

UPDATE products
SET price = CASE name
  WHEN 'Teen Denim Jeans' THEN 950
  WHEN 'Teen Zip-Up Hoodie' THEN 900
  WHEN 'Teen Casual Dress' THEN 850
  WHEN 'Men''s Everyday Cotton T-Shirt' THEN 650
  WHEN 'Men''s Casual Denim Jeans' THEN 950
  WHEN 'Men''s Long-Sleeve Shirt' THEN 950
  WHEN 'Men''s Zip-Up Hoodie' THEN 950
  WHEN 'Women''s Relaxed Cotton Blouse' THEN 900
  WHEN 'Women''s Everyday Dress' THEN 950
  WHEN 'Women''s Knit Cardigan' THEN 950
  WHEN 'Women''s Casual Trousers' THEN 950
  WHEN 'Men’s Everyday Shoes' THEN 950
  WHEN 'Rainy-Day Gumboots' THEN 950
  WHEN 'Men''s Straight-Leg Trousers' THEN 950
  WHEN 'Women''s Cotton Blouse' THEN 900
  WHEN 'Men''s Button-Down Shirt' THEN 950
  WHEN 'Women''s Lightweight Cardigan' THEN 950
  WHEN 'Men''s Easy-Wear Button-Front Shirt' THEN 850
  WHEN 'Men''s Comfort-Fit Elastic-Waist Trousers' THEN 850
  WHEN 'Women''s Soft Warm Knit Cardigan' THEN 950
  WHEN 'Women''s Lightweight Cotton House Dress' THEN 850
  ELSE price
END
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

UPDATE products
SET image_url = CASE name
  WHEN 'Kids Graphic Cotton T-Shirt' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Kids School Shorts' THEN '/images/catalog/models/child-shorts.svg'
  WHEN 'Kids Fleece Hoodie' THEN '/images/catalog/models/child-hoodie.svg'
  WHEN 'Kids Everyday Dress' THEN '/images/catalog/models/child-dress.svg'
  WHEN 'Kids Warm Pajama Set' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Teen Relaxed-Fit T-Shirt' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Teen Denim Jeans' THEN '/images/catalog/models/child-schoolwear.svg'
  WHEN 'Teen Zip-Up Hoodie' THEN '/images/catalog/models/child-hoodie.svg'
  WHEN 'Teen Casual Dress' THEN '/images/catalog/models/child-dress.svg'
  WHEN 'Teen Track Pants' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Men''s Everyday Polo Shirt' THEN '/images/catalog/models/man-polo.svg'
  WHEN 'Men''s Straight-Leg Trousers' THEN '/images/catalog/models/man-trousers.svg'
  WHEN 'Women''s Cotton Blouse' THEN '/images/catalog/models/woman-blouse.svg'
  WHEN 'Men''s Button-Down Shirt' THEN '/images/catalog/models/man-shirt.svg'
  WHEN 'Women''s Lightweight Cardigan' THEN '/images/catalog/models/woman-cardigan.svg'
  WHEN 'Men''s Everyday Cotton T-Shirt' THEN '/images/catalog/models/man-tee.svg'
  WHEN 'Men''s Casual Denim Jeans' THEN '/images/catalog/models/man-trousers.svg'
  WHEN 'Men''s Long-Sleeve Shirt' THEN '/images/catalog/models/man-shirt.svg'
  WHEN 'Men''s Zip-Up Hoodie' THEN '/images/catalog/models/man-hoodie.svg'
  WHEN 'Women''s Relaxed Cotton Blouse' THEN '/images/catalog/models/woman-blouse.svg'
  WHEN 'Women''s Everyday Dress' THEN '/images/catalog/models/woman-dress.svg'
  WHEN 'Women''s Knit Cardigan' THEN '/images/catalog/models/woman-cardigan.svg'
  WHEN 'Women''s Casual Trousers' THEN '/images/catalog/models/woman-trousers.svg'
  WHEN 'Men''s Easy-Wear Button-Front Shirt' THEN '/images/catalog/models/man-shirt.svg'
  WHEN 'Men''s Comfort-Fit Elastic-Waist Trousers' THEN '/images/catalog/models/man-trousers.svg'
  WHEN 'Women''s Soft Warm Knit Cardigan' THEN '/images/catalog/models/woman-cardigan.svg'
  WHEN 'Women''s Lightweight Cotton House Dress' THEN '/images/catalog/models/woman-dress.svg'
  WHEN 'Children''s School Uniform Shirt' THEN '/images/catalog/models/child-schoolwear.svg'
  WHEN 'Children''s School Uniform Skirt' THEN '/images/catalog/models/child-dress.svg'
  WHEN 'Children''s School Uniform Trousers' THEN '/images/catalog/models/child-schoolwear.svg'
  WHEN 'Kids Everyday Outfit' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Baby Cotton Bodysuit' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Men''s Everyday Cotton Tee' THEN '/images/catalog/models/man-tee.svg'
  WHEN 'Women''s Warm Everyday Scarf' THEN '/images/catalog/models/woman-cardigan.svg'
  WHEN 'Child''s Knit Marvin Beanie' THEN '/images/catalog/models/child-hoodie.svg'
  WHEN 'Men''s Cotton Everyday Vest' THEN '/images/catalog/models/man-polo.svg'
  WHEN 'Men''s Everyday Underwear Pack' THEN '/images/catalog/models/man-trousers.svg'
  WHEN 'Children''s Comfort Cotton Socks' THEN '/images/catalog/models/child-playwear.svg'
  WHEN 'Women''s Warm Everyday Shawl' THEN '/images/catalog/models/woman-shawl.svg'
  WHEN 'Women''s Printed Everyday Skirt' THEN '/images/catalog/models/woman-skirt.svg'
  ELSE image_url
END
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

UPDATE products
SET image_url = '/images/rain-boots.jpg'
WHERE name = 'Rainy-Day Gumboots'
  AND image_url != '/images/rain-boots.jpg';

UPDATE products
SET image_url = '/images/catalog/product-105.jpg'
WHERE name = 'Reusable Food Storage Containers'
  AND seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

UPDATE products
SET image_url = '/images/catalog/product-121.jpg'
WHERE name = 'Reusable School Lunch Box'
  AND seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

  -- Keep clothing titles and catalogue photographs in one-to-one agreement.
  -- These exact descriptions match the locally stored, audience-specific images.
  UPDATE products
  SET name = CASE name
    WHEN 'Child''s Knit Marvin Beanie' THEN 'Child''s Black Knit Beanie'
    WHEN 'Kids Graphic Cotton T-Shirt' THEN 'Kid''s Blue Graphic Cotton T-Shirt'
    WHEN 'Kids School Shorts' THEN 'Kid''s Navy School Shorts'
    WHEN 'Kids Fleece Hoodie' THEN 'Kid''s Green Fleece Hoodie'
    WHEN 'Kids Everyday Dress' THEN 'Kid''s Pink Everyday Dress'
    WHEN 'Kids Warm Pajama Set' THEN 'Kid''s Warm Striped Pajama Set'
    WHEN 'Teen Relaxed-Fit T-Shirt' THEN 'Teen''s Relaxed-Fit Cotton T-Shirt'
    WHEN 'Teen Zip-Up Hoodie' THEN 'Teen''s Black Zip-Up Hoodie'
    WHEN 'Teen Casual Dress' THEN 'Teen''s Floral Casual Dress'
    WHEN 'Teen Track Pants' THEN 'Teen''s Black Track Pants'
    WHEN 'Children''s School Uniform Shirt' THEN 'Children''s White School Shirt'
    WHEN 'Children''s School Uniform Skirt' THEN 'Children''s Pleated School Skirt'
    WHEN 'Children''s School Uniform Trousers' THEN 'Children''s Navy School Trousers'
    WHEN 'Children''s Play T-Shirt' THEN 'Children''s Blue Play T-Shirt'
    WHEN 'Children''s School Cardigan' THEN 'Children''s Navy School Cardigan'
    WHEN 'Children''s Weekend Dress' THEN 'Children''s Floral Weekend Dress'
    WHEN 'Teen Boy''s Everyday T-Shirt' THEN 'Teen Boy''s Blue Everyday T-Shirt'
    WHEN 'Teen Girl''s Everyday Skirt' THEN 'Teen Girl''s Red Casual Skirt'
    WHEN 'Children''s Warm Beanie' THEN 'Children''s Red Knit Beanie'
    WHEN 'Child''s Play T-Shirt and Shorts' THEN 'Child''s Blue T-Shirt and Shorts Set'
    WHEN 'Women''s Warm Everyday Scarf' THEN 'Women''s Long Brown Everyday Scarf'
    WHEN 'Women''s Lightweight Cardigan' THEN 'Women''s Cream Lightweight Cardigan'
    WHEN 'Women''s Knit Cardigan' THEN 'Women''s Soft Pink Knit Cardigan'
    WHEN 'Women''s Casual Trousers' THEN 'Women''s Black Casual Trousers'
    WHEN 'Women''s Soft Warm Knit Cardigan' THEN 'Women''s Soft Beige Warm Cardigan'
    WHEN 'Women''s Warm Everyday Shawl' THEN 'Women''s Burgundy Everyday Shawl'
    WHEN 'Women''s Everyday Scarf' THEN 'Women''s Long Brown Everyday Scarf'
    WHEN 'Women''s Printed Everyday Skirt' THEN 'Women''s Printed Black Everyday Skirt'
    WHEN 'Men''s Warm Knit Sweater' THEN 'Men''s Grey Crew-Neck Knit Sweater'
    WHEN 'Men''s Zip-Up Hoodie' THEN 'Men''s Grey Zip-Up Hoodie'
    ELSE name
  END
  WHERE name IN (
      'Child''s Knit Marvin Beanie', 'Kids Graphic Cotton T-Shirt', 'Kids School Shorts',
      'Kids Fleece Hoodie', 'Kids Everyday Dress', 'Kids Warm Pajama Set',
      'Teen Relaxed-Fit T-Shirt', 'Teen Zip-Up Hoodie', 'Teen Casual Dress',
      'Teen Track Pants', 'Children''s School Uniform Shirt',
      'Children''s School Uniform Skirt', 'Children''s School Uniform Trousers',
      'Children''s Play T-Shirt', 'Children''s School Cardigan',
      'Children''s Weekend Dress', 'Teen Boy''s Everyday T-Shirt',
      'Teen Girl''s Everyday Skirt', 'Children''s Warm Beanie',
      'Child''s Play T-Shirt and Shorts', 'Women''s Warm Everyday Scarf',
      'Women''s Lightweight Cardigan', 'Women''s Knit Cardigan',
      'Women''s Casual Trousers', 'Women''s Soft Warm Knit Cardigan',
      'Women''s Warm Everyday Shawl', 'Women''s Everyday Scarf',
      'Women''s Printed Everyday Skirt', 'Men''s Warm Knit Sweater', 'Men''s Zip-Up Hoodie'
    );

  UPDATE products
  SET image_url = CASE name
    WHEN 'Baby Cotton Bodysuit' THEN '/images/catalog/product-7.jpg'  WHEN 'Baby First-Step Shoes' THEN '/images/catalog/product-19.jpg'
  WHEN 'Kids Everyday Outfit' THEN '/images/catalog/product-9.jpg'
  WHEN 'Men''s Everyday Cotton Tee' THEN '/images/catalog/product-10.jpg'
  WHEN 'Women''s Warm Everyday Scarf' THEN '/images/catalog/photoreal/accessory-scarf.jpg'
  WHEN 'Women''s Long Brown Everyday Scarf' THEN '/images/catalog/photoreal/accessory-scarf.jpg'
  WHEN 'Child''s Knit Marvin Beanie' THEN '/images/catalog/photoreal/accessory-beanie.jpg'
  WHEN 'Child''s Black Knit Beanie' THEN '/images/catalog/photoreal/accessory-beanie.jpg'
  WHEN 'Men''s Cotton Everyday Vest' THEN '/images/catalog/product-13.jpg'
  WHEN 'Men''s Everyday Underwear Pack' THEN '/images/catalog/product-10.jpg'
  WHEN 'Children''s Comfort Cotton Socks' THEN '/images/catalog/product-15.jpg'
  WHEN 'Kids Graphic Cotton T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Kid''s Blue Graphic Cotton T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Kids School Shorts' THEN '/images/catalog/photoreal/child-shorts.jpg'
  WHEN 'Kid''s Navy School Shorts' THEN '/images/catalog/photoreal/child-shorts.jpg'
  WHEN 'Kids Fleece Hoodie' THEN '/images/catalog/photoreal/child-hoodie.jpg'
  WHEN 'Kid''s Green Fleece Hoodie' THEN '/images/catalog/photoreal/child-hoodie.jpg'
  WHEN 'Kids Everyday Dress' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Kid''s Pink Everyday Dress' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Kids Warm Pajama Set' THEN '/images/catalog/photoreal/child-bodysuit.jpg'
  WHEN 'Kid''s Warm Striped Pajama Set' THEN '/images/catalog/photoreal/child-bodysuit.jpg'
  WHEN 'Teen Relaxed-Fit T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Teen''s Relaxed-Fit Cotton T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Teen Denim Jeans' THEN '/images/catalog/photoreal/teen-jeans.jpg'
  WHEN 'Teen Zip-Up Hoodie' THEN '/images/catalog/photoreal/child-hoodie.jpg'
  WHEN 'Teen''s Black Zip-Up Hoodie' THEN '/images/catalog/photoreal/child-hoodie.jpg'
  WHEN 'Teen Casual Dress' THEN '/images/catalog/photoreal/teen-dress.jpg'
  WHEN 'Teen''s Floral Casual Dress' THEN '/images/catalog/photoreal/teen-dress.jpg'
  WHEN 'Teen Track Pants' THEN '/images/catalog/photoreal/teen-pants.jpg'
  WHEN 'Teen''s Black Track Pants' THEN '/images/catalog/photoreal/teen-pants.jpg'
  WHEN 'Men''s Everyday Polo Shirt' THEN '/images/catalog/photoreal/man-polo.jpg'
  WHEN 'Men''s Straight-Leg Trousers' THEN '/images/catalog/photoreal/man-trousers.jpg'
  WHEN 'Women''s Cotton Blouse' THEN '/images/catalog/photoreal/woman-blouse.jpg'
  WHEN 'Women''s Relaxed Cotton Blouse' THEN '/images/catalog/photoreal/woman-blouse.jpg'
  WHEN 'Men''s Button-Down Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Women''s Lightweight Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Cream Lightweight Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Men''s Everyday Cotton T-Shirt' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Men''s Casual Denim Jeans' THEN '/images/catalog/product-50.jpg'
  WHEN 'Men''s Long-Sleeve Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Men''s Zip-Up Hoodie' THEN '/images/catalog/photoreal/man-hoodie.jpg'
  WHEN 'Men''s Grey Zip-Up Hoodie' THEN '/images/catalog/photoreal/man-hoodie.jpg'
  WHEN 'Women''s Relaxed Cotton Blouse' THEN '/images/catalog/product-14.jpg'
  WHEN 'Women''s Everyday Dress' THEN '/images/catalog/photoreal/woman-dress.jpg'
  WHEN 'Women''s Knit Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Soft Pink Knit Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Casual Trousers' THEN '/images/catalog/photoreal/woman-trousers.jpg'
  WHEN 'Women''s Black Casual Trousers' THEN '/images/catalog/photoreal/woman-trousers.jpg'
  WHEN 'Men''s Easy-Wear Button-Front Shirt' THEN '/images/catalog/product-57.jpg'
  WHEN 'Men''s Comfort-Fit Elastic-Waist Trousers' THEN '/images/catalog/product-55.jpg'
  WHEN 'Women''s Soft Warm Knit Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Soft Beige Warm Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Lightweight Cotton House Dress' THEN '/images/catalog/photoreal/woman-dress.jpg'
  WHEN 'Women''s Warm Everyday Shawl' THEN '/images/catalog/photoreal/woman-shawl.jpg'
  WHEN 'Women''s Burgundy Everyday Shawl' THEN '/images/catalog/photoreal/woman-shawl.jpg'
  WHEN 'Children''s School Uniform Shirt' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Children''s White School Shirt' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Children''s School Uniform Skirt' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Children''s Pleated School Skirt' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Children''s School Uniform Trousers' THEN '/images/catalog/photoreal/child-shorts.jpg'
  WHEN 'Children''s Navy School Trousers' THEN '/images/catalog/photoreal/child-shorts.jpg'
  WHEN 'Children''s Play T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Children''s Blue Play T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Children''s School Cardigan' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Children''s Navy School Cardigan' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Children''s Weekend Dress' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Children''s Floral Weekend Dress' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Teen Boy''s Everyday T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Teen Boy''s Blue Everyday T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Teen Girl''s Everyday Skirt' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Teen Girl''s Red Casual Skirt' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Men''s Cotton Vest' THEN '/images/catalog/product-49.jpg'
  WHEN 'Women''s Everyday Scarf' THEN '/images/catalog/photoreal/accessory-scarf.jpg'
  WHEN 'Children''s Warm Beanie' THEN '/images/catalog/photoreal/accessory-beanie.jpg'
  WHEN 'Children''s Red Knit Beanie' THEN '/images/catalog/photoreal/accessory-beanie.jpg'
  WHEN 'Men''s Everyday Socks, 2 Pairs' THEN '/images/catalog/product-15.jpg'
  WHEN 'Child''s Play T-Shirt and Shorts' THEN '/images/catalog/photoreal/child-play.jpg'
  WHEN 'Child''s Blue T-Shirt and Shorts Set' THEN '/images/catalog/photoreal/child-play.jpg'
  WHEN 'Child''s School Outfit' THEN '/images/catalog/product-9.jpg'
  WHEN 'Baby Soft Cotton Sleep Suit' THEN '/images/catalog/product-7.jpg'
  WHEN 'Men''s Casual Cotton Shirt' THEN '/images/catalog/product-57.jpg'
  WHEN 'Women''s Easy-Wear Blouse' THEN '/images/catalog/photoreal/woman-blouse.jpg'
  WHEN 'Men''s Everyday Trousers' THEN '/images/catalog/photoreal/man-trousers.jpg'
  WHEN 'Women''s Everyday Cotton Dress' THEN '/images/catalog/photoreal/woman-dress.jpg'
  WHEN 'Women''s Printed Everyday Skirt' THEN '/images/catalog/photoreal/woman-skirt.jpg'
  WHEN 'Women''s Printed Black Everyday Skirt' THEN '/images/catalog/photoreal/woman-skirt.jpg'
  WHEN 'Men''s Soft Cotton Everyday Shirt' THEN '/images/catalog/product-59.jpg'
  WHEN 'Men''s Warm Knit Sweater' THEN '/images/catalog/photoreal/man-sweater.jpg'
  WHEN 'Men''s Grey Crew-Neck Knit Sweater' THEN '/images/catalog/photoreal/man-sweater.jpg'
  WHEN 'Children''s School Shoes' THEN '/images/catalog/product-21.jpg'
  WHEN 'Children''s Play Sandals' THEN '/images/catalog/product-16.jpg'
  WHEN 'Women''s Everyday Sandals' THEN '/images/catalog/product-16.jpg'
  WHEN 'Men''s Home Slippers' THEN '/images/catalog/product-19.jpg'
  ELSE image_url
END
WHERE name IN (
    'Baby Cotton Bodysuit', 'Baby First-Step Shoes', 'Kids Everyday Outfit',
    'Men''s Everyday Cotton Tee', 'Women''s Warm Everyday Scarf',
    'Child''s Knit Marvin Beanie', 'Men''s Cotton Everyday Vest',
    'Men''s Everyday Underwear Pack', 'Children''s Comfort Cotton Socks',
    'Kids Graphic Cotton T-Shirt', 'Kids School Shorts', 'Kids Fleece Hoodie',
    'Kids Everyday Dress', 'Kids Warm Pajama Set', 'Teen Relaxed-Fit T-Shirt',
    'Teen Denim Jeans', 'Teen Zip-Up Hoodie', 'Teen Casual Dress', 'Teen Track Pants',
    'Men''s Everyday Polo Shirt', 'Men''s Straight-Leg Trousers', 'Women''s Cotton Blouse',
    'Men''s Button-Down Shirt', 'Women''s Lightweight Cardigan',
    'Men''s Everyday Cotton T-Shirt', 'Men''s Casual Denim Jeans',
    'Men''s Long-Sleeve Shirt', 'Men''s Zip-Up Hoodie', 'Women''s Relaxed Cotton Blouse',
    'Women''s Everyday Dress', 'Women''s Knit Cardigan', 'Women''s Casual Trousers',
    'Men''s Easy-Wear Button-Front Shirt', 'Men''s Comfort-Fit Elastic-Waist Trousers',
    'Women''s Soft Warm Knit Cardigan', 'Women''s Lightweight Cotton House Dress',
    'Women''s Warm Everyday Shawl', 'Children''s School Uniform Shirt',
    'Children''s School Uniform Skirt', 'Children''s School Uniform Trousers',
    'Children''s Play T-Shirt', 'Children''s School Cardigan', 'Children''s Weekend Dress',
    'Teen Boy''s Everyday T-Shirt', 'Teen Girl''s Everyday Skirt', 'Men''s Cotton Vest',
    'Women''s Everyday Scarf', 'Children''s Warm Beanie', 'Men''s Everyday Socks, 2 Pairs',
    'Child''s Play T-Shirt and Shorts', 'Child''s School Outfit', 'Baby Soft Cotton Sleep Suit',
    'Men''s Casual Cotton Shirt', 'Women''s Easy-Wear Blouse', 'Men''s Everyday Trousers',
    'Women''s Everyday Cotton Dress', 'Women''s Printed Everyday Skirt',
    'Men''s Soft Cotton Everyday Shirt',     'Men''s Warm Knit Sweater', 'Men''s Grey Crew-Neck Knit Sweater',
    'Men''s Zip-Up Hoodie', 'Men''s Grey Zip-Up Hoodie',
    'Women''s Warm Everyday Scarf', 'Women''s Long Brown Everyday Scarf',
    'Women''s Lightweight Cardigan', 'Women''s Cream Lightweight Cardigan',
    'Women''s Knit Cardigan', 'Women''s Soft Pink Knit Cardigan',
    'Women''s Casual Trousers', 'Women''s Black Casual Trousers',
    'Women''s Soft Warm Knit Cardigan', 'Women''s Soft Beige Warm Cardigan',
    'Women''s Warm Everyday Shawl', 'Women''s Burgundy Everyday Shawl',
    'Women''s Printed Everyday Skirt', 'Women''s Printed Black Everyday Skirt',
    'Child''s Knit Marvin Beanie', 'Child''s Black Knit Beanie',
    'Kids Graphic Cotton T-Shirt', 'Kid''s Blue Graphic Cotton T-Shirt',
    'Kids School Shorts', 'Kid''s Navy School Shorts',
    'Kids Fleece Hoodie', 'Kid''s Green Fleece Hoodie',
    'Kids Everyday Dress', 'Kid''s Pink Everyday Dress',
    'Kids Warm Pajama Set', 'Kid''s Warm Striped Pajama Set',
    'Teen Relaxed-Fit T-Shirt', 'Teen''s Relaxed-Fit Cotton T-Shirt',
    'Teen Zip-Up Hoodie', 'Teen''s Black Zip-Up Hoodie',
    'Teen Casual Dress', 'Teen''s Floral Casual Dress',
    'Teen Track Pants', 'Teen''s Black Track Pants',
    'Children''s School Uniform Shirt', 'Children''s White School Shirt',
    'Children''s School Uniform Skirt', 'Children''s Pleated School Skirt',
    'Children''s School Uniform Trousers', 'Children''s Navy School Trousers',
    'Children''s Play T-Shirt', 'Children''s Blue Play T-Shirt',
    'Children''s School Cardigan', 'Children''s Navy School Cardigan',
    'Children''s Weekend Dress', 'Children''s Floral Weekend Dress',
    'Teen Boy''s Everyday T-Shirt', 'Teen Boy''s Blue Everyday T-Shirt',
    'Teen Girl''s Everyday Skirt', 'Teen Girl''s Red Casual Skirt',
    'Children''s Warm Beanie', 'Children''s Red Knit Beanie',
    'Child''s Play T-Shirt and Shorts', 'Child''s Blue T-Shirt and Shorts Set',
    'Children''s School Shoes', 'Children''s Play Sandals',    'Women''s Everyday Sandals', 'Men''s Home Slippers'
  );

-- Expanded innerwear catalogue. Explicit audience names keep these clothes
-- separate while productGroups exposes all of them under Other clothing.
WITH innerwear_catalog(name, description, price, image_url, stock) AS (
  VALUES
    ('Men''s Cotton Boxer Briefs', 'Soft cotton boxer briefs with a comfortable everyday waist.', 450, '/images/catalog/innerwear/mens-innerwear.jpg', 30),
    ('Men''s Ribbed Cotton Vest Pack', 'Breathable ribbed cotton vest pack for daily wear.', 500, '/images/catalog/innerwear/mens-innerwear.jpg', 24),
    ('Men''s Classic Briefs Pack', 'Three soft everyday briefs with a secure, supportive fit.', 550, '/images/catalog/innerwear/boxers.jpg', 26),
    ('Women''s Cotton Bra', 'A comfortable, everyday cotton bra with adjustable straps.', 650, '/images/catalog/innerwear/womens-innerwear.jpg', 22),
    ('Women''s Soft Cotton Briefs Pack', 'Smooth cotton briefs in a practical everyday multipack.', 520, '/images/catalog/innerwear/womens-innerwear.jpg', 28),
    ('Women''s Everyday Camisole Vest', 'Lightweight innerwear camisole for comfortable layering.', 480, '/images/catalog/innerwear/teen-girls-innerwear.jpg', 20),
    ('Teen Boys Cotton Boxer Briefs', 'Comfortable boys'' boxer briefs in teen waist sizes.', 400, '/images/catalog/innerwear/teen-boys-innerwear.jpg', 25),
    ('Teen Boys Innerwear Vest Pack', 'Soft innerwear vest pack for school and daily wear.', 380, '/images/catalog/innerwear/teen-boys-innerwear.jpg', 27),
    ('Teen Boys Cotton Briefs Pack', 'Easy-care cotton briefs sized for teenage boys.', 420, '/images/catalog/innerwear/boxers.jpg', 24),
    ('Teen Girls Cotton Briefs Pack', 'Soft, breathable everyday briefs for teenage girls.', 390, '/images/catalog/innerwear/womens-innerwear.jpg', 26),
    ('Teen Girls Innerwear Camisole', 'Comfortable teenage camisole for light layering.', 430, '/images/catalog/innerwear/teen-girls-innerwear.jpg', 22),
    ('Teen Girls Soft Cotton Bra', 'Supportive light cotton bra in teen sizing.', 480, '/images/catalog/innerwear/womens-innerwear.jpg', 18),
    ('Baby Cotton Bodysuit, 2 Pack', 'A soft two-pack of easy-change baby bodysuits.', 650, '/images/catalog/innerwear/baby-bodysuit.jpg', 24),
    ('Baby Infant Vest, 3 Pack', 'Three soft infant vest sets for gentle everyday wear.', 580, '/images/catalog/innerwear/baby-infant-bodysuit.jpg', 25),
    ('Newborn Soft Cotton Sleeveless Vest', 'Gentle cotton innerwear vest for newborn comfort.', 350, '/images/catalog/innerwear/baby-infant-bodysuit.jpg', 20)
)
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock)
SELECT seller.id, category.id, innerwear.name, innerwear.description,
       innerwear.price, innerwear.image_url, innerwear.stock
FROM innerwear_catalog AS innerwear
JOIN users AS seller ON seller.email = 'maker@example.test'
JOIN categories AS category ON category.name = 'Clothing & Accessories'
WHERE NOT EXISTS (
  SELECT 1 FROM products
  WHERE products.seller_id = seller.id AND products.name = innerwear.name
);

-- Audience-specific casual footwear and slides. Names describe only what the
-- photograph shows, while the low, separate prices suit neighborhood budgets.
UPDATE products
SET image_url = CASE name
  WHEN 'Ladies Flat Shoes' THEN 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men’s Everyday Shoes' THEN 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Everyday Casual Slides' THEN 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Black Casual Trainers' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85'
  WHEN 'Men''s Grey Casual Sneakers' THEN 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Everyday Casual Slides' THEN 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Everyday Casual Sneakers' THEN 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=85'
  WHEN 'Women''s Light Casual Trainers' THEN 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85'
  WHEN 'Teenage Boys'' Everyday Casual Slides' THEN 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85'
  WHEN 'Teenage Boys'' Everyday Casual Trainers' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85'
  WHEN 'Teenage Boys'' Casual Sneakers' THEN 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85'
  WHEN 'Teenage Girls'' Everyday Casual Slides' THEN 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85'
  WHEN 'Teenage Girls'' Casual Trainers' THEN 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=85'
  WHEN 'Teenage Girls'' Casual Sneakers' THEN 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85'
  WHEN 'Infant Soft Casual Shoes' THEN 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=85'
  WHEN 'Infant Light Casual Sandals' THEN 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85'
  WHEN 'Infant Everyday Casual Slides' THEN 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=900&q=85'
  WHEN 'Children''s Everyday Casual Slides' THEN 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85'
  ELSE image_url
END
WHERE name IN (
  'Ladies Flat Shoes', 'Men’s Everyday Shoes', 'Men''s Everyday Casual Slides',
  'Men''s Black Casual Trainers', 'Men''s Grey Casual Sneakers', 'Women''s Everyday Casual Slides',
  'Women''s Everyday Casual Sneakers', 'Women''s Light Casual Trainers',
  'Teenage Boys'' Everyday Casual Slides', 'Teenage Boys'' Everyday Casual Trainers',
  'Teenage Boys'' Casual Sneakers', 'Teenage Girls'' Everyday Casual Slides',
  'Teenage Girls'' Casual Trainers', 'Teenage Girls'' Casual Sneakers',
  'Infant Soft Casual Shoes', 'Infant Light Casual Sandals', 'Infant Everyday Casual Slides',
  'Children''s Everyday Casual Slides'
);

WITH footwear_catalog(name, description, price, image_url, stock) AS (
  VALUES
    ('Men''s Everyday Casual Slides', 'Affordable open casual slides for errands and relaxed daily wear.', 250, '/images/catalog/footwear/slide-6.jpg', 30),
    ('Men''s Black Casual Trainers', 'Affordable low-cut casual trainers for walking and everyday wear.', 850, '/images/catalog/footwear/slide-1.jpg', 18),
    ('Men''s Grey Casual Sneakers', 'Versatile everyday sneakers with a comfortable lightweight upper.', 950, '/images/catalog/footwear/slide-4.jpg', 16),
    ('Women''s Everyday Casual Slides', 'Comfortable open casual slides for market trips and relaxed wear.', 280, '/images/catalog/footwear/slide-6.jpg', 28),
    ('Women''s Everyday Casual Sneakers', 'Light everyday sneakers suitable for walking and errands.', 900, '/images/catalog/footwear/slide-3.jpg', 18),
    ('Women''s Light Casual Trainers', 'Affordable casual trainers with a clean everyday style.', 850, '/images/catalog/footwear/slide-5.jpg', 17),
    ('Teenage Boys'' Everyday Casual Slides', 'Easy-on casual slides sized for teenage boys.', 220, '/images/catalog/footwear/slide-6.jpg', 24),
    ('Teenage Boys'' Everyday Casual Trainers', 'Low-cut casual trainers for school, play, and daily wear.', 700, '/images/catalog/footwear/slide-2.jpg', 20),
    ('Teenage Boys'' Casual Sneakers', 'Comfortable everyday sneakers with a durable rubber sole.', 750, '/images/catalog/footwear/slide-1.jpg', 19),
    ('Teenage Girls'' Everyday Casual Slides', 'Comfortable open casual slides for teenage everyday wear.', 220, '/images/catalog/footwear/slide-6.jpg', 24),
    ('Teenage Girls'' Casual Trainers', 'Affordable lightweight trainers for walking and casual activities.', 700, '/images/catalog/footwear/slide-3.jpg', 20),
    ('Teenage Girls'' Casual Sneakers', 'Everyday casual sneakers with a flexible, comfortable sole.', 750, '/images/catalog/footwear/slide-5.jpg', 18),
    ('Infant Soft Casual Shoes', 'Soft-soled casual shoes for gentle indoor and outdoor wear.', 350, '/images/catalog/child-boys-school-shoes.jpg', 20),
    ('Infant Light Casual Sandals', 'Light infant sandals with an easy-close strap.', 300, '/images/catalog/child-girls-school-shoes.jpg', 20),
    ('Infant Everyday Casual Slides', 'Soft, easy-on casual slides for infants.', 180, '/images/catalog/footwear/slide-6.jpg', 20),
    ('Children''s Everyday Casual Slides', 'Easy-on casual slides for children''s everyday play.', 200, '/images/catalog/footwear/slide-6.jpg', 26)
)
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock)
SELECT seller.id, category.id, footwear.name, footwear.description,
       footwear.price, footwear.image_url, footwear.stock
FROM footwear_catalog AS footwear
JOIN users AS seller ON seller.email = 'maker@example.test'
JOIN categories AS category ON category.name = 'Shoes & Footwear'
WHERE NOT EXISTS (
  SELECT 1 FROM products
  WHERE products.seller_id = seller.id AND products.name = footwear.name
);

UPDATE products
SET seller_id = 2 + (id % 6)
WHERE category_id IN (2, 5, 6, 7, 12, 13, 14, 15);

UPDATE products
SET price = CASE
  WHEN name LIKE '%Slides' THEN 200 + (ABS(id) % 101)
  WHEN name LIKE '%Sandals' OR name LIKE '%Slippers' THEN 250 + (ABS(id) % 151)
  WHEN name LIKE '%Sneakers' OR name LIKE '%Trainers' THEN 650 + (ABS(id) % 351)
  ELSE price
END
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND (name LIKE '%Slides' OR name LIKE '%Sandals' OR name LIKE '%Slippers'
       OR name LIKE '%Sneakers' OR name LIKE '%Trainers');

UPDATE products
SET name = 'Ariel 3-in-1 Laundry Detergent Pods',
    description = 'A 1 kg box of Ariel automatic laundry detergent for everyday machine washing.'
WHERE name = 'Laundry Detergent, 1 kg'
  AND seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

UPDATE products
SET name = 'Lemon Dishwashing Liquid, 250 ml',
    description = 'A small 250 ml bottle of Sunlight lemon dishwashing liquid for daily kitchen cleaning.'
WHERE name = 'Small Dishwashing Liquid, 250 ml'
  AND seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

UPDATE products
SET name = 'Lemon Dishwashing Liquid, 500 ml',
    description = 'A 500 ml bottle of Sunlight lemon dishwashing liquid for kitchen pots and dishes.'
WHERE name = 'Dishwashing Liquid, 500 ml'
  AND seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock)
SELECT seller.id, category.id,
       'Lemon Dishwashing Liquid, 500 ml',
       'A 500 ml bottle of lemon dishwashing liquid for kitchen pots and dishes.',
       220, '/images/catalog/sunlight-dishwashing-500ml.svg', 18
FROM users AS seller
JOIN categories AS category ON category.name = 'Personal Care & Cleaning'
WHERE seller.email = 'maker@example.test'
  AND NOT EXISTS (
    SELECT 1 FROM products
    WHERE seller_id = seller.id
      AND name = 'Lemon Dishwashing Liquid, 500 ml'
  );

UPDATE products
SET category_id = (SELECT id FROM categories WHERE name = 'Household Essentials')
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND name IN (
    'Ariel 3-in-1 Laundry Detergent Pods',
    'OMO Automatic Laundry Powder Packs',
    'Lemon Dishwashing Liquid, 250 ml',
    'Lemon Dishwashing Liquid, 500 ml'
  );

DELETE FROM products
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND name IN (
    'OMO Automatic Laundry Powder Packs',
    'Ariel 3-in-1 Laundry Detergent Pods',
    'Lemon Dishwashing Liquid, 250 ml',
    'Lemon Dishwashing Liquid, 500 ml'
  )
  AND id NOT IN (
    SELECT MIN(id) FROM products
    WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
      AND name IN (
        'OMO Automatic Laundry Powder Packs',
        'Ariel 3-in-1 Laundry Detergent Pods',
        'Lemon Dishwashing Liquid, 250 ml',
        'Lemon Dishwashing Liquid, 500 ml'
      )
    GROUP BY name
  );

UPDATE products
SET image_url = CASE name
  WHEN 'Ariel 3-in-1 Laundry Detergent Pods' THEN '/images/catalog/photoreal/ariel.jpg'
  WHEN 'OMO Automatic Laundry Powder Packs' THEN '/images/catalog/photoreal/omo.jpg'
  WHEN 'Lemon Dishwashing Liquid, 250 ml' THEN '/images/catalog/photoreal/dishwashing.jpg'
  WHEN 'Lemon Dishwashing Liquid, 500 ml' THEN '/images/catalog/photoreal/dishwashing.jpg'
  WHEN 'Toilet Tissue, 4 Rolls' THEN '/images/catalog/photoreal/tissue.jpg'
  WHEN 'Plastic Water Basin' THEN '/images/catalog/photoreal/basin.jpg'
  WHEN 'Everyday Cooking Utensil Set' THEN '/images/catalog/photoreal/utensils.jpg'
  WHEN 'Kids Graphic Cotton T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Kids School Shorts' THEN '/images/catalog/photoreal/child-shorts.jpg'
  WHEN 'Children''s School Uniform Shirt' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Children''s School Uniform Skirt' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Children''s School Uniform Trousers' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Kids Fleece Hoodie' THEN '/images/catalog/photoreal/child-hoodie.jpg'
  WHEN 'Kids Everyday Dress' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Kids Warm Pajama Set' THEN '/images/catalog/photoreal/child-bodysuit.jpg'
  WHEN 'Teen Relaxed-Fit T-Shirt' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Teen Denim Jeans' THEN '/images/catalog/photoreal/teen-jeans.jpg'
  WHEN 'Teen Zip-Up Hoodie' THEN '/images/catalog/photoreal/man-hoodie.jpg'
  WHEN 'Teen Casual Dress' THEN '/images/catalog/photoreal/teen-dress.jpg'
  WHEN 'Teen Track Pants' THEN '/images/catalog/photoreal/teen-pants.jpg'
  WHEN 'Men''s Everyday Polo Shirt' THEN '/images/catalog/photoreal/man-polo.jpg'
  WHEN 'Men''s Straight-Leg Trousers' THEN '/images/catalog/photoreal/man-trousers.jpg'
  WHEN 'Women''s Cotton Blouse' THEN '/images/catalog/photoreal/woman-blouse.jpg'
  WHEN 'Men''s Button-Down Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Women''s Lightweight Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Men''s Everyday Cotton T-Shirt' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Men''s Casual Denim Jeans' THEN '/images/catalog/photoreal/man-trousers.jpg'
  WHEN 'Men''s Long-Sleeve Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Men''s Zip-Up Hoodie' THEN '/images/catalog/photoreal/man-hoodie.jpg'
  WHEN 'Women''s Relaxed Cotton Blouse' THEN '/images/catalog/photoreal/woman-blouse.jpg'
  WHEN 'Women''s Everyday Dress' THEN '/images/catalog/photoreal/woman-dress.jpg'
  WHEN 'Women''s Knit Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Casual Trousers' THEN '/images/catalog/photoreal/woman-trousers.jpg'
  WHEN 'Men''s Easy-Wear Button-Front Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Men''s Comfort-Fit Elastic-Waist Trousers' THEN '/images/catalog/photoreal/man-trousers.jpg'
  WHEN 'Women''s Soft Warm Knit Cardigan' THEN '/images/catalog/photoreal/woman-cardigan.jpg'
  WHEN 'Women''s Lightweight Cotton House Dress' THEN '/images/catalog/photoreal/woman-dress.jpg'
  WHEN 'Women''s Warm Everyday Shawl' THEN '/images/catalog/photoreal/woman-shawl.jpg'
  WHEN 'Men''s Everyday Cotton Tee' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Women''s Warm Everyday Scarf' THEN '/images/catalog/photoreal/accessory-scarf.jpg'
  WHEN 'Child''s Knit Marvin Beanie' THEN '/images/catalog/photoreal/accessory-beanie.jpg'
  WHEN 'Men''s Cotton Everyday Vest' THEN '/images/catalog/photoreal/man-polo.jpg'
  WHEN 'Children''s Comfort Cotton Socks' THEN '/images/catalog/photoreal/accessory-socks.jpg'
  WHEN 'Children''s Play T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Children''s School Cardigan' THEN '/images/catalog/photoreal/child-hoodie.jpg'
  WHEN 'Children''s Weekend Dress' THEN '/images/catalog/photoreal/child-dress.jpg'
  WHEN 'Teen Boy''s Everyday T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Teen Girl''s Everyday Skirt' THEN '/images/catalog/photoreal/woman-skirt.jpg'
  WHEN 'Men''s Cotton Vest' THEN '/images/catalog/photoreal/man-polo.jpg'
  WHEN 'Women''s Everyday Scarf' THEN '/images/catalog/photoreal/accessory-scarf.jpg'
  WHEN 'Children''s Warm Beanie' THEN '/images/catalog/photoreal/accessory-beanie.jpg'
  WHEN 'Men''s Everyday Socks, 2 Pairs' THEN '/images/catalog/photoreal/accessory-socks.jpg'
  WHEN 'Men''s Cotton Undershirt, 2 Pack' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Teen Boys'' Cotton Undershirts, 2 Pack' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Men''s Soft Cotton Everyday Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Men''s Warm Knit Sweater' THEN '/images/catalog/photoreal/man-sweater.jpg'
  WHEN 'Children''s School Shoes' THEN '/images/catalog/child-boys-school-shoes.jpg'
  WHEN 'Children''s Play Sandals' THEN '/images/catalog/child-girls-school-shoes.jpg'
  WHEN 'Ariel 3-in-1 Laundry Detergent Pods' THEN '/images/catalog/photoreal/ariel.jpg'
  WHEN 'OMO Automatic Laundry Powder Packs' THEN '/images/catalog/photoreal/omo.jpg'
  WHEN 'Lemon Dishwashing Liquid, 250 ml' THEN '/images/catalog/photoreal/dishwashing.jpg'
  WHEN 'Lemon Dishwashing Liquid, 500 ml' THEN '/images/catalog/photoreal/dishwashing.jpg'
  ELSE image_url
END
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

-- Final exact-catalogue rebuild: one display item per photograph. This intentionally
-- removes accidental seed reruns and every legacy clothing photograph that could
-- advertise a different garment. The resulting cards have exact name/photo agreement.
UPDATE users SET portrait_url = NULL WHERE is_demo_profile = 1;

UPDATE products
SET moderation_status = 'rejected'
WHERE seller_id IN (
  SELECT id FROM users
  WHERE is_demo_profile = 1 AND email <> 'maker@example.test'
)
AND category_id IN (
  SELECT id FROM categories
  WHERE name IN ('Fashion', 'Clothing & Accessories', 'Kids'' Clothing', 'Teen Clothing',
                 'Adult Clothing', 'Older Adults'' Clothing', 'Baby & Kids', 'Shoes & Footwear')
);

DELETE FROM products
WHERE category_id IN (
  SELECT id FROM categories
  WHERE name IN ('Fashion', 'Clothing & Accessories', 'Kids'' Clothing', 'Teen Clothing',
                 'Adult Clothing', 'Older Adults'' Clothing', 'Baby & Kids', 'Shoes & Footwear')
)
AND seller_id = (SELECT id FROM users WHERE email = 'maker@example.test');

WITH exact_catalog(category, name, description, price, image_url, stock) AS (
  VALUES
    ('Adult Clothing', 'Men''s Grey Crew-Neck Knit Sweater', 'A man wearing a light grey crew-neck sweater.', 900, '/images/catalog/photoreal/man-sweater.jpg', 12),
    ('Adult Clothing', 'Men''s Grey Zip-Up Hoodie', 'A grey hooded sweatshirt shown from the back.', 850, '/images/catalog/photoreal/man-hoodie.jpg', 15),
    ('Adult Clothing', 'Men''s Everyday Blue Polo Shirt', 'A man wearing a navy blue polo shirt.', 650, '/images/catalog/photoreal/man-polo.jpg', 18),
    ('Adult Clothing', 'Men''s White Dress Shirt with Dark Tie', 'A white formal dress shirt worn with a dark patterned tie.', 700, '/images/catalog/photoreal/man-shirt.jpg', 16),
    ('Adult Clothing', 'Men''s Blue Patterned Button-Down Shirt', 'A blue button-down shirt with a small white pattern.', 650, '/images/catalog/photoreal/man-button-down-shirt.jpg', 18),
    ('Adult Clothing', 'Men''s White Cotton T-Shirt', 'A white crew-neck cotton T-shirt shown clearly in the product photograph.', 450, '/images/catalog/photoreal/man-tee.jpg', 24),
    ('Adult Clothing', 'Men''s Beige Straight-Leg Trousers', 'A pair of beige straight-leg trousers shown clearly in the product photograph.', 750, '/images/catalog/photoreal/man-trousers.jpg', 14),
    ('Adult Clothing', 'Men''s Blue and Black Denim Jeans', 'A flat lay of blue, indigo, and black denim jeans.', 800, '/images/catalog/product-50.jpg', 13),
    ('Adult Clothing', 'Women''s Green Blouse and Dark Trousers', 'A woman wearing a lime green blouse with dark trousers.', 650, '/images/catalog/photoreal/woman-blouse.jpg', 16),
    ('Adult Clothing', 'Women''s Cream Knit Cardigan', 'A woman wearing a cream knitted cardigan.', 700, '/images/catalog/photoreal/woman-cardigan.jpg', 14),
    ('Adult Clothing', 'Women''s Light Blue Dress', 'A woman wearing a light blue dress.', 850, '/images/catalog/photoreal/woman-dress.jpg', 12),
    ('Adult Clothing', 'Women''s Pale Pink Pleated Midi Skirt', 'A pale pink pleated midi skirt shown on a model.', 650, '/images/catalog/photoreal/woman-skirt.jpg', 13),
    ('Adult Clothing', 'Women''s Brown Casual Trousers', 'A woman wearing brown casual trousers.', 750, '/images/catalog/photoreal/woman-trousers.jpg', 14),
    ('Kids'' Clothing', 'Baby Taupe Fleece Hooded Onesie', 'A baby wearing a taupe fleece hooded one-piece outfit.', 650, '/images/catalog/photoreal/child-bodysuit.jpg', 18),
    ('Kids'' Clothing', 'Boy''s Green and Blue Striped Shirt', 'A boy wearing a green and blue striped shirt.', 650, '/images/catalog/photoreal/child-hoodie.jpg', 16),
    ('Kids'' Clothing', 'Boy''s Green Graphic T-Shirt', 'A boy wearing a green graphic T-shirt.', 400, '/images/catalog/photoreal/child-tshirt.jpg', 22),
    ('Kids'' Clothing', 'Girl''s Pink Everyday Dress', 'A girl wearing a pink dress outdoors.', 700, '/images/catalog/photoreal/child-dress.jpg', 16),
    ('Kids'' Clothing', 'Children''s Blue Beach Shorts', 'Children wearing blue shorts at the beach.', 450, '/images/catalog/photoreal/child-shorts.jpg', 14),
    ('Kids'' Clothing', 'Children''s Blue School Uniform', 'A child wearing a blue school uniform.', 650, '/images/catalog/photoreal/child-school.jpg', 14),
    ('Adult Clothing', 'Women''s Sleeveless Floral-Print Dress', 'A woman wearing a sleeveless floral-print dress outdoors.', 850, '/images/catalog/photoreal/teen-dress.jpg', 12),
    ('Adult Clothing', 'Black Cargo Jogger Trousers', 'A model wearing black cargo jogger trousers.', 650, '/images/catalog/photoreal/teen-pants.jpg', 16),
    ('Clothing & Accessories', 'Knit Beanie Hats', 'A selection of knitted beanie hats in brown, pink, and yellow.', 350, '/images/catalog/photoreal/accessory-beanie.jpg', 20),
    ('Clothing & Accessories', 'Dark Plaid Scarf', 'A dark plaid scarf worn around the neck.', 400, '/images/catalog/photoreal/accessory-scarf.jpg', 18),
    ('Clothing & Accessories', 'Plain White Crew Socks', 'A pair of plain white crew socks.', 300, '/images/catalog/photoreal/accessory-socks.jpg', 22),
    ('Clothing & Accessories', 'Black Glass Perfume Bottle', 'A black perfume bottle photographed with red flowers.', 850, '/images/catalog/accessories/perfume.jpg', 8),
    ('Clothing & Accessories', 'Dark Glass Perfume Bottle with Silver Cap', 'A dark glass perfume bottle with a light cap shown in a monochrome product photograph.', 750, '/images/catalog/accessories/perfume-clear-bottle.jpg', 10),
    ('Clothing & Accessories', 'Gold Twisted Hoop Earrings', 'A pair of gold twisted hoop earrings.', 450, '/images/catalog/accessories/earrings.jpg', 12),
    ('Clothing & Accessories', 'Ornate Gold and Rhinestone Bracelet', 'An ornate gold-tone bracelet decorated with clear rhinestones.', 600, '/images/catalog/accessories/bracelet.jpg', 10),
    ('Clothing & Accessories', 'Halo-Style Fancy Ring', 'A halo-style ring with a central stone and a sparkling stone-set band.', 700, '/images/catalog/accessories/ring.jpg', 8),
    ('Clothing & Accessories', 'Decorative Silver Anklet', 'A decorative silver-tone anklet shown worn around the ankle.', 500, '/images/catalog/accessories/anklet.jpg', 10),
    ('Clothing & Accessories', 'Layered Gold Pendant Necklaces', 'Layered gold-tone chain necklaces with pendant details.', 800, '/images/catalog/accessories/necklace.jpg', 9),
    ('Shoes & Footwear', 'Men''s Red Knit Athletic Sneakers', 'Red knit athletic sneakers with white soles.', 950, '/images/catalog/footwear/slide-1.jpg', 10),
    ('Shoes & Footwear', 'Men''s Tan Low-Top Lace-Up Sneakers', 'A tan low-top lace-up sneaker with a white sole.', 950, '/images/catalog/footwear/slide-2.jpg', 10),
    ('Shoes & Footwear', 'Women''s Multicolour Fashion Trainers', 'Multicolour fashion trainers shown clearly in the product photograph.', 950, '/images/catalog/footwear/slide-3.jpg', 9),
    ('Shoes & Footwear', 'Women''s White and Orange Running Sneakers', 'White and orange running sneakers shown clearly in the product photograph.', 950, '/images/catalog/footwear/slide-4.jpg', 9),
    ('Shoes & Footwear', 'Men''s Brown Lace-Up Ankle Boots', 'Brown lace-up ankle boots shown clearly in the product photograph.', 950, '/images/catalog/footwear/slide-5.jpg', 8),
    ('Shoes & Footwear', 'Women''s Taupe Buckle Sandals', 'Taupe twin-buckle sandals shown clearly in the product photograph.', 950, '/images/catalog/footwear/slide-6.jpg', 12),
    ('Shoes & Footwear', 'Girls'' Red Floral Mary Jane Shoes', 'Red Mary Jane shoes decorated with small flowers.', 750, '/images/catalog/children-shoes/kids-cotton-shoes.jpg', 14),
    ('Shoes & Footwear', 'Boys'' White and Lime Velcro Sneakers', 'White children''s sneakers with lime accents and a hook-and-loop strap.', 800, '/images/catalog/children-shoes/kids-sneakers.jpg', 14),
    ('Shoes & Footwear', 'Boys'' Black Lace-Up Dress Shoes', 'A pair of black lace-up dress shoes.', 850, '/images/catalog/child-boys-school-shoes.jpg', 10),
    ('Shoes & Footwear', 'Girls'' Black Bow Mary Jane Shoes', 'Black Mary Jane shoes with bows.', 850, '/images/catalog/child-girls-school-shoes.jpg', 10)
)
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock, moderation_status)
SELECT seller.id, category.id, exact_catalog.name, exact_catalog.description,
       exact_catalog.price, exact_catalog.image_url, exact_catalog.stock, 'approved'
FROM exact_catalog
JOIN users AS seller ON seller.email = 'maker@example.test'
JOIN categories AS category ON category.name = exact_catalog.category;

-- SQLite left these apostrophe-containing category values out of the CTE join above.
-- Add those exact rows explicitly so every photograph has its matching card.
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock, moderation_status)
SELECT seller.id, category.id, exact_item.name, exact_item.description,
       exact_item.price, exact_item.image_url, exact_item.stock, 'approved'
FROM (
      SELECT 'Kids'' Clothing' AS category, 'Baby Taupe Fleece Hooded Onesie' AS name,
        'A baby wearing a taupe fleece hooded one-piece outfit.' AS description,
        650 AS price, '/images/catalog/photoreal/child-bodysuit.jpg' AS image_url, 18 AS stock
  UNION ALL SELECT 'Kids'' Clothing', 'Boy''s Green and Blue Striped Shirt', 'A boy wearing a green and blue striped shirt.', 650, '/images/catalog/photoreal/child-hoodie.jpg', 16
  UNION ALL SELECT 'Kids'' Clothing', 'Boy''s Green Graphic T-Shirt', 'A boy wearing a green graphic T-shirt.', 400, '/images/catalog/photoreal/child-tshirt.jpg', 22
  UNION ALL SELECT 'Kids'' Clothing', 'Girl''s Pink Everyday Dress', 'A girl wearing a pink dress outdoors.', 700, '/images/catalog/photoreal/child-dress.jpg', 16
  UNION ALL SELECT 'Kids'' Clothing', 'Children''s Blue School Uniform', 'A child wearing a blue school uniform.', 650, '/images/catalog/photoreal/child-school.jpg', 14
  UNION ALL SELECT 'Shoes & Footwear', 'Girls'' Red Floral Mary Jane Shoes', 'Red Mary Jane shoes decorated with small flowers.', 750, '/images/catalog/children-shoes/kids-cotton-shoes.jpg', 14
  UNION ALL SELECT 'Shoes & Footwear', 'Boys'' White and Lime Velcro Sneakers', 'White children''s sneakers with lime accents and a hook-and-loop strap.', 800, '/images/catalog/children-shoes/kids-sneakers.jpg', 14
  UNION ALL SELECT 'Shoes & Footwear', 'Boys'' Black Lace-Up Dress Shoes', 'A pair of black lace-up dress shoes.', 850, '/images/catalog/child-boys-school-shoes.jpg', 10
  UNION ALL SELECT 'Shoes & Footwear', 'Girls'' Black Bow Mary Jane Shoes', 'Black Mary Jane shoes with bows.', 850, '/images/catalog/child-girls-school-shoes.jpg', 10
) AS exact_item
JOIN users AS seller ON seller.email = 'maker@example.test'
JOIN categories AS category ON category.name = exact_item.category
WHERE NOT EXISTS (
  SELECT 1 FROM products existing
  WHERE existing.seller_id = seller.id AND existing.name = exact_item.name
);

-- Keep the animal-feed cards paired with images that match the feed and animal.
UPDATE products
SET image_url = CASE name
  WHEN 'Dog Food, 1 kg' THEN '/images/catalog/animal-feed/dog-food.jpg'
  WHEN 'Small Dog Food Pack, 500 g' THEN '/images/catalog/animal-feed/small-dog-food.jpg'
  WHEN 'Layers Mash, 2 kg' THEN '/images/catalog/animal-feed/layer-feed.jpg'
  WHEN 'Layer Chicken Feed, 1 kg' THEN '/images/catalog/animal-feed/backyard-layer-feed.jpg'
  WHEN 'Dairy Meal, 2 kg' THEN '/images/catalog/animal-feed/dairy-meal.jpg'
  WHEN 'Chick Starter Mash, 2 kg' THEN '/images/catalog/animal-feed/chick-starter.jpg'
  ELSE image_url
END,
moderation_status = 'approved'
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND name IN (
    'Dog Food, 1 kg',
    'Small Dog Food Pack, 500 g',
    'Layers Mash, 2 kg',
    'Layer Chicken Feed, 1 kg',
    'Dairy Meal, 2 kg',
    'Chick Starter Mash, 2 kg'
  );

UPDATE products
SET name = 'Honey Jars, 500 g',
    description = 'A selection of glass jars filled with golden honey.',
    image_url = '/images/catalog/commons-honey-jars.jpg'
WHERE name = 'Small-Batch Wildflower Honey';

UPDATE products
SET name = 'Fresh Potatoes, 1 kg',
    description = 'A one-kilo portion of locally sourced potatoes for family meals.'
WHERE name = 'Fresh Sweet Potatoes, 1 kg';

UPDATE products
SET name = 'Fresh Cookies, 2 Pieces',
    description = 'A small affordable pack of freshly made cookies for tea time.',
    image_url = '/images/catalog/product-29.jpg'
WHERE name = 'Fresh Mandazi, 2 Pieces';

UPDATE products
SET image_url = '/images/catalog/commons-wicker-tray.jpg'
WHERE name = 'Woven Storage Tray';

UPDATE products
SET name = 'Reusable Cotton Tote Bag',
    description = 'A reusable cotton shoulder bag for market shopping and everyday errands.',
    image_url = '/images/catalog/commons-cotton-tote.jpg'
WHERE name = 'Reusable Market Carry Bag';

UPDATE products
SET image_url = '/images/catalog/commons-raffia-placemats.jpg'
WHERE name = 'Handwoven Table Mat';

UPDATE products
SET image_url = '/images/catalog/commons-hammer.jpg'
WHERE name = 'Household Hammer';

UPDATE products
SET image_url = '/images/catalog/commons-file-folders.jpg'
WHERE name = 'Document Files, 5 Pack';

UPDATE products
SET image_url = '/images/catalog/commons-paper-reams.jpg'
WHERE name = 'A4 Printing Paper, 500 Sheets';

UPDATE products
SET image_url = '/images/catalog/commons-pink-nail-polish.jpg'
WHERE name = 'Nail Polish';

UPDATE products
SET image_url = '/images/catalog/beauty/facial-mist-routine.jpg'
WHERE name = 'Refreshing Body Mist, 100 ml';

UPDATE products
SET name = CASE name
      WHEN 'Hand-painted Clay Mug' THEN 'Pink Glass Tumbler with Cork Coaster'
      WHEN 'Pressed Flower Cards' THEN 'Handmade Floral Greeting Cards'
      WHEN 'Plain White Ceramic Coffee Mug' THEN 'Pattern-Painted Clay Cup'
      WHEN 'Small Handmade Greeting Card Set' THEN 'Handmade Greeting Card Set'
      WHEN 'Handmade Beaded Key Ring' THEN 'Handmade Beaded Key Rings'
      WHEN 'Handwoven Paper Bookmark' THEN 'Handmade Paper Bookmark Pair'
      WHEN 'Soft Cotton Throw' THEN 'Handmade Crochet Throw Blanket'
      WHEN 'Assorted Nails, 500 g' THEN 'Assorted Metal Fasteners, 500 g'
      WHEN 'Moisturizing Petroleum Jelly, 250 ml' THEN 'Moisturizing Skin Cream, 50 ml'
      WHEN 'Family Shampoo, 400 ml' THEN 'Anti-Dandruff Shampoo, 700 ml'
      WHEN 'Coconut Hair Oil, 150 ml' THEN 'Hair Oil, 150 ml'
      WHEN 'Raw Groundnuts, 500 g' THEN 'Groundnuts, 500 g'
      WHEN 'Everyday Body Oil, 200 ml' THEN 'Aromatic Perfume Oil, 10 ml'
      WHEN 'Face Foundation' THEN 'Foundation Primer, 30 ml'
      WHEN 'Gentle Facial Cleanser, 200 ml' THEN 'Nourishing Facial Serum, 30 ml'
      WHEN 'Daily Face Moisturizer, 100 ml' THEN 'Sea Buckthorn Body Butter, 200 ml'
      WHEN 'Refreshing Body Mist, 100 ml' THEN 'Refreshing Facial Mist, 100 ml'
      ELSE name
    END,
    description = CASE name
      WHEN 'Hand-painted Clay Mug' THEN 'A clear glass tumbler served with a square cork coaster.'
      WHEN 'Pink Glass Tumbler with Cork Coaster' THEN 'A clear glass tumbler served with a square cork coaster.'
      WHEN 'Pressed Flower Cards' THEN 'Handmade greeting cards decorated with colorful floral embellishments.'
      WHEN 'Handmade Floral Greeting Cards' THEN 'Handmade greeting cards decorated with colorful floral embellishments.'
      WHEN 'Plain White Ceramic Coffee Mug' THEN 'A small clay cup with a warm, pattern-painted finish.'
      WHEN 'Pattern-Painted Clay Cup' THEN 'A small clay cup with a warm, pattern-painted finish.'
      WHEN 'Small Handmade Greeting Card Set' THEN 'A small set of handmade floral greeting cards for birthdays and special occasions.'
      WHEN 'Handmade Greeting Card Set' THEN 'A small set of handmade floral greeting cards for birthdays and special occasions.'
      WHEN 'Handmade Beaded Key Ring' THEN 'A colorful set of handmade beaded key rings.'
      WHEN 'Handmade Beaded Key Rings' THEN 'A colorful set of handmade beaded key rings.'
      WHEN 'Handwoven Paper Bookmark' THEN 'A pair of handmade paper bookmarks for keeping your place in a book.'
      WHEN 'Handmade Paper Bookmark Pair' THEN 'A pair of handmade paper bookmarks for keeping your place in a book.'
      WHEN 'Soft Cotton Throw' THEN 'A handmade granny-square crochet throw blanket for a chair or sofa.'
      WHEN 'Handmade Crochet Throw Blanket' THEN 'A handmade granny-square crochet throw blanket for a chair or sofa.'
      WHEN 'Assorted Nails, 500 g' THEN 'A 500 g assortment of metal fasteners for common household repairs.'
      WHEN 'Assorted Metal Fasteners, 500 g' THEN 'A 500 g assortment of metal fasteners for common household repairs.'
      WHEN 'Moisturizing Petroleum Jelly, 250 ml' THEN 'A 50 ml jar of moisturizing skin cream for everyday care.'
      WHEN 'Moisturizing Skin Cream, 50 ml' THEN 'A 50 ml jar of moisturizing skin cream for everyday care.'
      WHEN 'Family Shampoo, 400 ml' THEN 'A 700 ml anti-dandruff shampoo for regular hair washing.'
      WHEN 'Anti-Dandruff Shampoo, 700 ml' THEN 'A 700 ml anti-dandruff shampoo for regular hair washing.'
      WHEN 'Coconut Hair Oil, 150 ml' THEN 'A 150 ml bottle of nourishing hair oil.'
      WHEN 'Hair Oil, 150 ml' THEN 'A 150 ml bottle of nourishing hair oil.'
      WHEN 'Raw Groundnuts, 500 g' THEN 'A 500 g portion of groundnuts for cooking, roasting, or snacking.'
      WHEN 'Groundnuts, 500 g' THEN 'A 500 g portion of groundnuts for cooking, roasting, or snacking.'
      WHEN 'Everyday Body Oil, 200 ml' THEN 'A small bottle of aromatic perfume oil for personal fragrance.'
      WHEN 'Aromatic Perfume Oil, 10 ml' THEN 'A small bottle of aromatic perfume oil for personal fragrance.'
      WHEN 'Face Foundation' THEN 'A 30 ml cosmetic foundation primer for preparing skin before makeup.'
      WHEN 'Foundation Primer, 30 ml' THEN 'A 30 ml cosmetic foundation primer for preparing skin before makeup.'
      WHEN 'Gentle Facial Cleanser, 200 ml' THEN 'A 30 ml nourishing facial serum for a daily skincare routine.'
      WHEN 'Nourishing Facial Serum, 30 ml' THEN 'A 30 ml nourishing facial serum for a daily skincare routine.'
      WHEN 'Daily Face Moisturizer, 100 ml' THEN 'A 200 ml jar of sea buckthorn body butter for moisturizing skin.'
      WHEN 'Sea Buckthorn Body Butter, 200 ml' THEN 'A 200 ml jar of sea buckthorn body butter for moisturizing skin.'
      WHEN 'Refreshing Body Mist, 100 ml' THEN 'A 100 ml refreshing facial mist for a light skincare spritz.'
      WHEN 'Refreshing Facial Mist, 100 ml' THEN 'A 100 ml refreshing facial mist for a light skincare spritz.'
      ELSE description
    END,
    image_url = CASE name
      WHEN 'Hand-painted Clay Mug' THEN '/images/catalog/home/glass-tumbler-coaster.jpg'
      WHEN 'Pink Glass Tumbler with Cork Coaster' THEN '/images/catalog/home/glass-tumbler-coaster.jpg'
      WHEN 'Pressed Flower Cards' THEN '/images/catalog/craft/flower-greeting-cards.jpg'
      WHEN 'Handmade Floral Greeting Cards' THEN '/images/catalog/craft/flower-greeting-cards.jpg'
      WHEN 'Plain White Ceramic Coffee Mug' THEN '/images/catalog/craft/painted-clay-mug.jpg'
      WHEN 'Pattern-Painted Clay Cup' THEN '/images/catalog/craft/painted-clay-mug.jpg'
      WHEN 'Small Handmade Greeting Card Set' THEN '/images/catalog/craft/flower-greeting-cards.jpg'
      WHEN 'Handmade Greeting Card Set' THEN '/images/catalog/craft/flower-greeting-cards.jpg'
      WHEN 'Handmade Beaded Key Ring' THEN '/images/catalog/craft/beaded-keyrings.jpg'
      WHEN 'Handmade Beaded Key Rings' THEN '/images/catalog/craft/beaded-keyrings.jpg'
      WHEN 'Handwoven Paper Bookmark' THEN '/images/catalog/craft/paper-bookmarks.jpg'
      WHEN 'Handmade Paper Bookmark Pair' THEN '/images/catalog/craft/paper-bookmarks.jpg'
      WHEN 'Soft Cotton Throw' THEN '/images/catalog/home/crochet-throw.jpg'
      WHEN 'Handmade Crochet Throw Blanket' THEN '/images/catalog/home/crochet-throw.jpg'
      WHEN 'Woven Market Basket' THEN '/images/catalog/home/market-basket.jpg'
      WHEN 'Woven Storage Tray' THEN '/images/catalog/commons-wicker-tray.jpg'
      WHEN 'Reusable Cotton Tote Bag' THEN '/images/catalog/commons-cotton-tote.jpg'
      WHEN 'Small Cotton Cushion Cover' THEN '/images/catalog/home/cushion-cover.jpg'
      WHEN 'Handwoven Table Mat' THEN '/images/catalog/commons-raffia-placemats.jpg'
      WHEN 'Makeup Collection' THEN '/images/catalog/beauty/makeup-collection.jpg'
      WHEN 'Gentle Bathing Soap, 2 Bars' THEN '/images/catalog/beauty/bathing-soap.jpg'
      WHEN 'Everyday Body Lotion, 250 ml' THEN '/images/catalog/beauty/body-lotion.jpg'
      WHEN 'Moisturizing Petroleum Jelly, 250 ml' THEN '/images/catalog/beauty/skin-cream.jpg'
      WHEN 'Moisturizing Skin Cream, 50 ml' THEN '/images/catalog/beauty/skin-cream.jpg'
      WHEN 'Family Shampoo, 400 ml' THEN '/images/catalog/beauty/shampoo.jpg'
      WHEN 'Anti-Dandruff Shampoo, 700 ml' THEN '/images/catalog/beauty/shampoo.jpg'
      WHEN 'Coconut Hair Oil, 150 ml' THEN '/images/catalog/beauty/coconut-hair-oil.jpg'
      WHEN 'Hair Oil, 150 ml' THEN '/images/catalog/beauty/coconut-hair-oil.jpg'
      WHEN 'Toothpaste, 100 ml' THEN '/images/catalog/beauty/toothpaste.jpg'
      WHEN 'Sanitary Towels, 8 Pack' THEN '/images/catalog/beauty/sanitary-towels.jpg'
      WHEN 'Everyday Body Oil, 200 ml' THEN '/images/catalog/beauty/body-oil.jpg'
      WHEN 'Aromatic Perfume Oil, 10 ml' THEN '/images/catalog/beauty/body-oil.jpg'
      WHEN 'Everyday Lipstick' THEN '/images/catalog/beauty/lipstick.jpg'
      WHEN 'Face Foundation' THEN '/images/catalog/beauty/foundation-primer.jpg'
      WHEN 'Foundation Primer, 30 ml' THEN '/images/catalog/beauty/foundation-primer.jpg'
      WHEN 'Compact Face Powder' THEN '/images/catalog/beauty/compact-powder.jpg'
      WHEN 'Lengthening Mascara' THEN '/images/catalog/beauty/mascara.jpg'
      WHEN 'Black Eyeliner Pencil' THEN '/images/catalog/beauty/eyeliner.jpg'
      WHEN 'Makeup Brush Set' THEN '/images/catalog/beauty/makeup-brushes.jpg'
      WHEN 'Gentle Facial Cleanser, 200 ml' THEN '/images/catalog/beauty/face-serum-routine.jpg'
      WHEN 'Nourishing Facial Serum, 30 ml' THEN '/images/catalog/beauty/face-serum-routine.jpg'
      WHEN 'Daily Face Moisturizer, 100 ml' THEN '/images/catalog/beauty/face-moisturizer.jpg'
      WHEN 'Sea Buckthorn Body Butter, 200 ml' THEN '/images/catalog/beauty/face-moisturizer.jpg'
      WHEN 'Broad-Spectrum Sunscreen, 100 ml' THEN '/images/catalog/beauty/sunscreen.jpg'
      WHEN 'Hair Conditioner, 400 ml' THEN '/images/catalog/beauty/conditioner.jpg'
      WHEN 'Refreshing Body Mist, 100 ml' THEN '/images/catalog/beauty/facial-mist-routine.jpg'
      WHEN 'Refreshing Facial Mist, 100 ml' THEN '/images/catalog/beauty/facial-mist-routine.jpg'
      WHEN 'Nail Polish' THEN '/images/catalog/commons-pink-nail-polish.jpg'
      WHEN 'Farm-Fresh Eggs, Tray of 30' THEN '/images/catalog/farm/eggs.jpg'
      WHEN 'Green Grams, 1 kg' THEN '/images/catalog/farm/green-grams.jpg'
      WHEN 'Raw Groundnuts, 500 g' THEN '/images/catalog/farm/groundnuts.jpg'
      WHEN 'Groundnuts, 500 g' THEN '/images/catalog/farm/groundnuts.jpg'
      WHEN 'Local Forest Honey, 500 g' THEN '/images/catalog/commons-honey-jars.jpg'
      WHEN 'Fresh Potatoes, 1 kg' THEN '/images/catalog/fresh-produce/potatoes.jpg'
      WHEN 'Dry Maize, 1 kg' THEN '/images/catalog/farm/dry-maize.jpg'
      WHEN 'Fresh Tomatoes, 1 kg' THEN '/images/catalog/fresh-produce/tomatoes.jpg'
      WHEN 'Red Onions, 1 kg' THEN '/images/catalog/fresh-produce/red-onions.jpg'
      WHEN 'Irish Potatoes, 2 kg' THEN '/images/catalog/fresh-produce/potatoes.jpg'
      WHEN 'Fresh Carrots, 1 kg' THEN '/images/catalog/fresh-produce/carrots.jpg'
      WHEN 'Sukuma Wiki Bunch' THEN '/images/catalog/fresh-produce/sukuma-wiki.jpg'
      WHEN 'Spinach Bunch' THEN '/images/catalog/fresh-produce/spinach.jpg'
      WHEN 'Fresh Cabbage' THEN '/images/catalog/fresh-produce/cabbage.jpg'
      WHEN 'Ripe Bananas, 1 kg' THEN '/images/catalog/fresh-produce/bananas.jpg'
      WHEN 'Seasonal Mangoes, 1 kg' THEN '/images/catalog/fresh-produce/mangoes.jpg'
      WHEN 'Fresh Oranges, 1 kg' THEN '/images/catalog/fresh-produce/oranges.jpg'
      WHEN 'Assorted Nails, 500 g' THEN '/images/catalog/hardware/assorted-fasteners.jpg'
      WHEN 'Assorted Metal Fasteners, 500 g' THEN '/images/catalog/hardware/assorted-fasteners.jpg'
      WHEN 'Wood Screws, 50 Pack' THEN '/images/catalog/hardware/wood-screws.jpg'
      WHEN 'Steel Padlock' THEN '/images/catalog/hardware/padlock.jpg'
      WHEN 'Door Hinges, Pair' THEN '/images/catalog/hardware/door-hinges.jpg'
      WHEN 'Household Hammer' THEN '/images/catalog/commons-hammer.jpg'
      WHEN 'Screwdriver Set, 6 Pieces' THEN '/images/catalog/hardware/screwdrivers.jpg'
      WHEN 'Measuring Tape, 5 m' THEN '/images/catalog/hardware/measuring-tape.jpg'
      WHEN 'Paint Brush, 2 Inch' THEN '/images/catalog/hardware/paint-brush.jpg'
      WHEN 'LED Household Bulb' THEN '/images/catalog/hardware/led-bulb.jpg'
      WHEN 'Basic Light Switch' THEN '/images/catalog/hardware/light-switch.jpg'
      WHEN 'Plumbing Tap Fittings Set' THEN '/images/catalog/hardware/plumbing-fittings.jpg'
      ELSE image_url
    END,
    category_id = CASE name
      WHEN 'Hand-painted Clay Mug' THEN (SELECT id FROM categories WHERE name = 'Home & Living')
      WHEN 'Pink Glass Tumbler with Cork Coaster' THEN (SELECT id FROM categories WHERE name = 'Home & Living')
      ELSE category_id
    END
WHERE seller_id IN (SELECT id FROM users WHERE is_demo_profile = 1)
  AND name IN (
    'Hand-painted Clay Mug', 'Pink Glass Tumbler with Cork Coaster',
    'Pressed Flower Cards', 'Handmade Floral Greeting Cards',
    'Plain White Ceramic Coffee Mug', 'Pattern-Painted Clay Cup',
    'Small Handmade Greeting Card Set', 'Handmade Greeting Card Set',
    'Handmade Beaded Key Ring', 'Handmade Beaded Key Rings',
    'Handwoven Paper Bookmark', 'Handmade Paper Bookmark Pair',
    'Soft Cotton Throw', 'Handmade Crochet Throw Blanket',
    'Woven Market Basket', 'Woven Storage Tray', 'Reusable Cotton Tote Bag',
    'Small Cotton Cushion Cover', 'Handwoven Table Mat', 'Makeup Collection',
    'Gentle Bathing Soap, 2 Bars', 'Everyday Body Lotion, 250 ml',
    'Moisturizing Petroleum Jelly, 250 ml', 'Moisturizing Skin Cream, 50 ml',
    'Family Shampoo, 400 ml', 'Anti-Dandruff Shampoo, 700 ml',
    'Coconut Hair Oil, 150 ml', 'Hair Oil, 150 ml', 'Toothpaste, 100 ml',
    'Sanitary Towels, 8 Pack', 'Everyday Body Oil, 200 ml',
    'Aromatic Perfume Oil, 10 ml', 'Everyday Lipstick', 'Face Foundation',
    'Foundation Primer, 30 ml',
    'Compact Face Powder', 'Lengthening Mascara', 'Black Eyeliner Pencil',
    'Makeup Brush Set', 'Gentle Facial Cleanser, 200 ml',
    'Nourishing Facial Serum, 30 ml', 'Daily Face Moisturizer, 100 ml',
    'Sea Buckthorn Body Butter, 200 ml', 'Broad-Spectrum Sunscreen, 100 ml',
    'Hair Conditioner, 400 ml', 'Refreshing Body Mist, 100 ml',
    'Refreshing Facial Mist, 100 ml', 'Nail Polish',
    'Farm-Fresh Eggs, Tray of 30', 'Green Grams, 1 kg',
    'Raw Groundnuts, 500 g', 'Groundnuts, 500 g',
    'Local Forest Honey, 500 g', 'Fresh Potatoes, 1 kg', 'Dry Maize, 1 kg',
    'Fresh Tomatoes, 1 kg', 'Red Onions, 1 kg', 'Irish Potatoes, 2 kg',
    'Fresh Carrots, 1 kg', 'Sukuma Wiki Bunch', 'Spinach Bunch', 'Fresh Cabbage',
    'Ripe Bananas, 1 kg', 'Seasonal Mangoes, 1 kg', 'Fresh Oranges, 1 kg',
    'Assorted Nails, 500 g', 'Assorted Metal Fasteners, 500 g',
    'Wood Screws, 50 Pack', 'Steel Padlock',
    'Door Hinges, Pair', 'Household Hammer', 'Screwdriver Set, 6 Pieces',
    'Measuring Tape, 5 m', 'Paint Brush, 2 Inch', 'LED Household Bulb',
    'Basic Light Switch', 'Plumbing Tap Fittings Set'
  );

UPDATE products
SET image_url = CASE name
  WHEN 'Men''s Black Logo T-Shirt' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Men''s Blue Patterned Button-Down Shirt' THEN '/images/catalog/photoreal/man-button-down-shirt.jpg'
  WHEN 'Women''s Dusty Pink High-Waisted Trousers' THEN '/images/catalog/photoreal/woman-trousers.jpg'
  WHEN 'Toddler''s Green Graphic T-Shirt' THEN '/images/catalog/photoreal/child-tshirt.jpg'
  WHEN 'Children''s Navy School Trousers' THEN '/images/catalog/models/child-schoolwear.svg'
  WHEN 'Children''s Pleated School Skirt' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Teenage Girls'' Casual Sneakers' THEN '/images/catalog/footwear/slide-3.jpg'
  WHEN 'Women''s Light Casual Trainers' THEN '/images/catalog/footwear/slide-3.jpg'
  WHEN 'Sanitary Towels, 8 Pack' THEN '/images/catalog/beauty/sanitary-towels.jpg'
  WHEN 'Sanitary Pads, 8 Pack' THEN '/images/catalog/beauty/sanitary-towels.jpg'
  ELSE image_url
END
WHERE seller_id IN (SELECT id FROM users WHERE is_demo_profile = 1)
  AND name IN (
    'Men''s Black Logo T-Shirt', 'Men''s Blue Patterned Button-Down Shirt',
    'Women''s Dusty Pink High-Waisted Trousers', 'Toddler''s Green Graphic T-Shirt',
    'Children''s Navy School Trousers', 'Children''s Pleated School Skirt',
    'Teenage Girls'' Casual Sneakers', 'Women''s Light Casual Trainers',
    'Sanitary Towels, 8 Pack', 'Sanitary Pads, 8 Pack'
  );

UPDATE products
SET image_url = CASE name
  WHEN 'Maize Flour, 2 kg' THEN 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80'
  WHEN 'Long-Grain Rice, 1 kg' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80'
  WHEN 'Dry Beans, 1 kg' THEN 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80'
  WHEN 'Cooking Oil, 1 litre' THEN 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80'
  WHEN 'White Sugar, 1 kg' THEN 'https://images.unsplash.com/photo-1581264695897-80f0d95b3c7c?auto=format&fit=crop&w=900&q=80'
  WHEN 'Kenyan Tea Leaves, 250 g' THEN 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80'
  WHEN 'Family Biscuits Pack' THEN 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80'
  WHEN 'Crispy Banana Chips' THEN 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80'
  WHEN 'Family Porridge Flour, 1 kg' THEN 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80'
  WHEN 'Fresh Bread Loaf' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80'
  WHEN 'Fresh Milk, 500 ml' THEN 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80'
  WHEN 'Table Salt, 1 kg' THEN 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442d?auto=format&fit=crop&w=900&q=80'
  WHEN 'Bottled Drinking Water, 1 litre' THEN 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80'
  WHEN 'Universal USB Phone Charger' THEN 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80'
  WHEN 'USB Charging Cable' THEN 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80'
  WHEN 'Clear Protective Phone Case' THEN 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80'
  WHEN 'Wired Earphones' THEN 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
  WHEN 'Portable Power Bank, 10,000 mAh' THEN 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80'
  WHEN 'Exercise Books, 5 Pack' THEN 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80'
  WHEN 'Blue Ballpoint Pens, 10 Pack' THEN 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80'
  WHEN 'Pencils and Erasers Set' THEN 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80'
  WHEN 'Mathematical Set' THEN 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80'
  WHEN 'Everyday School Backpack' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
  WHEN 'Writing Notebooks, 3 Pack' THEN 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80'
  WHEN 'Business Envelopes, 25 Pack' THEN 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=900&q=80'
  WHEN 'Toothbrush, 2 Pack' THEN 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80'
  WHEN 'Everyday Shampoo, 400 ml' THEN '/images/catalog/beauty/shampoo.jpg'
  WHEN 'Deodorant, 150 ml' THEN 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80'
  WHEN 'Multi-Purpose Household Cleaner, 500 ml' THEN 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80'
  WHEN 'Household Broom' THEN 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80'
  WHEN 'Floor Mop' THEN 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80'
  WHEN 'Cleaning Sponges, 3 Pack' THEN 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80'
  WHEN 'Household Dustbin' THEN 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80'
  WHEN 'Baby Cotton Bodysuit' THEN '/images/catalog/photoreal/child-bodysuit.jpg'
  WHEN 'Baby First-Step Shoes' THEN 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80'
  WHEN 'Kids Everyday Outfit' THEN '/images/catalog/photoreal/child-play.jpg'
  WHEN 'Child''s School Outfit' THEN '/images/catalog/photoreal/child-school.jpg'
  WHEN 'Baby Soft Cotton Sleep Suit' THEN '/images/catalog/photoreal/child-bodysuit.jpg'
  WHEN 'Men''s Everyday Cotton Tee' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Men''s Cotton Everyday Vest' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Men''s Cotton Vest' THEN '/images/catalog/photoreal/man-tee.jpg'
  WHEN 'Men''s Everyday Underwear Pack' THEN '/images/catalog/innerwear/mens-innerwear.jpg'
  WHEN 'Children''s Comfort Cotton Socks' THEN '/images/catalog/photoreal/accessory-socks.jpg'
  WHEN 'Men''s Everyday Socks, 2 Pairs' THEN '/images/catalog/photoreal/accessory-socks.jpg'
  WHEN 'Men''s Casual Cotton Shirt' THEN '/images/catalog/photoreal/man-button-down-shirt.jpg'
  WHEN 'Men''s Easy-Wear Button-Front Shirt' THEN '/images/catalog/photoreal/man-button-down-shirt.jpg'
  WHEN 'Men''s Soft Cotton Everyday Shirt' THEN '/images/catalog/photoreal/man-shirt.jpg'
  WHEN 'Men''s Comfort-Fit Elastic-Waist Trousers' THEN '/images/catalog/photoreal/man-trousers.jpg'
  WHEN 'Children''s School Shoes' THEN '/images/catalog/child-boys-school-shoes.jpg'
  WHEN 'Children''s Play Sandals' THEN '/images/catalog/footwear/slide-6.jpg'
  WHEN 'Women''s Everyday Sandals' THEN '/images/catalog/footwear/slide-6.jpg'
  WHEN 'Men''s Home Slippers' THEN 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80'
  ELSE image_url
END
WHERE seller_id IN (SELECT id FROM users WHERE is_demo_profile = 1)
  AND name IN (
    'Maize Flour, 2 kg', 'Long-Grain Rice, 1 kg', 'Dry Beans, 1 kg',
    'Cooking Oil, 1 litre', 'White Sugar, 1 kg', 'Kenyan Tea Leaves, 250 g',
    'Family Biscuits Pack', 'Crispy Banana Chips', 'Family Porridge Flour, 1 kg',
    'Fresh Bread Loaf', 'Fresh Milk, 500 ml', 'Table Salt, 1 kg',
    'Bottled Drinking Water, 1 litre', 'Universal USB Phone Charger',
    'USB Charging Cable', 'Clear Protective Phone Case', 'Wired Earphones',
    'Portable Power Bank, 10,000 mAh', 'Exercise Books, 5 Pack',
    'Blue Ballpoint Pens, 10 Pack', 'Pencils and Erasers Set',
    'Mathematical Set', 'Everyday School Backpack', 'Writing Notebooks, 3 Pack',
    'Business Envelopes, 25 Pack', 'Toothbrush, 2 Pack', 'Everyday Shampoo, 400 ml',
    'Deodorant, 150 ml', 'Multi-Purpose Household Cleaner, 500 ml',
    'Household Broom', 'Floor Mop', 'Cleaning Sponges, 3 Pack', 'Household Dustbin',
    'Baby Cotton Bodysuit', 'Baby First-Step Shoes', 'Kids Everyday Outfit',
    'Child''s School Outfit', 'Baby Soft Cotton Sleep Suit',
    'Men''s Everyday Cotton Tee', 'Men''s Cotton Everyday Vest', 'Men''s Cotton Vest',
    'Men''s Everyday Underwear Pack', 'Children''s Comfort Cotton Socks',
    'Men''s Everyday Socks, 2 Pairs', 'Men''s Casual Cotton Shirt',
    'Men''s Easy-Wear Button-Front Shirt', 'Men''s Soft Cotton Everyday Shirt',
    'Men''s Comfort-Fit Elastic-Waist Trousers', 'Children''s School Shoes',
    'Children''s Play Sandals', 'Women''s Everyday Sandals', 'Men''s Home Slippers'
  );

INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock, moderation_status)
SELECT seller.id, category.id, 'Women''s Black and White Striped Dress',
  'A black-and-white striped day dress shown on a model.', 850,
  '/images/catalog/photoreal/black-white-striped-dress.jpg',
  12, 'approved'
FROM users AS seller
JOIN categories AS category ON category.name = 'Adult Clothing'
WHERE seller.email = 'maker@example.test'
  AND NOT EXISTS (
    SELECT 1 FROM products existing
    WHERE existing.seller_id = seller.id
      AND existing.name = 'Women''s Black and White Striped Dress'
  );

UPDATE products
SET image_url = '/images/catalog/photoreal/black-white-striped-dress.jpg'
WHERE seller_id = (SELECT id FROM users WHERE email = 'maker@example.test')
  AND name = 'Women''s Black and White Striped Dress';
