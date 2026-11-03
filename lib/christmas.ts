export type ChristmasCategoryId = "trees" | "baubles-bows" | "garlands-wreaths" | "lights-home"

export interface ChristmasCategory {
  id: ChristmasCategoryId
  name: string
  tile: "sage" | "blush" | "sand"
}

export interface ChristmasProduct {
  slug: string
  name: string
  category: ChristmasCategoryId
  /** GBP. `null` until the final price is set. */
  price: number | null
  /** Upper bound when the supplier only lists a price range. */
  priceMax?: number
  /** Empty until supplier photos are added. */
  images: string[]
  description?: string
  details?: string[]
  /** Optional per-value prices (same order as `values`). Overrides `price` when selected. */
  options?: { label: string; values: string[]; prices?: number[] }
  /** Products offered as optional add-ons next to the buy button. `short` names it in the buy label. */
  bundleWith?: { slug: string; optionIndex?: number; short?: string; preselected?: boolean }[]
  /** Short noun for the buy button, e.g. "tree" → "Buy tree + skirt". */
  buyLabel?: string
  bundleTitle?: string
  tagline?: string
  highlights?: { icon: ChristmasIcon; label: string }[]
  loveIt?: { icon: ChristmasIcon; title: string; body: string }[]
  steps?: { title: string; body: string }[]
  specs?: { label: string; value: string }[]
  faq?: { q: string; a: string }[]
  /** Glass call-to-action promoting the wall panel on a room photo. */
  pairWithPanel?: boolean
}

export type ChristmasIcon = "height" | "lights" | "colours" | "remote" | "tree"

export const CHRISTMAS_ORDER_BY = "15 December"

export const christmasCategories: ChristmasCategory[] = [
  { id: "trees", name: "Trees", tile: "sage" },
  { id: "baubles-bows", name: "Baubles & Bows", tile: "blush" },
  { id: "garlands-wreaths", name: "Garlands & Wreaths", tile: "sage" },
  { id: "lights-home", name: "Lights & Home", tile: "sand" },
]

const item = (
  name: string,
  category: ChristmasCategoryId,
  extra: Partial<Omit<ChristmasProduct, "slug" | "name" | "category">> = {},
): ChristmasProduct => ({
  slug: name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  name,
  category,
  price: null,
  images: [],
  ...extra,
})

/** Cart/checkout id. Each priced option gets its own id so different sizes stay separate lines. */
export const christmasCartId = (slug: string, optionIndex?: number) =>
  optionIndex === undefined ? `xmas-${slug}` : `xmas-${slug}--${optionIndex}`

const photos = (base: string, count: number, ext: "avif" | "webp" = "avif") =>
  Array.from({ length: count }, (_, i) => `/images/christmas/${base}-${i + 1}.${ext}`)

const treeBundle: ChristmasProduct["bundleWith"] = [
  { slug: "scallop-rattan-tree-skirt", optionIndex: 0, short: "skirt", preselected: true },
  { slug: "light-up-bristle-treescape-decoration", short: "treescape" },
]

const treeFaq = (power: string, setup: string): NonNullable<ChristmasProduct["faq"]> => [
  {
    q: "Will it arrive before Christmas?",
    a: `Order by ${CHRISTMAS_ORDER_BY} for delivery before Christmas. You'll get a tracking link by email as soon as it ships.`,
  },
  { q: "Does it come with a UK plug?", a: power },
  { q: "How long does it take to put up?", a: setup },
  { q: "Can I return it?", a: "Yes. You have 30 days to return it if it isn't right for your home." },
]

