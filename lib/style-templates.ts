export type StyleCategory = "staging" | "lighting" | "exterior" | "atmosphere";

export interface StyleTemplate {
  id: string;
  name: string;
  description: string;
  category: StyleCategory;
  thumbnail: string;
  prompt: string;
  comingSoon?: boolean;
}

// Room types for context in prompts
export interface RoomTypeOption {
  id: string;
  label: string;
  icon: string; // Tabler icon name
  description: string;
}

// İç Mekan (Indoor) room types
export const INDOOR_ROOM_TYPES: RoomTypeOption[] = [
  {
    id: "living-room",
    label: "Oturma Odası",
    icon: "IconSofa",
    description: "Salon ve oturma alanları",
  },
  {
    id: "bedroom",
    label: "Yatak Odası",
    icon: "IconBed",
    description: "Yatak odaları ve misafir odaları",
  },
  {
    id: "kitchen",
    label: "Mutfak",
    icon: "IconToolsKitchen2",
    description: "Mutfak ve yemek pişirme alanları",
  },
  {
    id: "bathroom",
    label: "Banyo",
    icon: "IconBath",
    description: "Banyo ve tuvalet",
  },
  {
    id: "dining-room",
    label: "Yemek Odası",
    icon: "IconArmchair",
    description: "Yemek alanları",
  },
  {
    id: "office",
    label: "Ofis",
    icon: "IconDesk",
    description: "Ev ofisi ve çalışma odası",
  },
  {
    id: "hallway",
    label: "Koridor",
    icon: "IconDoor",
    description: "Koridor, hol ve giriş",
  },
  {
    id: "basement",
    label: "Bodrum",
    icon: "IconStairs",
    description: "Bodrum katı",
  },
  {
    id: "laundry-room",
    label: "Çamaşır Odası",
    icon: "IconWashMachine",
    description: "Çamaşır odası",
  },
  {
    id: "childrens-room",
    label: "Çocuk Odası",
    icon: "IconMoodKid",
    description: "Çocuk odaları ve oyun odaları",
  },
  {
    id: "walk-in-closet",
    label: "Giyinme Odası",
    icon: "IconHanger",
    description: "Giyinme odası ve gardırop",
  },
  {
    id: "attic",
    label: "Çatı Katı",
    icon: "IconBuildingSkyscraper",
    description: "Çatı katı ve tavan arası",
  },
  {
    id: "gym",
    label: "Spor Odası",
    icon: "IconBarbell",
    description: "Ev spor salonu",
  },
];

// Dış Mekan (Outdoor) room types
export const OUTDOOR_ROOM_TYPES: RoomTypeOption[] = [
  {
    id: "facade",
    label: "Cephe",
    icon: "IconHome",
    description: "Bina dış cephesi",
  },
  {
    id: "garden",
    label: "Bahçe",
    icon: "IconPlant",
    description: "Bahçe ve peyzaj",
  },
  {
    id: "backyard",
    label: "Arka Bahçe",
    icon: "IconTree",
    description: "Arka bahçe alanı",
  },
  {
    id: "parking",
    label: "Otopark",
    icon: "IconCar",
    description: "Otopark ve garaj girişi",
  },
  {
    id: "road",
    label: "Sokak Görünümü",
    icon: "IconRoad",
    description: "Sokak ve cadde görünümü",
  },
  {
    id: "aerial",
    label: "Havadan Görünüm",
    icon: "IconDrone",
    description: "Drone/havadan çekim",
  },
  {
    id: "pool-area",
    label: "Havuz",
    icon: "IconPool",
    description: "Havuz alanı",
  },
  {
    id: "terrace",
    label: "Teras",
    icon: "IconSun",
    description: "Teras ve balkon",
  },
  {
    id: "balcony",
    label: "Balkon",
    icon: "IconBuildingBridge",
    description: "Balkon görünümü",
  },
];

// Combined room types for backward compatibility
export const ROOM_TYPES: RoomTypeOption[] = [
  ...INDOOR_ROOM_TYPES,
  ...OUTDOOR_ROOM_TYPES,
];

// Get room types by environment
export function getRoomTypesByEnvironment(
  env: "indoor" | "outdoor"
): RoomTypeOption[] {
  return env === "indoor" ? INDOOR_ROOM_TYPES : OUTDOOR_ROOM_TYPES;
}

export function getRoomTypeById(id: string): RoomTypeOption | undefined {
  return ROOM_TYPES.find((r) => r.id === id);
}

