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

// Sky replacement options for outdoor photos
export interface SkyOption {
  id: string;
  label: string;
  thumbnail: string; // Unsplash image URL
  prompt: string;
}

export const SKY_OPTIONS: SkyOption[] = [
  {
    id: "clear-blue",
    label: "Açık Mavi Gökyüzü",
    thumbnail: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=200&h=150&fit=crop",
    prompt: "Change the sky to a perfectly clear, vibrant blue sky with no clouds, featuring a natural gradient from deep blue at the top to lighter blue near the horizon.",
  },
  {
    id: "partly-cloudy",
    label: "Parçalı Bulutlu",
    thumbnail: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=150&fit=crop",
    prompt: "Change the sky to a beautiful partly cloudy sky with soft, white cumulus clouds scattered across a bright blue background.",
  },
  {
    id: "golden-hour",
    label: "Altın Saat",
    thumbnail: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=200&h=150&fit=crop",
    prompt: "Change the sky to a warm golden hour sky with soft orange, pink, and golden tones near the horizon, transitioning to a deeper blue above, with a few wispy clouds catching the warm light.",
  },
  {
    id: "twilight",
    label: "Alacakaranlık",
    thumbnail: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=200&h=150&fit=crop",
    prompt: "Change the sky to a stunning twilight/dusk sky with deep blue and purple tones transitioning to warm orange and pink at the horizon.",
  },
  {
    id: "sunset",
    label: "Gün Batımı",
    thumbnail: "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=200&h=150&fit=crop",
    prompt: "Change the sky to a dramatic sunset with rich orange, red, and purple colors and dramatic cloud formations.",
  },
];

export function getSkyOptionById(id: string): SkyOption | undefined {
  return SKY_OPTIONS.find((s) => s.id === id);
}

// ------------------------------------------------------------------
// CONSTANTS: Physics & Camera Definitions
// ------------------------------------------------------------------

// Defines the "Virtual Camera" to ensure professional real estate look
// REASONING: Forces the model to use specific lens geometry (Tilt-Shift)
// which prevents "falling" walls and cartoonish perspective.
const PHOTOGRAPHIC_PHYSICS = `
[CAMERA SPECIFICATIONS]
- Camera Body: Canon EOS R5 (45MP Full Frame Sensor)
- Lens: Canon TS-E 17mm f/4L Tilt-Shift (Zero barrel distortion)
- Aperture: f/8.0 (Deep depth of field, everything in focus)
- ISO: 100 (Clean, noise-free texture)
- Shutter: Balanced for ambient light
- Processing: Phase One Capture One Pro output, neutral color profile

[LIGHTING PHYSICS]
- Technique: Flambient (Flash + Ambient blending) or HDR Bracketing.
- Interior Light: 3000K-4000K Soft Warm White.
- Window Light: 5600K Cool Daylight.
- Shadows: Soft diffuse ambient occlusion shadows (no harsh black voids).
- Reflections: Ray-traced accuracy on glass, mirrors, and polished floors.
`;

// AI Tools Configuration - shared between components
export interface AIToolConfig {
  id: string;
  icon: string; // Tabler icon name
  title: string;
  description: string;
  color: string;
  bgColor: string;
  promptAddition: string;
  outdoorOnly?: boolean; // If true, only available for outdoor photos
  hasOptions?: boolean; // If true, shows a selection panel (like skyReplacement)
}

