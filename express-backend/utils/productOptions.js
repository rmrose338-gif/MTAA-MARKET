const clothingCategories = new Set([
  "Fashion",
  "Kids' Clothing",
  "Teen Clothing",
  "Adult Clothing",
  "Older Adults' Clothing",
  "Clothing & Accessories",
]);

const sizesByCategory = {
  Fashion: ["XS", "S", "M", "L", "XL", "XXL"],
  "Kids' Clothing": ["2-4 years", "5-7 years", "8-10 years", "11-13 years"],
  "Teen Clothing": ["XS", "S", "M", "L", "XL"],
  "Adult Clothing": ["XS", "S", "M", "L", "XL", "XXL"],
  "Older Adults' Clothing": ["S", "M", "L", "XL", "XXL"],
  "Clothing & Accessories": ["S", "M", "L", "XL", "XXL"],
};
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
const kidsShoeSizes = ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"];
const babyShoeSizes = ["17", "18", "19", "20", "21", "22", "23"];
const babySizes = ["0-3 months", "3-6 months", "6-12 months", "12-18 months", "18-24 months"];
const cosmeticsShades = ["Nude", "Pink", "Red", "Berry", "Brown"];
const foundationShades = ["Porcelain", "Light", "Medium", "Tan", "Deep"];

function getProductOptionDefinitions(product) {
  const category = product.category_name;
  const name = product.name.toLowerCase();
  if (category === "Home & Living" && name.includes("basket")) {
    return { size: ["Small", "Medium", "Large"], color: ["Natural", "Honey", "Dark Brown"] };
  }
  if (category === "Home & Living" && name.includes("throw")) {
    return { size: ["Single", "Double", "King"], color: ["Cream", "Green", "Blue", "Terracotta"] };
  }
  if (clothingCategories.has(category)) {
    return { size: sizesByCategory[category] };
  }
  if (category === "Baby & Kids" && name.includes("shoe")) {
    const sizes = name.includes("baby") ? babyShoeSizes : kidsShoeSizes;
    return { size: sizes };
  }
  if (category === "Shoes & Footwear" && name.includes("kids")) {
    return { size: kidsShoeSizes };
  }
  if (category === "Shoes & Footwear") {
    return { size: shoeSizes };
  }
  if (category === "Baby & Kids" && (name.includes("bodysuit") || name.includes("outfit"))) {
    return { size: babySizes };
  }
  if (category === "Beauty & Personal Care") {
    if (name.includes("foundation") || name.includes("face powder")) return { shade: foundationShades };
    if (name.includes("lipstick") || name.includes("nail polish")) return { shade: cosmeticsShades };
  }
  return {};
}

function normalizeProductOptions(product, options) {
  const definitions = getProductOptionDefinitions(product);
  const selected = {};
  for (const [key, values] of Object.entries(definitions)) {
    const value = options && typeof options[key] === "string" ? options[key] : "";
    if (!values.includes(value)) {
      const label = key === "shade" ? "shade" : key;
      const error = new Error(`Choose a valid product ${label}.`);
      error.status = 400;
      throw error;
    }
    selected[key] = value;
  }
  if (options && Object.keys(options).some((key) => !Object.hasOwn(definitions, key))) {
    const error = new Error("This product does not have that option.");
    error.status = 400;
    throw error;
  }
  return selected;
}

module.exports = { getProductOptionDefinitions, normalizeProductOptions };
