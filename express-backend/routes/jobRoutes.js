const express = require("express");
const db = require("../config/database");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();
const services = [
  { slug: "cleaning", name: "House cleaning", summary: "Home, room, shop, and office cleaning.", examples: "Sweeping, mopping, washing, tidying, and deep cleaning.", skills: "Sweeping, mopping, washing", description: "I am available for affordable home or shop cleaning. Please call me to discuss your location and the work needed." },
  { slug: "laundry", name: "Laundry and ironing", summary: "Hand-washing, laundry, and ironing.", examples: "Clothes washing, bedding, ironing, and folding.", skills: "Hand-washing, ironing, folding", description: "I can wash and iron clothes for people nearby. Contact me to agree on the laundry, pickup, and price." },
  { slug: "tailoring", name: "Tailoring and sewing", summary: "Clothing repairs, alterations, and sewing.", examples: "Hemming, zips, buttons, mending, and made-to-measure clothes.", skills: "Sewing, alterations, mending", description: "I provide local tailoring, clothing repairs, and alterations. Call to discuss your clothes and agree on the price." },
  { slug: "hair-and-barber", name: "Hair and barber services", summary: "Haircuts and hair styling in the neighborhood.", examples: "Braiding, barber cuts, styling, and simple home visits.", skills: "Haircuts, braiding, styling", description: "I provide affordable neighborhood hair and barber services. Please call to discuss the style, location, and price." },
  { slug: "beauty-and-nails", name: "Beauty and nails", summary: "Simple beauty, manicure, and nail services.", examples: "Manicures, pedicures, nail care, and occasion preparation.", skills: "Nail care, manicure, pedicure", description: "I offer neighborhood beauty and nail-care services. Call or message me to discuss what you need and the price." },
  { slug: "plumbing", name: "Plumbing", summary: "Help with common water and pipe problems.", examples: "Leaking taps, blocked drains, sinks, and basic pipe repairs.", skills: "Tap repairs, leak checks, drain clearing", description: "I am available for local plumbing repairs and maintenance. Contact me with your location and the issue to discuss the visit and cost." },
  { slug: "electrical", name: "Electrical repairs", summary: "Basic electrical repairs and installations.", examples: "Lights, switches, sockets, and troubleshooting.", skills: "Lights, switches, socket repairs", description: "I offer local electrical repair and installation services. Please describe the job when you call so we can agree the work and price." },
  { slug: "carpentry", name: "Carpentry and furniture", summary: "Woodwork, furniture repairs, and small builds.", examples: "Door repairs, shelves, stools, cabinets, and furniture fixing.", skills: "Woodwork, furniture repairs, fitting", description: "I do neighborhood carpentry and furniture repairs. Call to describe what needs fixing or making and agree on the price." },
  { slug: "masonry", name: "Masonry and building", summary: "Masonry, construction, and home repairs.", examples: "Brickwork, plastering, small repairs, and laying blocks.", skills: "Brickwork, plastering, repairs", description: "I am available for local masonry and small building jobs. Contact me to discuss the work, materials, location, and cost." },
  { slug: "painting", name: "Painting and decorating", summary: "Painting rooms, homes, fences, and shops.", examples: "Interior painting, touch-ups, walls, and simple decorating.", skills: "Wall painting, touch-ups, decorating", description: "I provide local painting and decorating services. Call to discuss the area, paint needed, and an affordable price." },
  { slug: "welding", name: "Welding and metalwork", summary: "Small metalwork, welding, and gate repairs.", examples: "Gate repairs, metal frames, grills, and small welding jobs.", skills: "Welding, metal repairs, measuring", description: "I am available for nearby welding and metalwork jobs. Contact me with a description or photo of what you need repaired." },
  { slug: "mechanic", name: "Vehicle mechanic", summary: "Motorcycle, bicycle, and vehicle maintenance.", examples: "Punctures, basic servicing, bicycle repairs, and diagnostics.", skills: "Bike repairs, servicing, punctures", description: "I offer local vehicle or motorcycle repair services. Call to describe the problem and confirm where the work can be done." },
  { slug: "phone-repair", name: "Phone and electronics repair", summary: "Help fixing phones and small electronics.", examples: "Screen checks, charging issues, setup, and basic troubleshooting.", skills: "Phone setup, troubleshooting, basic repairs", description: "I help with phone and electronics troubleshooting. Please call first to describe your device and check if I can help." },
  { slug: "tutoring", name: "Tutoring and lessons", summary: "One-to-one help with school subjects and skills.", examples: "Primary-school support, reading, homework, and basic computer lessons.", skills: "Homework help, reading, maths", description: "I offer patient local tutoring and learning support. Call to discuss the learner, subject, schedule, and location." },
  { slug: "childcare", name: "Childcare and babysitting", summary: "Local childcare and babysitting services.", examples: "Short-term babysitting and agreed daytime childcare.", skills: "Child supervision, play, routine support", description: "I am available for childcare by prior agreement. Please call to discuss experience, your child's needs, timing, and arrangements." },
  { slug: "cooking", name: "Cooking and catering", summary: "Home cooking, snacks, and small-event food.", examples: "Meal preparation, chapati, snacks, and small gatherings.", skills: "Home cooking, meal preparation, snacks", description: "I prepare home-cooked food and can help with small gatherings. Call to discuss the menu, number of people, and price." },
  { slug: "gardening", name: "Gardening and yard work", summary: "Garden care and outdoor cleaning.", examples: "Weeding, planting, watering, trimming, and sweeping yards.", skills: "Weeding, planting, yard cleaning", description: "I offer local garden and yard work. Contact me to describe the garden, arrange a visit, and discuss the cost." },
  { slug: "delivery", name: "Local delivery and shopping help", summary: "Help with nearby shopping, errands, and small-item delivery.", examples: "Market shopping assistance, shopping pickup, local parcels, and neighborhood errands.", skills: "Local errands, parcel delivery, shopping pickup", description: "I can help with local shopping, errands, and small deliveries. Call with the route, item, and timing so we can agree a safe arrangement and price." },
  { slug: "shoe-repair", name: "Shoe and bag repair", summary: "Repair and care for shoes and everyday bags.", examples: "Sole repairs, stitching, polishing, and simple bag fixes.", skills: "Shoe repairs, stitching, polishing", description: "I provide shoe and bag repair services. Contact me to explain what needs fixing and agree on where to bring it and the price." },
  { slug: "moving", name: "Moving and carrying", summary: "Help carrying, loading, or moving household items.", examples: "Loading, unloading, carrying furniture, and nearby moves.", skills: "Lifting, loading, moving assistance", description: "I am available to help with carrying and small moves. Call to discuss the items, location, helpers needed, and price." },
  { slug: "farming", name: "Farm and garden work", summary: "Seasonal farm, livestock, and smallholding work.", examples: "Planting, weeding, harvesting, feeding animals, and cleaning sheds.", skills: "Planting, harvesting, livestock care", description: "I am looking for nearby farm or garden work and can help with seasonal tasks. Call to discuss the job, hours, and payment." },
  { slug: "other", name: "Other skills and services", summary: "Advertise another service not listed above.", examples: "Describe your trade, practical skills, and work wanted.", skills: "", description: "" },
];
const serviceBySlug = new Map(services.map((service) => [service.slug, service]));
const jobSelect = `SELECT jobs.id, jobs.category, jobs.title, jobs.skills, jobs.description, jobs.work_images, jobs.created_at,
  users.id AS user_id, users.name AS worker_name, users.is_demo_profile AS worker_is_demo,
  CASE WHEN users.public_contact = 1 THEN users.phone ELSE NULL END AS worker_phone,
  CASE WHEN users.public_contact = 1 THEN users.market_area ELSE NULL END AS worker_area
  FROM job_listings jobs JOIN users ON users.id = jobs.user_id`;