export const christmasProducts: ChristmasProduct[] = [
  item("2ft Rattan Tree", "trees", {
    price: 30,
    images: photos("2ft-rattan-tree", 4),
    description:
      "A natural rattan tree with tiered scalloped edges that brings warm, handcrafted texture to festive styling. Standing 2ft tall, it makes a charming accent on a sideboard, mantelpiece or console.",
    details: ["Height: 2ft", "Hand-woven natural rattan", "Tiered scalloped design", "Colour: Natural"],
  }),
  item("8ft Pre Lit Grand Fir Christmas Tree", "trees", {
    price: 30.5,
    bundleWith: [
      { slug: "scallop-rattan-tree-skirt", optionIndex: 0, short: "skirt", preselected: true },
      { slug: "light-up-bristle-treescape-decoration", short: "treescape" },
    ],
    buyLabel: "tree",
    bundleTitle: "Complete the tree",
    pairWithPanel: true,
    tagline:
      "A full, statement-size tree that's lit and ready the moment you plug it in. Choose a warm white glow or a playful multicolour, and switch modes from the sofa.",
    highlights: [
      { icon: "height", label: "8ft tall" },
      { icon: "lights", label: "2,000 LEDs" },
      { icon: "colours", label: "Warm white or multicolour" },
      { icon: "remote", label: "Remote + foot pedal" },
    ],
    loveIt: [
      {
        icon: "lights",
        title: "Lit and ready",
        body: "The lights are already threaded through the branches on memory wire, so there's no untangling strings every December.",
      },
      {
        icon: "tree",
        title: "Up in minutes",
        body: "A quick-connect pole and a sturdy metal stand mean you build it section by section, then plug in once.",
      },
      {
        icon: "remote",
        title: "Two moods, eight effects",
        body: "Warm white for a cosy evening, multicolour for the kids, and eight effects you can change by remote or foot pedal.",
      },
    ],
    steps: [
      { title: "Set up the stand", body: "Open the metal stand and place it where the tree will go." },
      { title: "Stack the sections", body: "Slot the quick-connect sections together; the lights connect as you go." },
      { title: "Plug in and shape", body: "Switch on, pick your light mode and fluff the branches into shape." },
    ],
    specs: [
      { label: "Height", value: "8ft (244 cm)" },
      { label: "Width", value: "155 cm" },
      { label: "Lights", value: "2,000 LEDs on memory wire" },
      { label: "Light colours", value: "Warm white or multicolour" },
      { label: "Effects", value: "8, with remote control and foot pedal" },
      { label: "Assembly", value: "Quick-connect pole, metal stand" },
      { label: "Power", value: "Mains, UK plug" },
      { label: "Colour", value: "Green" },
    ],
    faq: [
      {
        q: "Will it arrive before Christmas?",
        a: `Order by ${CHRISTMAS_ORDER_BY} for delivery before Christmas. You'll get a tracking link by email as soon as it ships.`,
      },
      { q: "Does it come with a UK plug?", a: "Yes. The tree is mains powered and comes ready to plug into a standard UK socket." },
      {
        q: "How long does it take to put up?",
        a: "Not long. Open the stand, slot the quick-connect sections together and switch on. Fluffing the branches is the longest part.",
      },
      { q: "Can I return it?", a: "Yes. You have 30 days to return it if it isn't right for your home." },
    ],
    images: photos("8ft-pre-lit-grand-fir-tree", 6, "webp"),
    description:
      "Standing at an impressive 8ft tall, this Grand Fir Christmas tree brings instant festive impact to your home. It's pre-lit with 2,000 LED lights, expertly arranged on memory wire for effortless styling year after year. The lights can be set to either warm white or multi-coloured, with eight light settings, plus a foot pedal and remote control for easy operation. A quick-connect power pole and sturdy metal stand ensure fast, hassle-free assembly.",
    details: [
      "Height: 8ft",
      "Pre-lit with 2,000 LED lights on memory wire",
      "Warm white or multi-coloured settings",
      "8 light functions with foot pedal and remote control",
      "Quick-connect power pole and metal stand",
      "Mains powered",
      "Colour: Green",
    ],
  }),
  item("Green Grand Fir 7ft PreLit Christmas Tree", "trees", {
    price: 120.99,
    bundleWith: treeBundle,
    buyLabel: "tree",
    bundleTitle: "Complete the tree",
    pairWithPanel: true,
    tagline:
      "A dense, luxury Grand Fir with 3,049 lifelike tips and 700 lights that answer to your voice. Full enough to fill a corner, easy enough to put up in an evening.",
    highlights: [
      { icon: "height", label: "7ft tall" },
      { icon: "tree", label: "3,049 tips" },
      { icon: "lights", label: "700 voice-activated lights" },
      { icon: "remote", label: "Remote, 8 functions" },
    ],
    loveIt: [
      {
        icon: "tree",
        title: "Full, lifelike branches",
        body: "3,049 PE and PVC tips give a dense, realistic evergreen silhouette with no gaps to hide.",
      },
      {
        icon: "lights",
        title: "Lights that listen",
        body: "700 pre-lit lights switch on and change by voice, so there's no crawling behind the tree for the plug.",
      },
      {
        icon: "remote",
        title: "Eight light functions",
        body: "Pick a steady glow or a gentle twinkle from the remote, then leave it for the evening.",
      },
    ],
    steps: [
      { title: "Set up the stand", body: "Open the stand and place it where the tree will go." },
      { title: "Stack the sections", body: "Slot the sections together; the lights are already in place." },
      { title: "Plug in and shape", body: "Switch on, choose a light function and fluff the branches into shape." },
    ],
    specs: [
      { label: "Height", value: "7ft (210 cm)" },
      { label: "Width × depth", value: "134.5 × 135 cm" },
      { label: "Branch tips", value: "3,049 PE and PVC" },
      { label: "Lights", value: "700, voice-activated" },
      { label: "Functions", value: "8, with remote control" },
      { label: "Power", value: "Mains, UK plug" },
      { label: "Use", value: "Indoor only" },
      { label: "Colour", value: "Green" },
    ],
    faq: treeFaq(
      "Yes. The tree is mains powered and comes ready to plug into a standard UK socket.",
      "Not long. It's designed for easy assembly: open the stand, slot the sections together and switch on.",
    ),
    images: photos("7ft-grand-fir-tree", 4, "webp"),
    description:
      "Transform your living space for the festive season with this 7ft luxury Grand Fir artificial Christmas tree. Crafted with 3,049 PE and PVC branch tips, it offers a dense, realistic evergreen silhouette. It comes pre-lit with 700 voice-activated lights and eight light settings controlled by remote for quick, hassle-free assembly.",
    details: [
      "Height: 7ft (210 cm)",
      "Width 134.5 cm, depth 135 cm",
      "3,049 PE and PVC tips for a full, lifelike appearance",
      "700 voice-activated lights with remote control",
      "8 light functions",
      "Easy assembly",
      "Mains operated",
      "Suitable for indoor use only",
    ],
  }),
  item("Laura Ashley Green 6ft Pre Lit Frosted Christmas Tree", "trees", {
    price: 67.9,
    bundleWith: treeBundle,
    buyLabel: "tree",
    bundleTitle: "Complete the tree",
    pairWithPanel: true,
    tagline:
      "Snow-dusted pine, real-looking pinecones and red berries, with warm micro LEDs already woven in. A classic English country Christmas sized for snug rooms.",
    highlights: [
      { icon: "height", label: "6ft tall" },
      { icon: "lights", label: "250 micro LEDs" },
      { icon: "colours", label: "Frosted, pinecones & berries" },
      { icon: "tree", label: "501 tips" },
    ],
    loveIt: [
      {
        icon: "colours",
        title: "Already decorated",
        body: "Snow frosting, pinecones and vibrant red berries are part of the tree, so it looks styled before you add a single bauble.",
      },
      {
        icon: "lights",
        title: "No tangled lights",
        body: "250 warm, twinkling micro LEDs are woven through the foliage. Plug in and go straight to styling.",
      },
      {
        icon: "height",
        title: "Made for smaller spaces",
        body: "At 109 cm wide it fits living rooms, hallways and dining corners without taking over.",
      },
    ],
    steps: [
      { title: "Set up the stand", body: "Open the sturdy dark metal stand where the tree will go." },
      { title: "Fit the sections", body: "Slot the sections together; the lights are already in place." },
      { title: "Plug in and shape", body: "Switch on and fluff the frosted branches into shape." },
    ],
    specs: [
      { label: "Height", value: "6ft (180 cm)" },
      { label: "Width × depth", value: "109 × 109 cm" },
      { label: "Branch tips", value: "501" },
      { label: "Lights", value: "250 warm micro LEDs" },
      { label: "Cable", value: "200 cm, green" },
      { label: "Timer / dimmable", value: "No / No" },
      { label: "Power", value: "Mains, plugged" },
      { label: "Weight", value: "5.8 kg" },
      { label: "Use", value: "Indoor only" },
    ],
    faq: treeFaq(
      "Yes. It's a plugged, mains-powered tree with a 200 cm green cable that blends into the branches.",
      "Assembly is required, but it's quick: fit the sections onto the metal stand, plug in and shape the branches.",
    ),
    images: photos("6ft-frosted-tree", 6, "webp"),
    description:
      "Bringing festive warmth and rustic, winter-woodland charm to smaller spaces, the Laura Ashley Green 6ft Pre Lit Frosted Christmas Tree creates an enchanting seasonal focal point. It features full pine branches beautifully dusted with snow frosting and dotted with realistic pinecones and vibrant red berries. Pre-lit with warm, twinkling micro LEDs woven throughout the foliage, it eliminates the tangle of lights so you can jump straight to styling your tree. Complete with a sturdy dark metal stand, it brings a cosy, classic English country Christmas feel to snug living rooms, hallways or dining corners.",
    details: [
      "Height: 6ft (180 cm)",
      "Width 109 cm, depth 109 cm",
      "Snow-frosted branches with pinecones and red berries",
      "Pre-lit with 250 warm micro LEDs",
      "501 tips",
      "Sturdy dark metal stand",
      "Cable length 200 cm, green",
      "Weight 5.8 kg",
      "Indoor use only",
    ],
  }),
  item("Laura Ashley Green 7ft Pre Lit Dew Drop Christmas Tree", "trees", {
    price: 230,
    bundleWith: treeBundle,
    buyLabel: "tree",
    bundleTitle: "Complete the tree",
    pairWithPanel: true,
    tagline:
      "Faux pine cones and dewy droplets catch the light from 450 built-in LEDs. Set it up, plug it in and enjoy a warm, twinkling glow.",
    highlights: [
      { icon: "height", label: "7ft tall" },
      { icon: "lights", label: "450 LEDs" },
      { icon: "colours", label: "Dew drops & pine cones" },
      { icon: "tree", label: "122 cm diameter" },
    ],
    loveIt: [
      {
        icon: "colours",
        title: "Dewy, sparkling foliage",
        body: "Faux pine cones and droplets on every branch create an enchanting, frosted-morning look.",
      },
      {
        icon: "lights",
        title: "No string lights needed",
        body: "450 LED lights are built in. Set the tree up, plug it in and it's ready.",
      },
      {
        icon: "tree",
        title: "Timeless sophistication",
        body: "A full 7ft silhouette that suits classic and modern rooms alike.",
      },
    ],
    steps: [
      { title: "Set up the stand", body: "Open the stand and place it where the tree will go." },
      { title: "Stack the sections", body: "Slot the sections together; the lights are already in place." },
      { title: "Plug in and shape", body: "Switch on and fluff the branches into shape." },
    ],
    specs: [
      { label: "Height", value: "7ft (210 cm)" },
      { label: "Diameter", value: "122 cm" },
      { label: "Lights", value: "450 LEDs, pre-lit" },
      { label: "Decoration", value: "Faux pine cones and dew drops" },
      { label: "Power", value: "Mains, UK plug" },
      { label: "Colour", value: "Green" },
    ],
    faq: treeFaq(
      "Yes. The tree is mains powered and comes ready to plug into a standard UK socket.",
      "Not long. Set up the stand, slot the sections together and plug in. There are no string lights to add.",
    ),
    images: photos("7ft-dew-drop-tree", 4, "webp"),
    description:
      "Elevate your holiday decor with this Laura Ashley pre-lit 7ft tree. Its faux foliage sparkles with lights and is adorned with faux pine cones and dewy droplets, creating an enchanting, festive scene. With no need for string lights, simply set the tree up, plug it in, and enjoy the warm, twinkling ambiance that fills your home with timeless sophistication.",
    details: [
      "Height: 7ft (210 cm)",
      "Diameter: 122 cm",
      "Pre-lit with 450 LED lights",
      "Faux pine cones and dew drops",
      "Mains powered",
      "Colour: Green",
    ],
  }),
  item("Light Up Bristle Treescape Decoration", "trees", {
    price: 30,
    images: photos("light-up-bristle-treescape", 4),
    description:
      "Add some Scandi chic to your festive decor with this light-up decoration. It features a wooden base with nine individual trees sat on top. Each features a sprinkling of LED lights for that all-important festive glow.",
    details: ["Wooden base with 9 bristle trees", "Integrated LED lights", "Ideal for mantels and table centrepieces", "Colour: Multi"],
  }),
  item("Scallop Rattan Tree Skirt", "trees", {
    price: 35,
    images: photos("scallop-rattan-tree-skirt", 4),
    description:
      "A scallop edge gives this rattan tree skirt a decorative finish beneath the Christmas tree. Standing 12 inches high, the natural rattan weave brings warmth and texture to festive styling, while the scalloped trim adds more detail than a plain edge. It sits neatly around the base of the tree, concealing the stand and any cables.",
    details: ["Height: 12 inches", "Natural rattan weave", "Scalloped trim", "Comes in three parts for easy storage", "Colour: Brown"],
    options: { label: "Size", values: ["24 Inches", "28 Inches"], prices: [35, 40] },
  }),
  item("Textured Tinsel Tree Skirt", "trees", {
    price: 18,
    images: photos("textured-tinsel-tree-skirt", 3),
    description:
      "Complete the base of your Christmas tree with this round tree skirt, finished in shimmering tinsel for extra sparkle. The textured surface catches the light beautifully, adding a festive finishing touch to your display. It's a simple way to hide the tree stand while keeping the look polished.",
    details: ["Round tree skirt", "Shimmering textured tinsel finish", "Conceals the tree stand", "Colour: Silver"],
  }),

  item("10 Pack Flocked Oversized Shatterproof Baubles", "baubles-bows", {
    price: 10,
    images: photos("10-pack-flocked-oversized-baubles", 3),
    description:
      "Introduce luxurious textures to your tree decor with this 10-pack of velvety flocked and smooth matte baubles. The oversized design makes them ideal for when you want to add real impact to your tree, along a garland or to bring wow-factor to your wreath. Made with a shatterproof construction for safety.",
    details: ["Pack of 10 oversized baubles", "Mix of velvety flocked and smooth matte finishes", "Shatterproof construction", "Colour: Red"],
  }),
  item("50 Pack Glass Baubles", "baubles-bows", {
    price: 25,
    images: photos("50-pack-glass-baubles", 3),
    description:
      "Bring a touch of festive sparkle to your tree with this pack of 50 glass baubles. The assortment includes a mix of shiny, matt, glittered and ribbed finishes for a beautifully coordinated look. Hanging loops are attached for easy decorating.",
    details: ["Pack of 50 glass baubles", "Shiny, matt, glitter and ribbed finishes", "Hanging loops attached", "Colour: Red"],
  }),
  item("6 Pack Satin Stripe Baubles", "baubles-bows", {
    price: 15,
    images: photos("satin-stripe-baubles", 3),
    description:
      "Bring a glamorous pop of colour to your festive décor with this six-pack of jewel-tone baubles. The traditional round shapes come in a striped design with a luxurious satin finish. A pre-tied metallic thread loop means they're ready to hang fresh from the box.",
    details: [
      "Pack of 6 round baubles",
      "Jewel-tone striped design",
      "Luxurious satin finish",
      "Pre-tied metallic thread hanging loop",
      "Colour: Red Mix",
    ],
  }),
  item("80 Pack Mix Shatterproof Baubles", "baubles-bows", {
    price: 20,
    images: photos("80-pack-mix-shatterproof-baubles", 6),
    description:
      "Decorate your tree in one simple and coordinated go with this 80-pack of baubles. It includes a mix of ribbed, glittery and polished round styles, alongside smaller faceted designs in matching finishes. A plastic construction ensures they're shatterproof for added durability. Re-use the box to keep them safely stored away at the end of the season.",
    details: [
      "Pack of 80 coordinated baubles",
      "Ribbed, glitter, polished and faceted styles",
      "Shatterproof plastic construction",
      "Reusable storage box",
    ],
    options: { label: "Colour", values: ["Brown Mix", "Gold"] },
  }),
  item("9 Pack Flocked Ridged Baubles", "baubles-bows", {
    price: 12,
    images: photos("9-pack-flocked-ridged-baubles", 3),
    description:
      "With their flocked surfaces embellished with glittery ridged detailing, these baubles are an opulent choice. They come in a selection of red and green colourways for a traditional feel. Hanging strings add the finishing touch.",
    details: ["Pack of 9 baubles", "Flocked finish with glitter ridged detailing", "Brushed brass-look caps", "Hanging strings included", "Colour: Red Mix"],
  }),
  item("3 Pack Velvet Bows", "baubles-bows", {
    price: 8,
    images: photos("velvet-bows", 3),
    description:
      "Bring a luxurious touch to your Christmas decorations with this set of three velvet bows. Each one is finished with a tonal ribbon loop, so it's ready to hang.",
    details: [
      "Pack of 3 velvet bows",
      "Soft velvet-like fabric",
      "Tonal ribbon hanging loop",
      "Colour: Green",
    ],
  }),
  item("Velvet Bow Decoration", "baubles-bows", {
    price: 18,
    images: photos("velvet-bow-decoration", 5),
    description:
      "This plush velvet bow brings a stylish touch to your living space. Display this chic decoration on your Christmas tree, mantelpiece or front door using the handy hanging loop.",
    details: ["Plush velvet finish", "Colour: Rust", "Integrated hanging loop", "Ideal for trees, mantels, mirrors and doors"],
  }),

  item("6ft Light Up Green Garland", "garlands-wreaths", {
    price: 45,
    images: photos("6ft-light-up-green-garland", 4),
    description:
      "This Cotswold green garland features a lavish display of realistic greenery that lends a timeless feel to your decorations. Pine cones add texture and contrast, while warm white lights create a welcoming glow. This piece is battery-powered for easy operation.",
    details: ["Length: 6ft", "Realistic Cotswold greenery with pine cones", "Warm white LED lights", "Battery operated", "Colour: Green Mix"],
  }),
  item("Pre Lit Red Berry Garland", "garlands-wreaths", {
    price: 12,
    images: photos("pre-lit-red-berry-garland", 3),
    description:
      "Add a sophisticated touch to your festive decorations with this light-up garland. Its natural-looking branches are festooned with sprays of red berries. The warm white LED lights are battery-operated for easy placement — drape it over a mantelpiece or shape it along a wall or shelf.",
    details: ["Pre-lit with warm white LEDs", "Battery operated", "Natural-look branches with red berries", "Colour: Red Mix"],
  }),
  item("Velvet Bell and Bow Garland", "garlands-wreaths", {
    price: 12,
    images: photos("velvet-bell-and-bow-garland", 2),
    description:
      "This velvet garland is decorated with bells and bows for a festive finishing touch. It's a simple way to dress a bannister, mantelpiece or doorway for the season.",
    details: ["Soft velvet finish", "Decorated with bells and bows", "Ideal for bannisters, mantels and doorways", "Colour: Red Mix"],
  }),
  item("Autumn Bow Garland", "garlands-wreaths", {
    price: 30,
    images: photos("autumn-bow-garland", 4),
    description:
      "This autumnal garland brings a stylish seasonal look to your home. It features a mix of faux foliage along with a burgundy-coloured bow and golden bells.",
    details: ["Mixed faux foliage", "Burgundy-coloured bow", "Golden bell accents", "Colour: Green Mix"],
  }),
  item("Plain Bow Wreath", "garlands-wreaths", {
    price: 25,
    images: photos("plain-bow-wreath", 4),
    description:
      "Embrace classic festive styling with this delightful wreath. It's decorated with an oversized red bow for a traditional look. The plain foliage allows the bow to do the talking.",
    details: [
      "Lush green foliage wreath",
      "Oversized red bow",
      "Classic, traditional styling",
      "Colour: Green Mix",
    ],
  }),
  item("Real Winter Berry Wreath", "garlands-wreaths", {
    price: 75,
    images: photos("real-winter-berry-wreath", 4),
    description:
      "Bring seasonal charm to your home with this beautifully crafted winter berry wreath, designed to add a rich and festive touch to any door or wall. Featuring a blend of vibrant berries and complementary foliage, it creates a classic winter look full of colour, texture and natural appeal. Perfect for welcoming guests throughout the festive period, this elegant wreath offers a timeless decorative statement that instantly enhances your Christmas décor.",
    details: [
      "Real foliage and berries",
      "Sourced from trusted, sustainable growers",
      "Ideal for doors and walls",
      "Delivered from late November",
    ],
  }),
  item("Red Berry Wreath", "garlands-wreaths", {
    price: 35,
    images: photos("red-berry-wreath", 4),
    description:
      "'Tis the season to be jolly, and this cheerful wreath helps create a welcoming atmosphere. Lavish sprays of realistic-looking red berries are mounted on a traditional woven base. A hanging loop adds a practical touch.",
    details: ["Realistic red berry sprays", "Traditional woven base", "Hanging loop", "Colour: Red"],
  }),
  item("Set of 3 Mini Bow Wreaths", "garlands-wreaths", {
    price: 25,
    images: photos("mini-bow-wreaths", 4),
    description:
      "Perfect for adding a classic seasonal touch to your decor, these three mini wreaths are decorated with luxe velvet bows. Each festive piece features lush green foliage.",
    details: [
      "Set of 3 mini wreaths",
      "Luxe velvet bows",
      "Lush green foliage",
      "Colour: Green Mix",
    ],
  }),

  item("300 Bright White LED Mains Lights", "lights-home", {
    price: 14,
    images: photos("300-bright-white-led-mains-lights", 4),
    description:
      "A string of 300 bright white LED lights that adds a festive glow to your seasonal decorations. Mains powered for convenience, with a remote control to adjust intensity, set timers and choose from eight flash patterns. The long design is ideal for wrapping around a tree, and it is suitable for indoor and outdoor use.",
    details: [
      "300 bright white LEDs",
      "Mains powered — no batteries needed",
      "Remote control with dimmer and timer",
      "8 flash patterns",
      "Indoor and outdoor use",
    ],
  }),
  item("6 Pack Light Up Clip-On Candle Decorations", "lights-home", {
    price: 20,
    images: photos("clip-on-candle-decorations", 5),
    description:
      "Bring a vintage-inspired feel to your tree with this six-pack of candle decorations. Each piece is made in a clip-on style, with a fluted brass base and a warm white light. They're battery-powered for convenient placement, and come with a handy remote control timer.",
    details: [
      "Pack of 6 clip-on candles",
      "Fluted brass-look base",
      "Warm white LED light",
      "Battery operated with remote control timer",
      "Colour: Gold Mix",
    ],
  }),
  item("Scalloped Rattan Extra Large Pendant Light", "lights-home", {
    price: 150,
    images: photos("scalloped-rattan-pendant-light", 5),
    description:
      "This Scandi-inspired pendant light is made from woven rattan for a natural look. Its scalloped edges give it a graceful shape, while the extra large size makes it a striking addition to any room.",
    details: ["Extra large pendant", "Woven natural rattan", "Scalloped edges", "Scandi-inspired design", "Colour: Brown"],
  }),
  item("Pure Cotton Astley Floral Christmas Bedding Set", "lights-home", {
    price: 45,
    priceMax: 85,
    images: photos("astley-floral-bedding-set", 5),
    description:
      "Celebrate the season in classic style with the Astley Floral Christmas bedding set. Made from pure cotton with a softly brushed finish that brings extra warmth and comfort to cosy winter nights. The reversible design offers two festive looks in one: a charming floral and foliage print on one side and a traditional tartan check on the reverse.",
    details: ["100% pure cotton", "Softly brushed finish", "Reversible: floral print / tartan check", "Colour: Festive Red"],
    options: {
      label: "Size",
      values: ["Single (3 ft)", "Double (4 ft 6)", "King Size (5 ft)", "Super King Size (6 ft)"],
    },
  }),
]

