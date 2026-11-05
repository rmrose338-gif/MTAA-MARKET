const clothingCategories = new Set([
  "Fashion",
  "Kids' Clothing",
  "Teen Clothing",
  "Adult Clothing",
  "Older Adults' Clothing",
  "Clothing & Accessories",
]);

const childrenClothingCategories = new Set(["Kids' Clothing", "Teen Clothing", "Baby & Kids"]);
const womenWords = /\b(?:women|womens|woman|ladies|lady|female|girls|girl)\b|dress|blouse|skirt/i;
const menWords = /\b(?:men|mens|male)\b/i;
const childrenWords = /\b(?:kids|children|child|baby|babies|toddler)\b/i;
const innerwearWords = /\b(?:innerwear|underwear|boxers|briefs|bra|brassiere|panties|bodysuit|vest pack)\b|sleep suit/i;

export function getInnerwearAudience(product) {
  const name = product?.name || "";
  if (/teenage? (?:boy|boys)|teen (?:boy|boys)|boys innerwear/i.test(name)) return "Teenage boys";
  if (/teenage? (?:girl|girls)|teen (?:girl|girls)|girls innerwear/i.test(name)) return "Teenage girls";
  if (/baby|infant|newborn/i.test(name)) return "Babies";
  if (/women|women's|ladies/i.test(name)) return "Women";
  if (/men|men's/i.test(name)) return "Men";
  return null;
}

export const productGroups = [
  { id: "mens-clothing", label: "Men's clothing", description: "Browse clothing for men.", icon: "◇" },
  { id: "womens-attire", label: "Women's attire", description: "Browse dresses, tops, and other women's clothing.", icon: "✿" },
  { id: "childrens-attire", label: "Children's attire", description: "Browse clothing for children and teens.", icon: "♡" },
  { id: "mens-shoes", label: "Men's shoes", description: "Browse shoes for men.", icon: "◉" },
  { id: "womens-shoes", label: "Women's shoes", description: "Browse shoes for women.", icon: "◉" },
  { id: "childrens-shoes", label: "Children's shoes", description: "Browse shoes for children.", icon: "◉" },
  { id: "other-clothing", label: "Other clothing & accessories", description: "Browse everyday wear, fragrances, and jewelry.", icon: "◇" },
  { id: "other-shoes", label: "Other shoes", description: "Browse footwear not listed in a men's, women's, or children's group.", icon: "◉" },
];

export function getProductGroupId(product) {
  if (!product) return null;

  const category = product.category_name || "";
  const name = product.name || "";
  const isChildrenCategory = childrenClothingCategories.has(category);
  const isShoe = category === "Shoes & Footwear"
    || (category === "Baby & Kids" && /\bshoe|trainer|sandal|boot/i.test(name));

  if (isShoe) {
    if (/infant|baby|children|child|kids|boys?|girls?|teenage? (?:boy|boys)/i.test(name)
      || (category === "Baby & Kids" && !menWords.test(name) && !womenWords.test(name))) {
      return "childrens-shoes";
    }
    if (/teenage? (?:girl|girls)|teen (?:girl|girls)/i.test(name) || womenWords.test(name)) return "womens-shoes";
    if (menWords.test(name)) return "mens-shoes";
    return "other-shoes";
  }

  if (!clothingCategories.has(category)) return null;
  if (innerwearWords.test(name)) return "other-clothing";
  if (isChildrenCategory) return "childrens-attire";
  if (menWords.test(name)) return "mens-clothing";
  if (womenWords.test(name)) return "womens-attire";
  return "other-clothing";
}

export function getProductGroup(product) {
  const groupId = getProductGroupId(product);
  return productGroups.find((group) => group.id === groupId) || null;
}

const similarProductStopWords = new Set([
  "adult", "baby", "boy", "boys", "child", "children", "clothing", "cotton",
  "everyday", "for", "girl", "girls", "kids", "men", "mens", "teen", "the",
  "unisex", "wear", "women", "womens",
]);

function getNameKeywords(name) {
  return new Set(
    name.toLowerCase().match(/[a-z]+/g)?.filter((word) => word.length > 2 && !similarProductStopWords.has(word)) || [],
  );
}

export function getProductFamily(product) {
   const name = String(product?.name || "").toLowerCase();
   const audience = getInnerwearAudience(product);
   if (innerwearWords.test(name)) {
     const item = /bra|brassiere/i.test(name) ? "Bras"
       : /bodysuit|sleep suit|sleeveless vest|vest pack|vest/i.test(name) ? "Vests and bodysuits"
       : /boxer|brief/i.test(name) ? "Boxers and briefs"
       : "Innerwear";
     return `${audience || "Other"} · ${item}`;
   }
   if (getProductGroupId(product)?.endsWith("-shoes") || /shoe|slides|sandal|slipper|trainer/i.test(name)) {
     const item = /slides/i.test(name) ? "Slides"
       : /sandal/i.test(name) ? "Sandals"
       : /slipper/i.test(name) ? "Slippers"
       : /sneaker|trainer/i.test(name) ? "Sneakers"
       : /canvas/i.test(name) ? "Casual canvas shoes"
       : "Shoes";
     const audienceName = /baby|infant|newborn/i.test(name) ? "Infants"
       : /teenage? girls?/i.test(name) ? "Teenage girls"
       : /teenage? boys?/i.test(name) ? "Teenage boys"
       : /children|child|kids?|boys?|girls?/i.test(name) ? "Children"
       : womenWords.test(name) ? "Women"
       : menWords.test(name) ? "Men"
       : "Other";
     return `${audienceName} · ${item}`;
   }
   const item = /t-shirt|tee/i.test(name) ? "T-shirts"
     : /trousers|pants|jeans/i.test(name) ? "Trousers and jeans"
     : /dress/i.test(name) ? "Dresses"
     : /skirt/i.test(name) ? "Skirts"
     : /shirt|blouse|polo/i.test(name) ? "Shirts and tops"
     : /hoodie/i.test(name) ? "Hoodies"
     : /cardigan|sweater/i.test(name) ? "Cardigans and sweaters"
     : /shorts/i.test(name) ? "Shorts"
     : /shoe|slide|sandal|slipper/i.test(name) ? "Footwear"
     : "Other clothing";
   const audienceName = /baby|infant|newborn/i.test(name) ? "Babies"
     : /teenage? girls?|teen girls?/i.test(name) ? "Teenage girls"
     : /teenage? boys?|teen boys?/i.test(name) ? "Teenage boys"
     : /child|kid/i.test(name) ? "Children"
     : womenWords.test(name) ? "Women"
     : menWords.test(name) ? "Men"
     : "Other";
   return `${audienceName} · ${item}`;
}

export function getSimilarProducts(product, products, limit = 12) {
   const productGroupId = getProductGroupId(product);
   const productFamily = getProductFamily(product);
   const keywords = getNameKeywords(product.name);
   const candidates = products.filter((candidate) => (
     String(candidate.id) !== String(product.id)
     && getProductFamily(candidate) === productFamily
  ));

   return candidates
     .map((candidate) => {
       const candidateKeywords = getNameKeywords(candidate.name);
       const sharedKeywords = [...keywords].filter((word) => candidateKeywords.has(word)).length;
       const sameGroup = productGroupId && getProductGroupId(candidate) === productGroupId;
       return {
         candidate,
         sharedKeywords,
         sameGroup,
         sameCategory: candidate.category_name === product.category_name,
       };
     })
     .sort((first, second) => (
       Number(second.sameGroup) - Number(first.sameGroup)
       || second.sharedKeywords - first.sharedKeywords
       || Number(second.sameCategory) - Number(first.sameCategory)
       || first.candidate.name.localeCompare(second.candidate.name)
     ))
     .slice(0, limit)
     .map(({ candidate }) => candidate);
}
