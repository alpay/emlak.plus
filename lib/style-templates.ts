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
    prompt: "Replace the sky with a perfectly clear, vibrant blue sky with no clouds. The sky should have a natural gradient from deep blue at the top to lighter blue near the horizon.",
  },
  {
    id: "partly-cloudy",
    label: "Parçalı Bulutlu",
    thumbnail: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=150&fit=crop",
    prompt: "Replace the sky with a beautiful partly cloudy sky featuring soft, white cumulus clouds scattered across a bright blue background. The clouds should look natural and inviting.",
  },
  {
    id: "golden-hour",
    label: "Altın Saat",
    thumbnail: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=200&h=150&fit=crop",
    prompt: "Replace the sky with a warm golden hour sky. Include soft orange, pink, and golden tones near the horizon transitioning to a deeper blue above. Add a few wispy clouds catching the warm light.",
  },
  {
    id: "twilight",
    label: "Alacakaranlık",
    thumbnail: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=200&h=150&fit=crop",
    prompt: "Replace the sky with a stunning twilight/dusk sky. Use deep blue and purple tones transitioning to warm orange and pink at the horizon. This creates a dramatic, professional real estate look.",
  },
  {
    id: "sunset",
    label: "Gün Batımı",
    thumbnail: "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=200&h=150&fit=crop",
    prompt: "Replace the sky with a dramatic sunset sky. Feature rich orange, red, and purple colors with dramatic cloud formations. The sky should look natural and enhance the property's appeal.",
  },
];

export function getSkyOptionById(id: string): SkyOption | undefined {
  return SKY_OPTIONS.find((s) => s.id === id);
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
    promptAddition: "", // Style template handles this
  },
  {
    id: "declutter",
    icon: "IconTrash",
    title: "Dağınıklığı Temizle",
    description: "Yer çöplerini, dağınık eşyaları temizler",
    color: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    promptAddition: "For this property listing photo, remove all clutter and personal items that distract from the space. This includes: shoes, clothing, toys, personal care items, dishes, food items, cables, trash, magazines, and any disorganized items on floors, counters, tables, and surfaces. Keep only essential, well-placed furniture appropriate for a property listing. The space should appear clean, spacious, and move-in ready. Do not remove permanent fixtures, built-in items, or architectural elements.",
  },
  {
    id: "cleanHands",
    icon: "IconHandStop",
    title: "Elleri Temizle",
    description: "Yansımadaki elleri siler",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    promptAddition: "Remove any hands, fingers, arms, or human body parts visible in the image or its mirror reflections, glass surfaces, window reflections, or any reflective surfaces in this property photo. Replace with natural-looking reflections of the room that maintain the professional appearance expected in real estate listing photography.",
  },
  {
    id: "cleanCamera",
    icon: "IconCamera",
    title: "Kamerayı Temizle",
    description: "Tripod ve ekipmanı siler",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    promptAddition: "Remove any camera equipment, tripods, camera bags, lighting stands, flash units, or photography gear visible in this property photo or its reflections. The space should appear naturally photographed without any visible production equipment, as expected in professional real estate photography.",
  },
  {
    id: "turnOffScreens",
    icon: "IconDeviceTv",
    title: "Ekranları Kapat",
    description: "TV ve monitörleri karartır",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    promptAddition: "Turn off all TV screens, computer monitors, tablets, and electronic displays visible in this property photo. Make all screens appear as black/off state while keeping the device frames, stands, and mounting positions exactly as they are. This creates a cleaner, more neutral presentation for potential buyers.",
  },
  {
    id: "lensCorrection",
    icon: "IconFocusCentered",
    title: "Lens Düzeltme",
    description: "Geniş açı distorsiyonunu giderir",
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    promptAddition: "PRIORITY LENS CORRECTION: Apply professional lens distortion correction to this property photo. If the image was taken with a wide-angle or fisheye lens, correct the barrel/pincushion distortion so all straight lines appear straight. Specifically: 1) Make all vertical lines (walls, door frames, window frames, columns, edges of furniture) perfectly vertical and parallel. 2) Make all horizontal lines (floor edges, ceiling lines, window sills, countertops) perfectly horizontal. 3) Remove any curved or bowed appearance from what should be straight edges. 4) Correct perspective so the room appears as it would to the human eye with a normal lens. The result should look like it was photographed with a standard 35-50mm lens with natural perspective.",
  },
  {
    id: "whiteBalance",
    icon: "IconSun",
    title: "Beyaz Dengesi",
    description: "Renk sıcaklığını optimize eder",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    promptAddition: "Correct the white balance in this property photo to achieve natural, neutral colors. Remove any yellow, orange, blue, or green color casts caused by mixed lighting. Make whites appear pure white, walls their true color, and ensure accurate color representation throughout. The lighting should appear natural and inviting for potential buyers.",
  },
  {
    id: "grassGreening",
    icon: "IconPlant",
    title: "Çim Yeşillendirme",
    description: "Bahçedeki çimleri yeşillendirir",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    promptAddition: "", // Handled dynamically in generatePrompt based on room type
    outdoorOnly: true,
  },
  {
    id: "blurSensitiveInfo",
    icon: "IconEyeOff",
    title: "Hassas Bilgileri Bulanıklaştır",
    description: "Kişisel bilgileri, plakaları gizler",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    promptAddition: "For privacy protection in this property listing, blur and obscure all sensitive information visible in the photo. This includes: vehicle license plates, visible street addresses or house numbers, family photos or portraits, personal documents, mail with addresses, computer/phone screens showing personal data, name plates, and any other identifying information. Apply a natural-looking blur that protects privacy while maintaining the professional quality of the listing photo.",
  },
  {
    id: "skyReplacement",
    icon: "IconCloud",
    title: "Gökyüzü Değiştirme",
    description: "Gökyüzünü değiştirir",
    color: "text-sky-500",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    promptAddition: "", // Handled dynamically based on selected sky option
    outdoorOnly: true,
    hasOptions: true,
  },
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
}