export const featuredChristmasSlugs = [
  "8ft-pre-lit-grand-fir-christmas-tree",
  "10-pack-flocked-oversized-shatterproof-baubles",
  "6ft-light-up-green-garland",
  "300-bright-white-led-mains-lights",
]

export function getChristmasCategory(id: ChristmasCategoryId) {
  return christmasCategories.find((c) => c.id === id)!
}

export function getFeaturedChristmasProducts() {
  return featuredChristmasSlugs
    .map((slug) => christmasProducts.find((p) => p.slug === slug))
    .filter((p): p is ChristmasProduct => Boolean(p))
}

export function getChristmasProduct(slug: string) {
  return christmasProducts.find((p) => p.slug === slug)
}

export function isChristmasCategory(value: string | undefined): value is ChristmasCategoryId {
  return christmasCategories.some((c) => c.id === value)
}

export function formatGBP(value: number) {
  return `£${Number.isInteger(value) ? value : value.toFixed(2)}`
}

/** "£35 – £40" for products with per-option prices, otherwise "£35". */
export function formatPriceRange(product: ChristmasProduct) {
  const prices = product.options?.prices
  if (prices?.length) {
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? formatGBP(min) : `${formatGBP(min)} – ${formatGBP(max)}`
  }
  if (product.price === null) return null
  if (product.priceMax && product.priceMax > product.price)
    return `${formatGBP(product.price)} – ${formatGBP(product.priceMax)}`
  return formatGBP(product.price)
}
