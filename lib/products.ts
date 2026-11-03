export interface ProductColor {
  id: string
  name: string
  hex: string
  image?: string
}

export interface ProductStyle {
  id: string
  name: string
  image: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  currency: string
  category: string
  images: string[]
  features: string[]
  dimensions?: string
  material?: string
  inStock: boolean
  badge?: string
  onSale?: boolean
  colors?: ProductColor[]
  video?: string // URL to a product demo video (MP4)
  videoThumbnail?: string // Thumbnail image for the video
  videoPosition?: number // Gallery slot for the video (defaults to 1, i.e. second)
  styles?: ProductStyle[] // Added styles for product variants
  noShipping?: boolean // Skip shipping for this product
  hidden?: boolean // Hide from product listings (only accessible via direct link)
}

export const categories = [
  { id: "wall-panels", name: "Wall Panels", slug: "wall-panels" },
  { id: "lighting", name: "Lighting", slug: "lighting" },
  { id: "decor", name: "Decor", slug: "decor" },
]

export const products: Product[] = [
  {
    id: "prod_U4kuSjp9pwoOzo",
    slug: "flexible-acoustic-panel",
    name: "Flexible Acoustic Panel",
    description:
      "Revolutionary bendable acoustic panel that adapts to any surface. Perfect for curved walls, pillars, and creative installations.",
    longDescription:
      "Introducing our game-changing Flexible Acoustic Panel—the most versatile wall covering solution on the market. Unlike traditional rigid panels, this innovative design features a specially engineered flexible felt backing that allows the panel to bend and conform to curved surfaces, pillars, and unconventional architectural features. Available in multiple wood tones including Natural Oak, Smoked Oak, Walnut, and Grey Oak, each panel delivers exceptional sound absorption while transforming any space into a design statement. At an incredible 270x110cm, each panel covers nearly 3m² of wall space, making it the most cost-effective premium acoustic solution available.",
    price: 18.50,
    originalPrice: 21.50,
    currency: "EUR",
    category: "wall-panels",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
    ],
    video: "/videos/akupanel-demo.mp4",
    inStock: true,
    badge: "Bestseller",
    onSale: true,
    colors: [
      { id: "natural", name: "Natural", hex: "#D4B896", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png" },
      { id: "walnut", name: "Walnut", hex: "#5D4037", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png" },
      { id: "black", name: "Black", hex: "#2D2D2D", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png" },
      { id: "grey", name: "Grey", hex: "#9E9E9E", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png" },
    ],
    features: [
      "Flexible backing - adapts to any curve",
      "270x110cm coverage per piece",
      "Superior NRC rating of 0.85",
      "Multiple wood tones available",
      "Easy DIY installation",
      "Eco-friendly materials",
    ],
    dimensions: "270cm W x 110cm H x 0.5cm D",
    material: "Premium Wood Veneer with Acoustic Felt Backing",
  },
  // French version of Flexible Acoustic Panel (FR market)
  {
    id: "prod_U2rumuoWXebtgj",
    slug: "flexible-acoustic-panel-fr",
    name: "Panneau Acoustique Flexible",
    description:
      "Panneau acoustique pliable revolutionnaire qui s'adapte a toute surface. Parfait pour les murs courbes, les piliers et les installations creatives.",
    longDescription:
      "Decouvrez notre Panneau Acoustique Flexible revolutionnaire - la solution de revetement mural la plus polyvalente du marche. Contrairement aux panneaux rigides traditionnels, ce design innovant dispose d'un support en feutre flexible specialement concu qui permet au panneau de se plier et de s'adapter aux surfaces courbes, aux piliers et aux caracteristiques architecturales non conventionnelles. Disponible en plusieurs tons de bois dont Chene Naturel, Chene Fume, Noyer et Chene Gris, chaque panneau offre une absorption sonore exceptionnelle tout en transformant n'importe quel espace en une declaration de design. Avec des dimensions incroyables de 270x110cm, chaque panneau couvre pres de 3m2 de surface murale, ce qui en fait la solution acoustique premium la plus rentable disponible.",
    price: 14.38,
    originalPrice: 28.76,
    currency: "EUR",
    category: "wall-panels",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marcenaria%20inteligente%20transforma%20o%20seu%20ambiente.Aqui%2C%20o%20painel%20ripado%20com%20iluminac%CC%A7a%CC%83o%20em%20LED%20vai-yF1rklBPX4o4hpK9rzz1YPn4wkn8tc.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
    ],
    video: "/videos/akupanel-demo.mp4",
    videoThumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-04-18%20a%CC%80s%2022.59.26-qTSnVeumLFNhUeew486WTm9czu8Dxz.png",
    features: [
      "Support flexible - s'adapte a toute courbe",
      "Couverture de 270x110cm par piece",
      "Indice NRC superieur de 0.85",
      "Plusieurs tons de bois disponibles",
      "Installation facile a faire soi-meme",
      "Noyau en feutre acoustique haute densite",
      "Faible emission de formaldehyde (0.05 mg/m3)",
      "Teste et certifie SGS",
    ],
    dimensions: "270cm x 110cm x 2.1cm",
    material: "Lattes en MDF / Support en Feutre Acoustique",
    inStock: true,
    badge: "Meilleure Vente",
    onSale: true,
    colors: [
      { id: "natural-fr", name: "Naturel", hex: "#D4B896", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png" },
      { id: "walnut-fr", name: "Noyer", hex: "#5D4037", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png" },
      { id: "black-fr", name: "Noir", hex: "#2D2D2D", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png" },
      { id: "grey-fr", name: "Gris", hex: "#9E9E9E", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png" },
    ],
  },
  {
    id: "prod_U4kuz3MBgNjf76",
    slug: "oak-slat-wall-panel",
    name: "Oak Slat Wall Panel",
    description:
      "Handcrafted natural oak slat panel with warm tones. Perfect for creating a cosy Scandinavian atmosphere.",
    longDescription:
      "Transform your space with our premium Oak Slat Wall Panel, carefully crafted from sustainable European oak. Each panel features precisely spaced slats that create beautiful shadow and light play throughout the day. The natural grain variations make each panel unique, bringing warmth and texture to any room. Ideal for living rooms, bedrooms or offices seeking an authentic Nordic aesthetic.",
    price: 16.80,
    currency: "GBP",
    category: "wall-panels",
    images: [
      "/oak-wood-slat-wall-panel-natural-texture-scandinav.jpg",
      "/oak-slat-panel-installed-living-room-modern.jpg",
      "/oak-wood-panel-close-up-grain-detail.jpg",
    ],
    features: ["100% European Oak", "Easy Installation System", "Sound Absorption Properties", "FSC Certified Wood"],
    dimensions: "120cm x 60cm x 2cm",
    material: "Solid European Oak",
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: "prod_U4kuODmzE1memh",
    slug: "walnut-acoustic-panel",
    name: "Walnut Acoustic Panel",
    description: "Premium walnut acoustic panel combining elegant aesthetics with superior sound absorption.",
    longDescription:
      "Discover the perfect fusion of form and function with our Walnut Acoustic Panel. Designed with a high-density acoustic core and covered with luxurious American walnut veneer, this panel significantly reduces echo and reverberation whilst adding sophisticated warmth to your interior. The deep chocolate tones of the walnut create a striking visual effect that elevates any contemporary or traditional space.",
    price: 30.00,
    currency: "GBP",
    category: "wall-panels",
    images: [
      "/walnut-acoustic-panel-dark-wood-elegant-modern.jpg",
      "/walnut-panel-home-office-professional.jpg",
      "/acoustic-panel-sound-studio-walnut.jpg",
    ],
    features: ["NRC Rating 0.85", "American Walnut Veneer", "Fire-Resistant Core", "Modular System"],
    dimensions: "120cm x 60cm x 4cm",
    material: "Walnut Veneer / Acoustic Core",
    inStock: true,
    badge: "New",
  },
  {
    id: "prod_U4kuzRsw3B5dBe",
    slug: "minimalist-arc-lamp",
    name: "Minimalist Arc Floor Lamp",
    description: "Elegant floor lamp with curved arc design. Brass finish with linen shade.",
    longDescription:
      "The Minimalist Arc Floor Lamp embodies the essence of Scandinavian design philosophy - beautiful simplicity with thoughtful function. The graceful brass arc extends elegantly over seating areas, providing warm ambient light through its natural linen shade. The weighted marble base ensures stability whilst adding a touch of luxury. Perfect for reading corners or as a statement piece in your living room.",
    price: 189.00,
    currency: "GBP",
    category: "lighting",
    images: ["/minimalist-arc-floor-lamp-brass-linen-shade.jpg"],
    features: ["Adjustable Arc Height", "Natural Linen Shade", "Marble Base", "E27 Bulb Compatible"],
    dimensions: "Height: 180cm, Arc Reach: 120cm",
    material: "Brass / Marble / Linen",
    inStock: true,
  },
  {
    id: "prod_U4kuu8uiPc6s44",
    slug: "organic-ceramic-vase",
    name: "Organic Ceramic Vase",
    description: "Hand-turned ceramic vase with organic curves and matte glaze finish.",
    longDescription:
      "Each Organic Ceramic Vase is individually hand-turned by skilled artisans in our Portuguese studio, making every piece truly unique. The deliberate imperfections and organic curves celebrate the beauty of craftsmanship, whilst the soft matte glaze in our signature clay tone adds understated elegance. Whether displayed empty as a sculptural object or filled with dried botanicals, this vase brings artisanal warmth to any surface.",
    price: 95.00,
    currency: "GBP",
    category: "decor",
    images: [
      "/organic-ceramic-vase-matte-beige-handmade.jpg",
      "/ceramic-vase-dried-flowers-minimalist.jpg",
      "/handmade-pottery-vase-detail-texture.jpg",
    ],
    features: ["Made in Portugal", "Food-Safe Glaze", "Waterproof Interior", "Unique Piece"],
    dimensions: "Height: 28cm, Diameter: 15cm",
    material: "Stoneware Ceramic",
    inStock: true,
    styles: [
      { id: "matte-white", name: "Matte White", image: "/organic-ceramic-vase-matte-beige-handmade.jpg" },
      { id: "natural-dried", name: "Natural with Dried Flowers", image: "/ceramic-vase-dried-flowers-minimalist.jpg" },
      { id: "blue-painted", name: "Blue Painted", image: "/handmade-pottery-vase-detail-texture.jpg" },
    ],
  },
  {
    id: "prod_U4kv4CKxEyo0xu",
    slug: "recessed-led-strip-lighting",
    name: "Recessed LED Strip Kit",
    description: "Warm white 3000K LED strip kit for recessed panel lighting. Self-adhesive with touch dimmer. 8 pieces included.",
    longDescription:
      "Enhance your wall panels with our professional Recessed LED Strip Kit, designed specifically for installation behind panels. This complete 8-piece kit includes LED strips of multiple sizes (18\", 26\", 34\", 42\" - 2 of each), a premium LED driver, touch dimmer and all connection cables. The warm 3000K colour temperature creates a cosy ambiance, whilst the touch dimmer allows adjustment from 10% to 100% brightness with memory function. Features thicker adhesive tape for superior mounting and black aluminium housing that disappears behind panels. The quick connection system makes installation simple. Perfect for bedrooms, living rooms, offices and sofa walls.",
    price: 180.00,
    currency: "GBP",
    category: "lighting",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0333-aAgFPx9MLEjZ1qUmRjKyg0TTMx5AlI.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    ],
    features: [
      "8 LED strips included (2x each size)",
      "Warm white 3000K colour temperature",
      "Touch dimmer 10%-100% with memory",
      "Premium thick self-adhesive tape",
      "Black aluminium housing",
      "LED transformer included",
      "Quick connection cables (2m)",
      "Perfect for recessed installation",
    ],
    dimensions: "18\", 26\", 34\", 42\" strips (2 of each)",
    material: "Black Aluminium / LED",
    inStock: true,
    badge: "Popular",
  },
  {
    id: "prod_U4kvhZVdMgj3T5",
    slug: "wall-preparation-cleaner",
    name: "Wall Preparation Cleaner",
    description: "Professional foaming cleaner for surface preparation before installation. Removes dirt, grease and stains without damaging surfaces.",
    longDescription:
      "Perfectly prepare your walls before installing acoustic panels with our professional-grade Foaming Cleaner. This powerful yet gentle formula removes dirt, scuffs, grease, grime, markers, crayons, nicotine residue, fingerprints and makeup without damaging painted surfaces. The clinging foam technology ensures no drips and quick cleaning without scrubbing. Safe on most painted walls, doors, skirting boards, cabinets and washable wallpaper. Essential for achieving the best adhesion and finish when installing wall panels.",
    price: 15.50,
    currency: "GBP",
    category: "decor",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05-OrCyYhiGFlNOZJ6uMPv729KBWN6jHG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05E-ImqfbNfWohct5EliXBJBJy3edDfAHq.jpg",
    ],
    features: [
      "Quick cleaning without scrubbing",
      "Clinging foam - no drips",
      "Safe on painted walls",
      "Removes dirt, grease, markers",
      "Removes nicotine residue",
      "Works on furniture and skirting boards",
      "510g (18 oz)",
      "Professional quality",
    ],
    dimensions: "510g (18 oz)",
    material: "Foaming Cleaning Solution",
    inStock: true,
    badge: "Essential",
  },
  // French version of LED Strip Kit
  {
    id: "prod_U2rv6g1To7VPTZ",
    slug: "recessed-led-strip-lighting-fr",
    name: "Kit Ruban LED Encastre",
    description: "Ruban LED blanc chaud 3000K pour eclairage de panneaux encastres. Auto-adhesif avec variateur tactile. 8 pieces incluses.",
    longDescription:
      "Ameliorez vos panneaux muraux avec notre Kit Ruban LED Encastre professionnel, concu specifiquement pour l'installation derriere les panneaux. Ce kit complet de 8 pieces comprend des rubans LED de plusieurs tailles (18\", 26\", 34\", 42\" - 2 de chaque), un driver LED premium, un variateur tactile, et tous les cables de connexion. La temperature de couleur chaude de 3000K cree une ambiance chaleureuse, tandis que le variateur tactile permet un reglage de 10% a 100% de luminosite avec fonction memoire. Caracterise par un ruban adhesif plus epais pour un montage superieur et un boitier en aluminium noir qui disparait derriere les panneaux. Le systeme de connexion rapide rend l'installation simple. Parfait pour chambres, salons, bureaux et murs de canape.",
    price: 150.49,
    currency: "EUR",
    category: "lighting",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0333-aAgFPx9MLEjZ1qUmRjKyg0TTMx5AlI.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    ],
    features: [
      "8 rubans LED inclus (2x chaque taille)",
      "Temperature de couleur blanc chaud 3000K",
      "Variateur tactile 10%-100% avec memoire",
      "Ruban auto-adhesif epais premium",
      "Boitier en aluminium noir",
      "Transformateur LED inclus",
      "Cables de connexion rapide (2m)",
      "Parfait pour installation encastree",
    ],
    dimensions: "18\", 26\", 34\", 42\" rubans (2 de chaque)",
    material: "Aluminium Noir / LED",
    inStock: true,
    badge: "Populaire",
  },
  // UK version of Wall Cleaner (GBP)
  {
    id: "prod_UK_wall_cleaner",
    slug: "wall-preparation-cleaner-uk",
    name: "STARWAX Anti-Mould Wall Cleaner 500ML",
    description: "Ideal for removing mould from walls, ceilings, and window frames. No rinsing required, odourless, doesn't discolour surfaces. Bleach-free.",
    longDescription:
      "STARWAX Anti-Mould Wall Cleaner 500ML - Ideal for removing mould from walls, ceilings, and window frames in living spaces. Ready to use: no rinsing required, no unpleasant odour, doesn't stain. Fungicidal according to EN1650 and EN13697 in 15 min at 20C. Bactericidal according to EN1276 and EN13697 in 5 min at 20C. Virucidal on enveloped viruses according to EN 14476 in 1 min at 20C. Suitable for bedrooms, living rooms, painted walls and ceilings, wallpaper, tiles, and joints.",
    price: 14.49,
    currency: "GBP",
    category: "decor",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05-OrCyYhiGFlNOZJ6uMPv729KBWN6jHG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05E-ImqfbNfWohct5EliXBJBJy3edDfAHq.jpg",
    ],
    features: [
      "No rinsing required, odourless",
      "Doesn't discolour surfaces",
      "Fungicidal according to EN1650 and EN13697 in 15 min",
      "Bactericidal according to EN1276 and EN13697 in 5 min",
      "Virucidal according to EN 14476 in 1 min",
      "Bleach-free",
      "500ml spray bottle",
      "Made in France",
    ],
    dimensions: "500 ml",
    material: "Anti-Mould Solution",
    inStock: true,
    badge: "Essential",
  },
  // UK version of LED Strip Kit (GBP)
  {
    id: "prod_UK_led_strip",
    slug: "recessed-led-strip-lighting-uk",
    name: "Recessed LED Strip Kit",
    description: "Warm white 3000K LED strip for recessed panel lighting. Self-adhesive with touch dimmer. 8 pieces included.",
    longDescription:
      "Enhance your wall panels with our professional Recessed LED Strip Kit, designed specifically for installation behind panels. This complete 8-piece kit includes LED strips of multiple sizes (18\", 26\", 34\", 42\" - 2 of each), a premium LED driver, touch dimmer, and all connection cables. The warm 3000K colour temperature creates a cosy ambiance, while the touch dimmer allows adjustment from 10% to 100% brightness with memory function.",
    price: 126.00,
    currency: "GBP",
    category: "lighting",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0333-aAgFPx9MLEjZ1qUmRjKyg0TTMx5AlI.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    ],
    features: [
      "8 LED strips included (2x each size)",
      "Warm white 3000K colour temperature",
      "Touch dimmer 10%-100% with memory",
      "Premium thick self-adhesive tape",
      "Black aluminium housing",
      "LED transformer included",
      "Quick connection cables (2m)",
      "Perfect for recessed installation",
    ],
    dimensions: "18\", 26\", 34\", 42\" strips (2 of each)",
    material: "Black Aluminium / LED",
    inStock: true,
    badge: "Popular",
  },
  // French version of Wall Cleaner
  {
    id: "prod_U2rvHwRWU8IYTd",
    slug: "wall-preparation-cleaner-fr",
    name: "STARWAX Anti-moisissures pour murs et pieces a vivre 500ML",
    description: "Ideal pour eliminer les moisissures sur les murs, plafonds, contours de fenetres des pieces a vivre. Sans rincage, sans odeur incommodante, ne decolore pas les supports. Sans Javel.",
    longDescription:
      "STARWAX Anti-moisissures pour murs et pieces a vivre 500ML - Ideal pour eliminer les moisissures sur les murs, plafonds, contours de fenetres des pieces a vivre. Pret a l'emploi : sans rincage, sans odeur incommodante, ne tache pas. Fongicide selon EN1650 et EN13697 en 15 min a 20C. Bactericide selon les normes EN1276 et EN13697 en 5 min a 20C. Virucide sur virus enveloppes selon la norme EN 14476 en 1 min a 20C. Utilisable sur chambres, salon, murs et plafonds peints, papier vinyl, contours de fenetres, surfaces lavables dures. Flacon pulverisateur de 500ml. Sans Javel.",
    price: 14.88,
    currency: "EUR",
    category: "decor",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05-OrCyYhiGFlNOZJ6uMPv729KBWN6jHG.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN05E-ImqfbNfWohct5EliXBJBJy3edDfAHq.jpg",
    ],
    features: [
      "Sans rincage, sans odeur incommodante",
      "Ne decolore pas les supports",
      "Fongicide selon EN1650 et EN13697 en 15 min",
      "Bactericide selon EN1276 et EN13697 en 5 min",
      "Virucide selon EN 14476 en 1 min",
      "Sans Javel",
      "Flacon pulverisateur 500ml",
      "Fabrique en France",
    ],
    dimensions: "500 ml",
    material: "Solution Anti-moisissures",
    inStock: true,
    badge: "Essentiel",
  },
  // Tableau Madrid - Stade Santiago Bernabéu (FR only)
  {
    id: "prod_U2rvgYxfRGaGl7",
    slug: "tableau-madrid-santiago-bernabeu",
    name: "Tableau Madrid Stade Santiago Bernabéu en Noir et Blanc",
    description:
      "Tableau décoratif exclusif du Stade Santiago Bernabéu en noir et blanc. Impression haute définition sur papier photographique 240g. Disponible en plusieurs tailles et types de finition.",
    longDescription:
      "Avec un design exclusif et une finition de haute qualité, le Tableau Madrid Stade Santiago Bernabéu en Noir et Blanc va sublimer la décoration de votre intérieur avec un style moderne, élégant et qui vous ressemble. Choisissez votre moldure et les dimensions souhaitées ci-dessous. Impression en haute définition sur papier photographique 240g avec des couleurs intenses, soigneusement emballé et envoyé en tube postal résistant. Impression avec encre écologique et non toxique.",
    price: 87.90,
    originalPrice: 109.90,
    currency: "EUR",
    category: "decor",
    hidden: true,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_50_05_829_11_2_1_169_lr01427destaque-3rTBVWdA4H0XQmcV9lYEdKBX5Mv0eo.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17_39_26_187_lr01427-filete-preta%20%281%29-9tbzZKTDsBeo3Zh5UCm6vWsOFY4A2q.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_50_13_758_11_2_1_119_lr01427ambiente03%20%282%29-rKVz9Zs6yc0iLmDktTFO4xdy6Wk4Rh.webp",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_ho4ec5ho4ec5ho4e-2UOOEE3fBhit8jtumSwUCqnRq9qgrb.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_iflkykiflkykiflk-14ui5eCJO8pRc8M5c39UDE3wbYdvWl.png",
    ],
    inStock: true,
    badge: "Nouveau",
    onSale: true,
    colors: [
      { id: "noir", name: "Noir", hex: "#1a1a1a" },
      { id: "blanc", name: "Blanc", hex: "#f5f5f5" },
      { id: "naturel", name: "Naturel", hex: "#D4B896" },
      { id: "freijo", name: "Freijó", hex: "#8B6343" },
      { id: "noyer", name: "Noyer", hex: "#3E2010" },
    ],
    styles: [
      {
        id: "moldura-filete",
        name: "1. Moldure Filet",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.45.03-NTFToD4wrDKpV1RFrnvW7mTw9peTDT.png",
      },
      {
        id: "moldura-premium-vidro",
        name: "2. Moldure Premium avec Verre",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.45.23-G7bxIKBuZznu8W7rUxPelmIGP6JOPH.png",
      },
      {
        id: "moldura-premium-sem-vidro",
        name: "3. Moldure Premium sans Verre",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.45.23-G7bxIKBuZznu8W7rUxPelmIGP6JOPH.png",
      },
      {
        id: "canvas",
        name: "4. Canvas avec Cadre",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.46.39-g1dRjZY79eMT0M1qQGmgtaYlDPnfzu.png",
      },
      {
        id: "papel-fotografico",
        name: "5. Papier Photographique",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.46.39-g1dRjZY79eMT0M1qQGmgtaYlDPnfzu.png",
      },
      {
        id: "placa-decorativa",
        name: "6. Plaque Décorative",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-02-24%20a%CC%80s%2018.44.29-h5L4XO5SWUCqL2AlrrlxdX377ONxH6.png",
      },
    ],
    features: [
      "Impression haute définition sur papier 240g",
      "Disponible en 6 tailles : 21x30, 30x40, 40x60, 50x70, 70x100, 100x150 cm",
      "6 types de finition disponibles",
      "5 couleurs de moldure disponibles",
      "Encre écologique et non toxique",
      "Emballage soigné en tube postal résistant",
      "Fait à la main avec soin",
      "Certificat de qualité inclus",
    ],
    dimensions: "21x30 cm | 30x40 cm | 40x60 cm | 50x70 cm | 70x100 cm | 100x150 cm",
    material: "Papier Photographique 240g / Bois de Pin 100% reboisement",
  },

  // UK version of Flexible Acoustic Panel (UK market - GBP)
  {
    id: "prod_UK_flexible_acoustic",
    slug: "flexible-acoustic-panel-uk",
    name: "Flexible Acoustic Panel",
    description:
      "Revolutionary bendable acoustic panel that adapts to any surface. Perfect for curved walls, pillars, and creative installations.",
    longDescription:
      "Introducing our game-changing Flexible Acoustic Panel—the most versatile wall covering solution on the market. Unlike traditional rigid panels, this innovative design features a specially engineered flexible felt backing that allows the panel to bend and conform to curved surfaces, pillars, and unconventional architectural features. Available in multiple wood tones including Natural Oak, Smoked Oak, Walnut, and Grey Oak, each panel delivers exceptional sound absorption while transforming any space into a design statement. At an incredible 270x110cm, each panel covers nearly 3m² of wall space, making it the most cost-effective premium acoustic solution available.",
    price: 14.50,
    originalPrice: 28.98,
    currency: "GBP",
    category: "wall-panels",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marcenaria%20inteligente%20transforma%20o%20seu%20ambiente.Aqui%2C%20o%20painel%20ripado%20com%20iluminac%CC%A7a%CC%83o%20em%20LED%20vai-yF1rklBPX4o4hpK9rzz1YPn4wkn8tc.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible%20acustic%20panel-fIRiWckcEuGm5PWQUPK5qg0VWTtxPO.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mixpolprofile-aranzacja-regal-polki05b-SWfMnb8xMhdL6v2lI9WCkTI7HUvzCU.jpg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
    ],
    video: "/videos/akupanel-demo.mp4",
    videoThumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202026-04-18%20a%CC%80s%2022.59.26-qTSnVeumLFNhUeew486WTm9czu8Dxz.png",
    videoPosition: 2,
    features: [
      "Flexible backing - adapts to any curve",
      "270x110cm coverage per piece",
      "Superior NRC rating of 0.85",
      "Multiple wood tones available",
      "Easy DIY installation",
      "High-density acoustic felt core",
      "Low formaldehyde emission (0.05 mg/m³)",
      "SGS tested and certified",
    ],
    dimensions: "270cm x 110cm x 2.1cm",
    material: "MDF Slats / Acoustic Felt Backing",
    inStock: true,
    badge: "Bestseller",
    onSale: true,
    colors: [
      { id: "natural-uk", name: "Natural", hex: "#D4B896", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png" },
      { id: "walnut-uk", name: "Walnut", hex: "#5D4037", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png" },
      { id: "black-uk", name: "Black", hex: "#2D2D2D", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png" },
      { id: "grey-uk", name: "Grey", hex: "#9E9E9E", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png" },
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

// Get only visible products (exclude hidden FR products)
export function getVisibleProducts(): Product[] {
  return products.filter((p) => !p.hidden)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category && !p.hidden)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.badge && !p.hidden)
}

// FR Market Functions - Show all products but replace Flexible Acoustic Panel with FR version
export function getVisibleProductsFrMarket(): Product[] {
  return products.filter((p) => {
    // Hide the English version of Flexible Acoustic Panel
    if (p.slug === "flexible-acoustic-panel") return false
    // Hide hidden products
    if (p.hidden) return false
    return true
  })
}

export function getProductsByCategoryFrMarket(category: string): Product[] {
  return products.filter((p) => {
    if (p.slug === "flexible-acoustic-panel") return false
    if (p.hidden) return false
    return p.category === category
  })
}

export function getFeaturedProductsFrMarket(): Product[] {
  return products.filter((p) => {
    if (p.slug === "flexible-acoustic-panel") return false
    if (p.hidden) return false
    return p.badge
  })
}

// UK Market Functions - Show GBP products only
export function getVisibleProductsUKMarket(): Product[] {
  return products.filter((p) => {
    if (p.hidden) return false
    // Only show GBP products for UK market
    return p.currency === "GBP"
  })
}

export function getProductsByCategoryUKMarket(category: string): Product[] {
  return products.filter((p) => {
    if (p.hidden) return false
    if (p.currency !== "GBP") return false
    return p.category === category
  })
}

export function getFeaturedProductsUKMarket(): Product[] {
  return products.filter((p) => {
    if (p.hidden) return false
    // Only show GBP products with badges for UK market
    return p.badge && p.currency === "GBP"
  })
}
