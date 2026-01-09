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

export const ROOM_TYPES: RoomTypeOption[] = [
  {
    id: "living-room",
    label: "Living Room",
    icon: "IconSofa",
    description: "Living spaces, family rooms, lounges",
  },
  {
    id: "bedroom",
    label: "Bedroom",
    icon: "IconBed",
    description: "Bedrooms, master suites, guest rooms",
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: "IconToolsKitchen2",
    description: "Kitchens and cooking areas",
  },
  {
    id: "bathroom",
    label: "Bathroom",
    icon: "IconBath",
    description: "Bathrooms, en-suites, powder rooms",
  },
  {
    id: "dining-room",
    label: "Dining Room",
    icon: "IconArmchair",
    description: "Dining areas and breakfast nooks",
  },
  {
    id: "office",
    label: "Office",
    icon: "IconDesk",
    description: "Home offices and study rooms",
  },
  {
    id: "hallway",
    label: "Hallway",
    icon: "IconDoor",
    description: "Hallways, corridors, and entryways",
  },
  {
    id: "garage",
    label: "Garage",
    icon: "IconCar",
    description: "Garages and parking spaces",
  },
  {
    id: "balcony",
    label: "Balcony",
    icon: "IconBuildingBridge",
    description: "Balconies and terraces",
  },
  {
    id: "laundry-room",
    label: "Laundry Room",
    icon: "IconWashMachine",
    description: "Laundry rooms and utility spaces",
  },
  {
    id: "childrens-room",
    label: "Children's Room",
    icon: "IconMoodKid",
    description: "Kids' rooms and playrooms",
  },
  {
    id: "walk-in-closet",
    label: "Walk-in Closet",
    icon: "IconHanger",
    description: "Walk-in closets and dressing rooms",
  },
  {
    id: "basement",
    label: "Basement",
    icon: "IconStairs",
    description: "Basements and cellars",
  },
  {
    id: "attic",
    label: "Attic",
    icon: "IconBuildingSkyscraper",
    description: "Attics and loft spaces",
  },
  {
    id: "gym",
    label: "Home Gym",
    icon: "IconBarbell",
    description: "Home gyms and fitness rooms",
  },
  {
    id: "exterior",
    label: "Exterior",
    icon: "IconHome",
    description: "Exterior views and facades",
  },
  {
    id: "garden",
    label: "Garden",
    icon: "IconPlant",
    description: "Gardens and outdoor landscapes",
  },
  {
    id: "pool-area",
    label: "Pool Area",
    icon: "IconPool",
    description: "Swimming pools and pool decks",
  },
];

export function getRoomTypeById(id: string): RoomTypeOption | undefined {
  return ROOM_TYPES.find((r) => r.id === id);
}

// Generate a prompt with room type context and architectural preservation
export function generatePrompt(
  template: StyleTemplate,
  roomType: string | null
): string {
  const preserveStructure =
    "Do not move, remove, or modify windows, walls, doors, or any architectural elements. Keep the room layout exactly as shown.";

  let prompt = template.prompt;

  if (roomType) {
    const roomLabel = roomType.replace(/-/g, " ");
    prompt = `This is a ${roomLabel}. ${prompt}`;
  }

  return `${prompt} ${preserveStructure}`;
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