export const AI_TOOLS_CONFIG: AIToolConfig[] = [
  {
    id: "replaceFurniture",
    icon: "IconArmchair2",
    title: "Eşyaları Değiştir",
    description: "Mevcut mobilyaları yenileriyle değiştirir",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    // REASONING: "Virtual Staging" is the industry term AI understands best for this task.
    promptAddition: "TASK: Virtual Staging. COMPLETELY REMOVE existing furniture and Replace with high-quality 3D realistic models. Ensure scale and perspective match the room geometry perfectly.",
  },
  {
    id: "declutter",
    icon: "IconTrash",
    title: "Dağınıklığı Temizle",
    description: "Yer çöplerini, dağınık eşyaları temizler",
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    // REASONING: "Inpainting" and "Reconstruct" tells the AI to rebuild the floor/wall behind the trash.
    promptAddition: "TASK: Inpainting & Decluttering. Identify and remove temporary clutter: cardboard boxes, clothing, loose wires, papers, toys, and personal hygiene items. DO NOT remove permanent fixtures (cabinets, islands, fireplaces). RECONSTRUCT the background surfaces (floor, wall, counter) seamlessly where items were removed.",
  },
  {
    id: "cleanHands",
    icon: "IconHandStop",
    title: "Elleri Temizle",
    description: "Yansımadaki elleri siler",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    // REASONING: Specific targeting of "reflections" which is where hands usually appear in real estate photos.
    promptAddition: "TASK: Reflection Cleanup. Scan all mirrors, windows, and glossy surfaces. Remove reflections of hands, arms, smartphones, or photographers. Reconstruct the clean reflection of the room.",
  },
  {
    id: "cleanCamera",
    icon: "IconCamera",
    title: "Kamerayı Temizle",
    description: "Tripod ve ekipmanı siler",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    // REASONING: Adds "Shadow removal" because tripods cast shadows that also need to go.
    promptAddition: "TASK: Equipment Removal. Erase all photography gear: tripods, light stands, flash strobes, and camera bags. Remove the cast shadows of these objects from the floor.",
  },
  {
    id: "turnOffScreens",
    icon: "IconDeviceTv",
    title: "Ekranları Kapat",
    description: "TV ve monitörleri karartır",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    // REASONING: "Black glass texture" looks more premium than just "black color".
    promptAddition: "TASK: Screen Neutralization. Turn off all TV screens, computer monitors, and digital displays. Replace content with a high-gloss black glass texture with subtle room reflections.",
  },
  {
    id: "lensCorrection",
    icon: "IconFocusCentered",
    title: "Lens Düzeltme",
    description: "Geniş açı distorsiyonunu giderir",
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    // REASONING: "Vertical Perspective Correction" is the exact Photoshop term for this.
    promptAddition: "TASK: Geometric Correction. Fix wide-angle barrel distortion. Apply Vertical Perspective Correction: Ensure all vertical architectural lines (walls, door frames, windows) are perfectly parallel to the image borders (90 degrees).",
  },
  {
    id: "whiteBalance",
    icon: "IconSun",
    title: "Beyaz Dengesi",
    description: "Renk sıcaklığını optimize eder",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    // REASONING: Targeting "Yellow Cast" is the most common real estate issue.
    promptAddition: "TASK: Color Grading. Correct White Balance. Neutralize strong yellow/orange casts from tungsten lights. Ensure white walls appear pure white and grey tones are neutral. Aim for a clean, modern look (approx 4500K).",
  },
  {
    id: "grassGreening",
    icon: "IconPlant",
    title: "Çim Yeşillendirme",
    description: "Bahçedeki çimleri yeşillendirir",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    // REASONING: Handled dynamically in generatePrompt, but kept here for safety.
    promptAddition: "TASK: Landscaping. Restore grass areas to be lush, green, and manicured. Remove brown patches. Do not oversaturate; keep it looking natural.",
    outdoorOnly: true,
  },
  {
    id: "blurSensitiveInfo",
    icon: "IconEyeOff",
    title: "Hassas Bilgileri Bulanıklaştır",
    description: "Kişisel bilgileri, plakaları gizler",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    // REASONING: "Gaussian Blur" is a specific understandable effect.
    promptAddition: "TASK: Privacy Protection. Apply a strong Gaussian Blur to all readable text, license plates on cars, family photos showing faces, and house number signs.",
  },
  {
    id: "skyReplacement",
    icon: "IconCloud",
    title: "Gökyüzü Değiştirme",
    description: "Gökyüzünü değiştirir",
    color: "text-sky-500",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    promptAddition: "", // Handled dynamically
    outdoorOnly: true,
    hasOptions: true,
  },
  {
    id: "turnOnLights",
    icon: "IconBulb",
    title: "Işıkları Aç",
    description: "Tüm aydınlatmaları açar",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    // REASONING: Adds "Glow" and "Exposure" to make it look lit.
    promptAddition: "TASK: Lighting Enhancement. Turn on all visible interior light fixtures (lamps, sconces, chandeliers). Add a soft warm glow (bloom) around the bulbs. Gently brighten the surrounding walls to simulate light emission.",
  },
  {
    id: "fixDriveway",
    icon: "IconRoad",
    title: "Yolu Onar",
    description: "Çatlak ve lekeleri giderir",
    color: "text-slate-500",
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    // REASONING: "Powerwash" implies cleaning + fixing.
    promptAddition: "TASK: Surface Restoration. Repair the driveway and walkways. Remove oil stains, tire marks, weeds in cracks, and asphalt fissures. Make the surface look like freshly laid or power-washed concrete/asphalt.",
    outdoorOnly: true,
  },
  {
    id: "blueWater",
    icon: "IconPool",
    title: "Mavi Su",
    description: "Havuz suyunu berraklaştırır",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    // REASONING: "Caustics" is the physics term for light dancing on water bottom.
    promptAddition: "TASK: Pool Cleaning. Make pool water appear crystal clear azure blue. Remove leaves and debris. Enhance water transparency to show the pool bottom. Add realistic water caustics and reflections of the sky.",
    outdoorOnly: true,
  }
];