// AI Tools Configuration - shared between components
export interface AIToolConfig {
  id: string;
  icon: string; // Tabler icon name
  title: string;
  description: string;
  color: string;
  bgColor: string;
  promptAddition: string;
}

export const AI_TOOLS_CONFIG: AIToolConfig[] = [
  {
    id: "replaceFurniture",
    icon: "IconArmchair2",
    title: "Eşyaları Değiştir",
    description: "Mevcut mobilyaları yenileriyle değiştirir",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    promptAddition: "", // Style template handles this
  },
  {
    id: "cleanHands",
    icon: "IconHandStop",
    title: "Elleri Temizle",
    description: "Yansımadaki elleri siler",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    promptAddition: "Remove any hands, fingers, or human limbs visible in mirror reflections, glass surfaces, or any reflective surfaces. Make the reflections appear natural without any human presence.",
  },
  {
    id: "cleanCamera",
    icon: "IconCamera",
    title: "Kamerayı Temizle",
    description: "Tripod ve ekipmanı siler",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    promptAddition: "Remove any camera equipment, tripods, camera bags, lighting equipment, or photography gear visible in the image or reflections. Make the space appear as if no photography equipment was ever present.",
  },
  {
    id: "turnOffScreens",
    icon: "IconDeviceTv",
    title: "Ekranları Kapat",
    description: "TV ve monitörleri karartır",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    promptAddition: "Turn off all TV screens, computer monitors, and electronic displays. Make all screens appear as black/off while maintaining the device frames and their positions in the room.",
  },
  {
    id: "lensCorrection",
    icon: "IconFocusCentered",
    title: "Lens Düzeltme",
    description: "Geniş açı distorsiyonunu giderir",
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    promptAddition: "Correct any wide-angle lens distortion. Make all vertical lines (walls, doors, windows) perfectly straight and parallel. Remove barrel distortion and make the room appear with natural perspective.",
  },
  {
    id: "whiteBalance",
    icon: "IconSun",
    title: "Beyaz Dengesi",
    description: "Renk sıcaklığını optimize eder",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    promptAddition: "Correct the white balance to achieve natural, neutral colors. Remove any yellow, blue, or green color casts. Make whites appear pure white and ensure accurate color representation throughout the image.",
  },
];

export function getAIToolConfig(id: string): AIToolConfig | undefined {
  return AI_TOOLS_CONFIG.find((t) => t.id === id);
}

// ProjectAITools type for reference (matches schema.ts)
interface AIToolsState {
  replaceFurniture: boolean;
  cleanHands: boolean;
  cleanCamera: boolean;
  turnOffScreens: boolean;
  lensCorrection: boolean;
  whiteBalance: boolean;
}