function parseWorkImages(job) {
  try {
    const images = JSON.parse(job.work_images || "[]");
    return { ...job, work_images: Array.isArray(images) ? images : [] };
  } catch {
    return { ...job, work_images: [] };
  }
}

function isValidWorkImageUrl(value) {
  return typeof value === "string"
    && value.length <= 2000
    && (/^https:\/\//i.test(value) || (/^\/images\/[a-z0-9/_-]+\.[a-z0-9]{2,5}$/i.test(value) && !value.includes("..")));
}

router.get("/categories", (_req, res) => {
  res.json(services.map(({ slug, name, summary, examples, skills, description }) => ({
    slug,
    name,
    summary,
    examples,
    sample_title: name === "Other skills and services" ? "" : `${name} available nearby`,
    sample_skills: skills,
    sample_description: description,
  })));
});

router.get("/mine", requireAuth, requireRole("seller"), (req, res) => {
  res.json(db.prepare(`${jobSelect} WHERE jobs.user_id = ? ORDER BY jobs.created_at DESC`).all(req.user.id).map(parseWorkImages));
});

router.get("/", (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const category = typeof req.query.category === "string" && serviceBySlug.has(req.query.category) ? req.query.category : "";
  const jobs = db.prepare(`${jobSelect}
    WHERE users.account_status = 'active' AND users.seller_status = 'approved'
      AND (? = '' OR jobs.category = ?)
      AND (? = '' OR jobs.title LIKE ? OR jobs.skills LIKE ? OR jobs.description LIKE ?)
    ORDER BY jobs.created_at DESC LIMIT 100`).all(category, category, search, `%${search}%`, `%${search}%`, `%${search}%`).map(parseWorkImages);
  return res.json(jobs);
});

router.get("/:id", (req, res) => {
  const job = db.prepare(`${jobSelect} WHERE jobs.id = ? AND users.account_status = 'active'
    AND users.seller_status = 'approved'`).get(req.params.id);
  if (!job) return res.status(404).json({ message: "Work advert not found." });
  return res.json(parseWorkImages(job));
});

router.post("/", requireAuth, requireRole("seller"), (req, res, next) => {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const skills = typeof req.body.skills === "string" ? req.body.skills.trim() : "";
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
    const category = typeof req.body.category === "string" && serviceBySlug.has(req.body.category) ? req.body.category : "";
    const workImages = Array.isArray(req.body.work_images) ? req.body.work_images.map((image) => typeof image === "string" ? image.trim() : image) : [];
    if (!category) return res.status(400).json({ message: "Choose the kind of service you provide." });
    if (title.length < 3 || title.length > 100) return res.status(400).json({ message: "Enter an advert title between 3 and 100 characters." });
    if (skills.length < 2 || skills.length > 300) return res.status(400).json({ message: "Describe your skills in 2 to 300 characters." });
    if (description.length < 10 || description.length > 1500) return res.status(400).json({ message: "Describe the work you are looking for in 10 to 1,500 characters." });
    if (workImages.length < 1 || workImages.length > 3 || workImages.some((image) => !isValidWorkImageUrl(image))) {
      return res.status(400).json({ message: "Add one to three valid HTTPS photos of your work." });
    }
    const seller = db.prepare("SELECT phone, public_contact FROM users WHERE id = ?").get(req.user.id);
    if (!seller?.phone) return res.status(400).json({ message: "Add a phone number to your seller profile before publishing a work advert." });
    if (!seller.public_contact) return res.status(400).json({ message: "Allow public contact in your seller profile before publishing a work advert." });

    const result = db.prepare("INSERT INTO job_listings (user_id, category, title, skills, description, work_images) VALUES (?, ?, ?, ?, ?, ?)")
      .run(req.user.id, category, title, skills, description, JSON.stringify(workImages));
    const job = db.prepare(`${jobSelect} WHERE jobs.id = ?`).get(result.lastInsertRowid);
    return res.status(201).json(parseWorkImages(job));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