export function getAIToolConfig(id: string): AIToolConfig | undefined {
  return AI_TOOLS_CONFIG.find((t) => t.id === id);
}

// ProjectAITools type for reference (matches schema.ts)
export interface AIToolsState {
  replaceFurniture: boolean;
  declutter: boolean;
  cleanHands: boolean;
  cleanCamera: boolean;
  turnOffScreens: boolean;
  lensCorrection: boolean;
  whiteBalance: boolean;
  grassGreening: boolean;
  blurSensitiveInfo: boolean;
  skyReplacement: boolean;
  selectedSkyOption?: string; // ID of the selected sky option
  // New tools
  turnOnLights?: boolean;
  fixDriveway?: boolean;
  blueWater?: boolean;
}

// ------------------------------------------------------------------
// GENERATE PROMPT: The "Gemini 3 Nano Banana Pro" Optimized Version
// ------------------------------------------------------------------
export function generatePrompt(
  template: StyleTemplate | null,
  roomType: string,
  environment: "indoor" | "outdoor",
  aiTools?: AIToolsState
): string {
  // 1. Context Setup
  const roomLabel = roomType.replace(/-/g, " ");

  // 2. The Structural Lock (The "Safety Net")
  // We define exactly what the AI is NOT allowed to touch.
  const preservationInstructions = environment === "indoor"
    ? `[PRESERVATION CONSTRAINTS - STRICT]
- DO NOT CHANGE: Room dimensions, ceiling height, window locations, door frames, or structural columns.
- DO NOT CHANGE: View outside the window (unless Sky Replacement is active).
- DO NOT CHANGE: Flooring type (unless Virtual Renovation is active).
- PRESERVE: Original ceiling beams, fireplaces, and built-in cabinetry unless explicitly told to remove.`
    : `[PRESERVATION CONSTRAINTS - STRICT]
- DO NOT CHANGE: Building footprint, roof shape, siding material, or window fenestration.
- DO NOT CHANGE: Driveway shape or hardscape layout (only repair surface texture).
- PRESERVE: Neighboring houses and street context.`;

  // 3. Building the Task List
  const specificTasks: string[] = [];

  // A. Template Application
  if (template) {
    if (environment === "outdoor") {
      specificTasks.push(`1. EXTERIOR STYLING: ${template.prompt}`);
    } else {
      specificTasks.push(`1. INTERIOR STYLING: ${template.prompt}`);
    }
  }

  // B. AI Tools Application
  if (aiTools) {
    // Process "Grass Greening"
    if (aiTools.grassGreening && environment === "outdoor") {
      specificTasks.push("2. LANDSCAPING: Restore grass to a healthy, manicured green without oversaturating.");
    }

    // Process "Sky Replacement"
    if (aiTools.skyReplacement && environment === "outdoor" && aiTools.selectedSkyOption) {
      const skyOption = getSkyOptionById(aiTools.selectedSkyOption);
      if (skyOption) {
        specificTasks.push(`3. SKY REPLACEMENT: ${skyOption.prompt} IMPORTANT: Use precise masking around tree leaves and rooflines.`);
      }
    }

    // Process all other tool configs
    AI_TOOLS_CONFIG.forEach((tool) => {
      const toolId = tool.id as keyof AIToolsState;
      if (aiTools[toolId] && tool.promptAddition) {
        // We append the robust prompt additions we defined in Step B
        specificTasks.push(`> EXECUTE TOOL (${tool.title}): ${tool.promptAddition}`);
      }
    });
  }

  // 4. Final Assembly
  // Using Markdown headers for Gemini's structural understanding
  return `
# ROLE
Act as a world-class Architectural Photographer and Editor. You are processing a real estate listing photo.

# INPUT CONTEXT
- Environment: ${environment}
- Room Type: ${roomLabel}
${PHOTOGRAPHIC_PHYSICS}

${preservationInstructions}

# NEGATIVE PROMPT (FORBIDDEN)
distorted perspective, leaning walls, non-euclidean geometry, hallucinations of people or animals, text, watermarks, blurry textures, oversaturated colors, cartoonish rendering, low resolution, bad lighting, floating furniture.

# EDITING EXECUTION PLAN
Please execute the following tasks in order. Blend all edits photorealistically.
${specificTasks.join("\n")}

# OUTPUT QUALITY
Final image must be 8K resolution, photorealistic, with perfect lighting balance (HDR) and sharp details.
`;
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  // --- STAGING STYLES ---
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light, airy spaces with natural wood and minimal decor",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", // Existing URL
    // REASONING: Added 'Blonde Oak', 'Wool', 'Diffused Light'.
    prompt: "DESIGN STYLE: Scandinavian Modern. PALETTE: Whites, soft greys, light wood tones. MATERIALS: Blonde oak flooring, matte white joinery, grey wool felt upholstery, chunky knit throws, linen curtains. FURNITURE: Functional, low-profile, light wood tapered legs. LIGHTING: Soft, diffused northern daylight, no harsh shadows.",
  },
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean lines, open spaces, and curated simplicity",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop",
    // REASONING: Added 'Monochromatic', 'Hidden Storage', 'Sharp Lines'.
    prompt: "DESIGN STYLE: Ultra-Modern Minimalist. PALETTE: Monochromatic black, white, and cool grey. MATERIALS: Polished concrete or large format tile floors, matte black metal accents, frameless glass, smooth white lacquer. FURNITURE: Sharp geometric lines, blocky silhouettes, hidden storage. ATMOSPHERE: Serene, uncluttered, museum-like precision.",
  },
  {
    id: "industrial-loft",
    name: "Industrial Loft",
    description: "Raw materials, exposed elements, urban character",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    // REASONING: Added 'Cognac Leather', 'Brick', 'Edison Bulbs'.
    prompt: "DESIGN STYLE: Urban Industrial Loft. PALETTE: Charcoal, rust, warm wood, black. MATERIALS: Distressed cognac leather sofas, reclaimed rough-sawn wood tables, exposed brick walls, black iron piping, concrete textures. LIGHTING: Warm tungsten Edison bulbs, metal pendant lights. ATMOSPHERE: Moody, masculine, raw.",
  },
  {
    id: "coastal-hamptons",
    name: "Coastal Hamptons",
    description: "Breezy elegance with nautical touches and soft blues",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    // REASONING: Added 'Shiplap', 'Rattan', 'Navy Blue'.
    prompt: "DESIGN STYLE: Coastal Hamptons. PALETTE: Crisp white, navy blue, soft beige. MATERIALS: White wash wood, shiplap wall textures, rattan and wicker accent furniture, striped linen upholstery, jute rugs. ATMOSPHERE: Breezy, fresh, wealthy beach house. LIGHTING: Bright sunlight, airy feel.",
  },
  {
    id: "mid-century-modern",
    name: "Mid-Century Modern",
    description: "Retro charm with iconic furniture and warm wood tones",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
    // REASONING: Added 'Walnut', 'Teak', 'Tapered Legs'.
    prompt: "DESIGN STYLE: Mid-Century Modern (MCM). PALETTE: Walnut wood, olive green, mustard yellow, burnt orange accents. MATERIALS: Teak furniture, tweed upholstery, brass hardware. FURNITURE: Eames-inspired lounge chairs, tapered legs, low sideboards, kidney-bean shapes. ATMOSPHERE: Retro-chic, warm, stylish.",
  },
  {
    id: "bohemian-eclectic",
    name: "Bohemian Eclectic",
    description: "Layered textures, global influences, artistic flair",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
    // REASONING: Added 'Macrame', 'Plants', 'Pattern Layering'.
    prompt: "DESIGN STYLE: Bohemian Eclectic. PALETTE: Earth tones, terracotta, deep greens. MATERIALS: Macramé wall hangings, persian rugs, velvet cushions, woven baskets, abundance of indoor plants (monstera, ferns). FURNITURE: Vintage mix-and-match, bamboo chairs, poufs. ATMOSPHERE: Relaxed, organic, artistic, traveled.",
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Japanese minimalism meets Scandinavian warmth",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1598928506311-c55ez84a6026?w=400&h=300&fit=crop",
    // REASONING: Added 'Bamboo', 'Low Furniture', 'Paper Lanterns'.
    prompt: "DESIGN STYLE: Japandi (Japan-Scandi Fusion). PALETTE: Muted earth tones, warm beige, stone grey, light wood. MATERIALS: Raw unpainted wood, bamboo, rice paper lanterns, stone ceramics, linen. FURNITURE: Very low profile platform beds/sofas, slat wood details. ATMOSPHERE: Zen, balanced, warm minimalism.",
  },
  {
    id: "luxury-contemporary",
    name: "Luxury Contemporary",
    description: "Sophisticated elegance with premium materials",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    // REASONING: Added 'Gold/Brass', 'Velvet', 'Reflective Surfaces'.
    prompt: "DESIGN STYLE: High-End Luxury Contemporary. PALETTE: Greige, cream, gold/brass, black. MATERIALS: Polished Calacatta marble, rich velvet upholstery, brushed gold hardware, dark walnut veneers, bevelled mirrors. FURNITURE: Statement pieces, curved sofas, high-gloss finishes. ATMOSPHERE: Expensive, sophisticated, hotel-like.",
  },
  {
    id: "farmhouse-modern",
    name: "Modern Farmhouse",
    description: "Rustic charm with contemporary comfort",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    // REASONING: Added 'Slipcovers', 'Reclaimed Wood', 'Black Hardware'.
    prompt: "DESIGN STYLE: Modern Farmhouse. PALETTE: White, black, warm wood. MATERIALS: White slipcovered sofas, reclaimed wood beams, matte black metal hardware, shaker style detailing, buffalo check accents. FURNITURE: Comfortable, oversized, family-friendly. ATMOSPHERE: Cozy, welcoming, rustic yet clean.",
  },
  {
    id: "art-deco",
    name: "Art Deco",
    description: "Glamorous geometry with bold patterns and metallics",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=400&h=300&fit=crop",
    // REASONING: Added 'Geometric Patterns', 'Chrome', 'Symmetry'.
    prompt: "DESIGN STYLE: Art Deco Revival. PALETTE: Jewel tones (emerald, sapphire), black, gold/chrome. MATERIALS: Geometric patterned wallpapers, velvet, lacquered wood, mirrored furniture, brass inlays. FURNITURE: Curvaceous shapes, scalloped edges, bold symmetry. ATMOSPHERE: Glamorous, dramatic, opulent.",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Warm terracotta, arched details, and sunny vibes",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop",
    // REASONING: Added 'Terracotta', 'Iron', 'Arches'.
    prompt: "DESIGN STYLE: Modern Mediterranean. PALETTE: Terracotta, warm white, olive, ocean blue. MATERIALS: Terracotta tile floors, wrought iron railings, rough plaster walls, natural dark wood. FURNITURE: Heavy rustic wood tables, leather accents. ATMOSPHERE: Sun-baked, earthy, slow-living.",
  },
  {
    id: "transitional",
    name: "Transitional",
    description: "Perfect balance of traditional and contemporary",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=400&h=300&fit=crop",
    // REASONING: Added 'Timeless', 'Neutral', 'Texture over Color'.
    prompt: "DESIGN STYLE: Transitional. PALETTE: Tone-on-tone neutrals (taupe, beige, ivory). MATERIALS: Mix of linen, leather, and chenille. FURNITURE: Classic silhouettes with modern clean lines. Avoids extremes (not too ornate, not too cold). ATMOSPHERE: Timeless, elegant, balanced.",
  },

  // --- LIGHTING STYLES ---
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm sunset lighting for cozy ambiance",
    category: "lighting",
    thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
    prompt: "LIGHTING MODIFIER: Golden Hour. Simulate low-angle sun entering the room. Color Temperature: Warm Golden (approx 3500K). Create long, soft shadows stretching across the floor. Enhance the feeling of warmth and evening comfort.",
  },
  {
    id: "bright-airy",
    name: "Bright & Airy",
    description: "Maximize natural light for open feel",
    category: "lighting",
    thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    prompt: "LIGHTING MODIFIER: Bright & Airy. Simulate Mid-day Overcast Daylight. Boost exposure in shadow areas. Ensure whites are pure and crisp. Light should feel soft and wrap around objects. Eliminate dark corners. High-key lighting approach.",
  },

  // --- EXTERIOR STYLES ---
  {
    id: "curb-appeal",
    name: "Curb Appeal",
    description: "Enhance exterior attractiveness",
    category: "exterior",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    prompt: "TASK: Curb Appeal Optimization. LANDSCAPING: Make grass vibrant green, trim hedges neatly, add blooming colorful flowers to flowerbeds. STRUCTURE: Clean the facade, remove dirt/stains from siding. ATMOSPHERE: Welcoming, well-maintained, sunny day.",
  },
  {
    id: "twilight-exterior",
    name: "Twilight Shot",
    description: "Dramatic evening exterior lighting",
    category: "exterior",
    thumbnail: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
    prompt: "TASK: Twilight Conversion. SKY: Deep royal blue/purple dusk sky (Blue Hour). LIGHTING: Turn on all interior windows (warm glow) and exterior sconces/garden lights. Create a beautiful contrast between the cool blue sky and warm house lights. FACADE: Gently illuminated.",
  },

  // --- ATMOSPHERE STYLES ---
  {
    id: "declutter",
    name: "Declutter & Clean",
    description: "Remove clutter for a pristine look",
    category: "atmosphere",
    thumbnail: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop",
    prompt: "TASK: Heavy Decluttering. Remove ALL personal items, small appliances, rugs, and decor. Leave ONLY the main furniture pieces (sofa, bed, dining table). Surfaces (counters, floors, tables) should be completely bare and polished. MINIMALIST presentation.",
  },
  {
    id: "virtual-renovation",
    name: "Virtual Renovation",
    description: "Modernize outdated features",
    category: "atmosphere",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    prompt: "TASK: Virtual Renovation. ARCHITECTURE: Keep walls in place but UPDATE FINISHES. Flooring: Install modern wide-plank oak. Walls: Paint fresh neutral white. Kitchen: Reface cabinets to modern flat-panel style. Lighting: Update to modern recessed lighting. STYLE: Modern Contemporary.",
  },
  {
    id: "coming-soon",
    name: "More Styles Coming Soon",
    description: "New design templates are on the way",
    category: "staging",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop",
    prompt: "",
    comingSoon: true,
  },
];

export function getTemplateById(id: string): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find((t) => t.id === id);
}