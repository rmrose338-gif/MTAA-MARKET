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
export function getProductOptionDefinitions(product) {
  const category = product.category_name;
  const name = product.name.toLowerCase();
  if (category === "Home & Living" && name.includes("basket")) {
    return { size: ["Small", "Medium", "Large"], color: ["Natural", "Honey", "Dark Brown"] };
  }
  if (category === "Home & Living" && name.includes("throw")) {
    return { size: ["Single", "Double", "King"], color: ["Cream", "Green", "Blue", "Terracotta"] };
  }
  if (category === "Kids' Clothing" && /\b(?:baby|infant)\b/.test(name)) {
    return { size: babySizes };
  }
  if (category === "Clothing & Accessories") {
    if (name.includes("perfume") || name.includes("parfum")) return { volume: ["30 ml", "50 ml", "100 ml"] };
    if (name.includes("bracelet")) return { wristFit: ["Small", "Medium", "Large"] };
    if (/\brings?\b/.test(name)) return { ringSize: ["6", "7", "8", "9", "10"] };
    if (name.includes("anklet")) return { ankletLength: ["22 cm", "24 cm", "26 cm", "28 cm"] };
    if (name.includes("necklace")) return { chainLength: ["40 cm", "45 cm", "50 cm"] };
    return {};
  }
  if (clothingCategories.has(category)) {
    return { size: sizesByCategory[category] || ["S", "M", "L", "XL"] };
  }
  if (category === "Baby & Kids" && name.includes("shoe")) {
    const sizes = name.includes("baby") ? babyShoeSizes : kidsShoeSizes;
    return { size: sizes };
  }
  if (category === "Shoes & Footwear" && /\b(?:kids?|children|child|boys?|girls?)\b/.test(name)) {
    const sizes = /\bbaby\b/.test(name) ? babyShoeSizes : kidsShoeSizes;
    return { size: sizes };
  }
  if (category === "Shoes & Footwear") {
    return { size: shoeSizes };
  }
  if (category === "Baby & Kids" && (name.includes("bodysuit") || name.includes("outfit"))) {
    const sizes = name.includes("baby") || name.includes("bodysuit") ? babySizes : sizesByCategory["Kids' Clothing"];
    return { size: sizes };
  }
  return {};
}

const optionLabels = {
  shade: "Shade",
  color: "Color",
  size: "Size",
  volume: "Volume",
  wristFit: "Wrist fit",
  ringSize: "Ring size",
  ankletLength: "Anklet length",
  chainLength: "Chain length",
};

export function getProductOptionLabel(key) {
  return optionLabels[key]
    || key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

export function formatProductOptions(options = {}) {
  return Object.entries(options)
    .map(([key, value]) => `${getProductOptionLabel(key)}: ${value}`)
    .join(" · ");
}

export function productOptionsKey(options = {}) {
  return JSON.stringify(options);
}