// Generate a prompt with room type context, AI tools, and architectural preservation
// Optimized for real estate virtual staging - maintains property integrity
export function generatePrompt(
  template: StyleTemplate | null,
  roomType: string,
  environment: "indoor" | "outdoor",
  aiTools?: AIToolsState
): string {
  // Enhanced structure preservation prompt for real estate
  // Note: Lens correction is allowed - it's a photographic fix, not a structural modification
  const preserveStructure = `CRITICAL PRESERVATION RULES: This image is for a real estate property listing. Preserve the exact architectural integrity of the property. Do NOT add, remove, or relocate any of the following physical elements: walls, windows, doors, ceiling height, flooring, tiles, built-in cabinetry, kitchen cabinets, bathroom fixtures, fireplaces, staircases, columns, beams, radiators, air vents, electrical outlets, or any permanent structural elements. Keep the same number and arrangement of rooms, windows, and doors. Maintain natural lighting direction. The edited image must accurately represent the actual physical property. EXCEPTION: Lens distortion correction IS allowed - straightening vertical and horizontal lines to correct fisheye or wide-angle lens distortion is a photographic correction and does not alter the property's actual structure.`;

  const promptParts: string[] = [];

  // Add professional real estate context with room type
  const roomLabel = roomType.replace(/-/g, " ");
  if (environment === "outdoor") {
    promptParts.push(
      `This is a professional real estate listing photograph of an outdoor ${roomLabel} area, captured to showcase this property for potential buyers.`
    );
  } else {
    promptParts.push(
      `This is a professional real estate listing photograph of a ${roomLabel}, captured to showcase this property for potential buyers.`
    );
  }

  // Add style template prompt with real estate framing
  if (template) {
    if (environment === "outdoor") {
      // For outdoor, be very conservative - only change movable items
      promptParts.push(
        `For this property exterior, virtually stage by updating only the movable outdoor furniture and portable decor items to complement a ${template.name} aesthetic. Do NOT modify: the building facade, roof, siding, brick/stone work, windows, doors, landscaping beds, trees, shrubs, permanent structures, driveways, pathways, fencing, or any architectural elements. Keep all existing plants and landscaping exactly as photographed.`
      );
    } else {
      // For indoor, apply the full style with real estate context
      promptParts.push(
        `For this property listing, virtually stage the space: ${template.prompt}`
      );
    }
  }

  // Add AI tool prompt additions
  if (aiTools) {
    for (const tool of AI_TOOLS_CONFIG) {
      const toolId = tool.id as keyof AIToolsState;
      // Skip tools that aren't enabled
      if (!aiTools[toolId]) continue;

      // Handle special cases with dynamic prompts
      if (toolId === "grassGreening") {
        // Only apply grass greening for outdoor photos with garden/yard areas
        if (environment === "outdoor" && roomType) {
          const grassRoomTypes = ["garden", "backyard", "facade", "pool-area", "terrace"];
          if (grassRoomTypes.includes(roomType)) {
            promptParts.push(
              "Enhance the lawn and grass areas to appear lush, healthy, and vibrant green as they would look during peak growing season. Only enhance existing grass areas - do not add grass where there is none. The grass should look naturally maintained by professional landscaping. Preserve all paved areas, decking, garden beds, and non-grass surfaces exactly as shown."
            );
          }
        }
      } else if (toolId === "skyReplacement") {
        // Only apply sky replacement for outdoor photos
        if (environment === "outdoor" && aiTools.selectedSkyOption) {
          const skyOption = getSkyOptionById(aiTools.selectedSkyOption);
          if (skyOption) {
            promptParts.push(
              `${skyOption.prompt} Ensure the new sky blends naturally with the existing scene lighting and horizon line.`
            );
          }
        }
      } else if (tool.promptAddition) {
        // Standard tools with static prompts
        promptParts.push(tool.promptAddition);
      }
    }
  }

  // Always add structure preservation as the final, most important instruction
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