// Generate a prompt with room type context, AI tools, and architectural preservation
export function generatePrompt(
  template: StyleTemplate | null,
  roomType: string | null,
  environment?: "indoor" | "outdoor",
  aiTools?: AIToolsState
): string {
  const preserveStructure =
    "Do not move, remove, or modify windows, walls, doors, or any architectural elements. Keep the room layout exactly as shown.";

  let promptParts: string[] = [];

  // Add room type and environment context
  if (roomType) {
    const roomLabel = roomType.replace(/-/g, " ");
    const envLabel = environment === "outdoor" ? "outdoor" : "indoor";
    promptParts.push(`This is an ${envLabel} ${roomLabel}.`);
  }

  // Add style template prompt
  if (template) {
    if (environment === "outdoor") {
      // For outdoor, we ONLY want to change specific furniture/items, NOT the whole atmosphere/walls
      // User request: "outdoor icin secilen resimlerde secilen stil asla uygulanmamali, cunku o outdoor... sadece esyalari degistirsin"
      promptParts.push(
        `Update the furniture and movable items to match ${template.name} style. Do NOT apply interior design styles to the exterior building or landscape. Keep the facade, plants, and structural elements exactly as is.`
      );
    } else {
      // For indoor, apply the full style prompt
      promptParts.push(template.prompt);
    }
  }

  // Add AI tool prompt additions
  if (aiTools) {
    for (const tool of AI_TOOLS_CONFIG) {
      const toolId = tool.id as keyof AIToolsState;
      if (aiTools[toolId] && tool.promptAddition) {
        promptParts.push(tool.promptAddition);
      }
    }
  }

  // Always add structure preservation
  promptParts.push(preserveStructure);

  return promptParts.join(" ");
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  // Staging Styles
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light, airy spaces with natural wood and minimal decor",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Scandinavian-style interior. Add light wooden furniture, white and neutral tones, natural textures like linen and wool, minimalist decor with clean lines. Include plants for freshness. The space should feel bright, calm, and inviting with excellent natural lighting.",
  },
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean lines, open spaces, and curated simplicity",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop",
    prompt:
      "Transform into a modern minimalist interior. Use sleek, contemporary furniture with clean geometric lines. Apply a neutral color palette with occasional bold accent pieces. Keep surfaces uncluttered with only essential decorative items. Incorporate hidden storage solutions and seamless finishes. The space should feel sophisticated, uncluttered, and purposefully designed.",
  },
  {
    id: "industrial-loft",
    name: "Industrial Loft",
    description: "Raw materials, exposed elements, urban character",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    prompt:
      "Transform into an industrial loft style. Feature exposed brick walls, metal accents, and reclaimed wood elements. Add vintage leather furniture, Edison bulb lighting fixtures, and metal shelving. Use a color palette of charcoal, rust, and warm browns. Include raw concrete or weathered wood flooring. The space should feel urban, authentic, and full of character.",
  },
  {
    id: "coastal-hamptons",
    name: "Coastal Hamptons",
    description: "Breezy elegance with nautical touches and soft blues",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Coastal Hamptons style interior. Use a palette of whites, soft blues, and sandy beiges. Add linen upholstery, wicker baskets, and natural fiber rugs. Include nautical accents like rope details, driftwood decor, and sea-glass accessories. Feature light wood furniture and sheer curtains. The space should feel fresh, relaxed, and elegantly beachy.",
  },
  {
    id: "mid-century-modern",
    name: "Mid-Century Modern",
    description: "Retro charm with iconic furniture and warm wood tones",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Mid-Century Modern interior. Feature iconic furniture designs with tapered legs and organic curves. Use warm wood tones like teak and walnut combined with bold accent colors like mustard, teal, and orange. Add statement lighting fixtures, abstract art, and geometric patterns. Include indoor plants in ceramic planters. The space should feel retro yet timeless, warm and inviting.",
  },
  {
    id: "bohemian-eclectic",
    name: "Bohemian Eclectic",
    description: "Layered textures, global influences, artistic flair",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Bohemian Eclectic interior. Layer rich textures with Moroccan rugs, macramé wall hangings, and embroidered textiles. Include vintage and globally-inspired furniture pieces. Add an abundance of plants in decorative pots. Use warm, earthy colors mixed with jewel tones. Feature handcrafted accessories, candles, and artistic collections. The space should feel warm, collected, and full of personality.",
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Japanese minimalism meets Scandinavian warmth",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1598928506311-c55ez84a6026?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Japandi-style interior. Blend Japanese minimalism with Scandinavian functionality. Use natural materials like light wood, bamboo, and stone. Feature low-profile furniture with clean lines. Apply a muted palette of soft whites, warm greys, and natural browns. Add subtle greenery and handcrafted ceramic pieces. The space should feel serene, balanced, and purposefully simple.",
  },
  {
    id: "luxury-contemporary",
    name: "Luxury Contemporary",
    description: "Sophisticated elegance with premium materials",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    prompt:
      "Transform into a luxury contemporary interior. Feature high-end materials like marble, velvet, and polished metals. Add statement furniture pieces with elegant curves. Use a sophisticated palette of deep greys, rich blues, and gold accents. Include designer lighting fixtures and curated art pieces. Add silk throw pillows and plush area rugs. The space should feel opulent, refined, and magazine-worthy.",
  },
  {
    id: "farmhouse-modern",
    name: "Modern Farmhouse",
    description: "Rustic charm with contemporary comfort",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Modern Farmhouse interior. Combine rustic elements like reclaimed wood beams and shiplap walls with modern comforts. Add comfortable linen sofas, vintage-inspired lighting, and galvanized metal accents. Use a warm palette of whites, creams, and natural wood tones. Include fresh flowers, woven baskets, and antique accessories. The space should feel cozy, welcoming, and timelessly charming.",
  },
  {
    id: "art-deco",
    name: "Art Deco",
    description: "Glamorous geometry with bold patterns and metallics",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=400&h=300&fit=crop",
    prompt:
      "Transform into an Art Deco interior. Feature bold geometric patterns, luxurious materials, and glamorous metallics. Add velvet upholstery in jewel tones like emerald, sapphire, and ruby. Include mirrored surfaces, gold or brass accents, and statement chandeliers. Use dramatic wallpaper with fan or sunburst motifs. The space should feel opulent, theatrical, and distinctly elegant.",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Warm terracotta, arched details, and sunny vibes",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Mediterranean interior. Feature terracotta tiles, whitewashed walls, and wrought iron accents. Add comfortable seating with colorful cushions in blues and ochres. Include olive branches, ceramic pottery, and rustic wooden furniture. Use natural textures like jute and linen. Add arched doorways or mirrors. The space should feel sun-drenched, relaxed, and full of warmth.",
  },
  {
    id: "transitional",
    name: "Transitional",
    description: "Perfect balance of traditional and contemporary",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=300&fit=crop",
    prompt:
      "Transform into a Transitional interior. Blend traditional elegance with contemporary simplicity. Feature classic furniture silhouettes with modern fabrics and finishes. Use a neutral color palette with subtle texture variations. Add elegant crown molding combined with sleek hardware. Include comfortable sofas, understated art, and refined accessories. The space should feel timeless, balanced, and universally appealing.",
  },

  // Lighting Styles
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm sunset lighting for cozy ambiance",
    category: "lighting",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
    prompt:
      "Apply warm golden hour lighting throughout the space. Cast soft, amber-toned sunlight streaming through windows. Create gentle shadows and warm highlights on surfaces. The overall mood should be cozy, inviting, and romantically lit as if at sunset. Enhance the warmth of wood tones and textiles.",
  },
  {
    id: "bright-airy",
    name: "Bright & Airy",
    description: "Maximize natural light for open feel",
    category: "lighting",
    thumbnail:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    prompt:
      "Enhance the space with abundant natural light. Brighten all surfaces while maintaining natural color accuracy. Eliminate harsh shadows and dark corners. The space should feel open, fresh, and filled with clean daylight. Perfect for showcasing the full potential of the room.",
  },

  // Exterior Styles
  {
    id: "curb-appeal",
    name: "Curb Appeal",
    description: "Enhance exterior attractiveness",
    category: "exterior",
    thumbnail:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    prompt:
      "Enhance the exterior curb appeal. Add well-manicured landscaping with colorful flowers and healthy green shrubs. Include a welcoming pathway, updated outdoor lighting, and a fresh-looking front door. Show the property in optimal lighting conditions. The exterior should look inviting, well-maintained, and ready to impress.",
  },
  {
    id: "twilight-exterior",
    name: "Twilight Shot",
    description: "Dramatic evening exterior lighting",
    category: "exterior",
    thumbnail:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
    prompt:
      "Transform into a stunning twilight exterior shot. Show the property at dusk with a deep blue sky transitioning to warm tones at the horizon. Illuminate all interior lights creating a warm glow from windows. Add subtle exterior landscape lighting. The image should feel magical, inviting, and showcase the property's evening presence.",
  },

  // Atmosphere Styles
  {
    id: "declutter",
    name: "Declutter & Clean",
    description: "Remove clutter for a pristine look",
    category: "atmosphere",
    thumbnail:
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
    prompt:
      "Declutter and clean the space completely. Remove all personal items, excessive furniture, and visual distractions. Keep only essential, well-placed furniture and decor. Ensure all surfaces are clean and organized. The space should feel spacious, neutral, and ready for potential buyers to envision themselves living there.",
  },
  {
    id: "virtual-renovation",
    name: "Virtual Renovation",
    description: "Modernize outdated features",
    category: "atmosphere",
    thumbnail:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop",
    prompt:
      "Virtually renovate the space with modern updates. Replace outdated fixtures with contemporary alternatives. Update flooring to modern hardwood or tiles. Refresh cabinet hardware and lighting fixtures. Apply fresh, neutral paint colors. The space should feel completely modernized while maintaining its original layout and architectural features.",
  },

  // Coming Soon placeholder
  {
    id: "coming-soon",
    name: "More Styles Coming Soon",
    description: "New design templates are on the way",
    category: "staging",
    thumbnail:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop",
    prompt: "",
    comingSoon: true,
  },
];

export function getTemplateById(id: string): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: StyleCategory
): StyleTemplate[] {
  return STYLE_TEMPLATES.filter((t) => t.category === category);
}

export function getSelectableTemplates(): StyleTemplate[] {
  return STYLE_TEMPLATES.filter((t) => !t.comingSoon);
}

export const ALL_CATEGORIES: StyleCategory[] = [
  "staging",
  "lighting",
  "exterior",
  "atmosphere",
];
