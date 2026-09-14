import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Upload,
  Layers,
  ShoppingBag,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Loader2,
  Eye,
  Camera,
  Plus,
} from 'lucide-react';
import { Product } from '../../types';
import { generateProposedGardenDesign, VISUALIZER_STYLES } from '../../utils/visualizerEngine';
import { handleImageError } from '../../utils/imageUtils';

interface SampleSpace {
  id: string;
  name: string;
  subtitle: string;
  beforeImage: string;
  designs: Record<
    string,
    {
      styleName: string;
      description: string;
      afterImage: string;
      items: {
        name: string;
        price: number;
        category: string;
        image: string;
        matchedProductId?: string;
      }[];
    }
  >;
}

const SAMPLE_SPACES: SampleSpace[] = [
  {
    id: 'balcony',
    name: 'Compact Apartment Balcony',
    subtitle: '120 sq ft • High-rise Bengaluru balcony',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    designs: {
      tropical: {
        styleName: 'Lush Tropical Oasis',
        description: 'Dense canopy layering with broad-leaf monsteras, golden pothos cascades, and terracotta planters.',
        afterImage: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Swiss Cheese Monstera Deliciosa', price: 649, category: 'Indoor Plant', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-1' },
          { name: 'Terracotta Cylinder Planters (Set of 3)', price: 899, category: 'Planter', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-7' },
          { name: 'Golden Pothos Cascading Vines', price: 299, category: 'Hanging Plant', image: 'https://images.unsplash.com/photo-1596724817758-9121528638c4?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-4' },
          { name: 'Pure Steamed Bone Meal & Compost (2kg)', price: 199, category: 'Organic Feed', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-11' },
        ],
      },
      minimalist: {
        styleName: 'Modern Minimalist',
        description: 'Clean architectural lines, neutral grey matte fiber pots, and sculptural snake plants.',
        afterImage: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Variegated Snake Plant (Sansevieria)', price: 399, category: 'Indoor Plant', image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-2' },
          { name: 'White Matte Ceramic Planter', price: 549, category: 'Pots', image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-8' },
          { name: 'ZZ Plant Emerald Gloss', price: 449, category: 'Indoor Plant', image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-6' },
        ],
      },
      zen: {
        styleName: 'Japanese Zen Sanctuary',
        description: 'Peaceful bamboo accents, polished black river stones, and delicate Japanese bonsai silhouettes.',
        afterImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Ficus Retusa Bonsai Tree', price: 1299, category: 'Specimen Plant', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-15' },
          { name: 'Polished Black River Pebbles (5kg)', price: 349, category: 'Décor', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-16' },
          { name: 'Brass Ergonomic Plant Mister', price: 499, category: 'Tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-10' },
        ],
      },
      vertical: {
        styleName: 'Vertical Herb & Floral Wall',
        description: 'Wall-mounted felt pocket hydro-wicking system with culinary herbs and flowering bougainvillea.',
        afterImage: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Vertical Living Wall System (12 Pockets)', price: 1499, category: 'Hardware', image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500&q=80' },
          { name: 'Organic Basil, Mint & Rosemary Seedlings', price: 399, category: 'Edible Greens', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80' },
          { name: 'Organic Liquid Seaweed Fertilizer (500ml)', price: 280, category: 'Nutrients', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-12' },
        ],
      },
    },
  },
  {
    id: 'backyard',
    name: 'Villa Backyard & Lawn',
    subtitle: '800 sq ft • Suburban villa backyard',
    beforeImage: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80',
    designs: {
      tropical: {
        styleName: 'Tropical Resort Garden',
        description: 'Multi-tiered palms, fragrant frangipani trees, and curved flagstone stepping pathways.',
        afterImage: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Areca Palm Cluster (5 Feet)', price: 950, category: 'Outdoor Plant', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-3' },
          { name: 'White Plumeria Frangipani Sapling', price: 450, category: 'Flowering Tree', image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=500&q=80' },
          { name: 'Natural Sandstone Stepping Stones (Set of 6)', price: 1850, category: 'Hardscape', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80' },
        ],
      },
      minimalist: {
        styleName: 'Scandi Minimal Lawn',
        description: 'Neatly edged Korean grass turf with sculptural black planters and warm linear lighting.',
        afterImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Korean Turf Sod Rolls (100 sq ft)', price: 2200, category: 'Lawn', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=500&q=80' },
          { name: 'Heavy-Duty Brass Hose Spray Gun', price: 699, category: 'Watering', image: 'https://images.unsplash.com/photo-1599818491823-382a842f1f8b?auto=format&fit=crop&w=500&q=80', matchedProductId: 'prod-14' },
        ],
      },
      zen: {
        styleName: 'Rock Garden & Meditation Nook',
        description: 'Raked gravel courtyard, stone lanterns, and moss-covered stepping boulders.',
        afterImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Natural Granite Japanese Lantern', price: 3200, category: 'Hardscape', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
          { name: 'Crushed Zen White Granite Gravel (50kg)', price: 1400, category: 'Mulch', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=500&q=80' },
        ],
      },
      vertical: {
        styleName: 'Perimeter Creeper Trellis',
        description: 'Trellised boundary walls with bougainvillea, passionflower, and jasmine.',
        afterImage: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Modular Wooden Wall Trellis (6x4 ft)', price: 1650, category: 'Structure', image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500&q=80' },
          { name: 'Fragrant Star Jasmine Climbers', price: 320, category: 'Climber', image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=500&q=80' },
        ],
      },
    },
  },
  {
    id: 'terrace',
    name: 'Office Terrace Lounge',
    subtitle: '1500 sq ft • Commercial rooftop space',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    designs: {
      tropical: {
        styleName: 'Urban Canopy Terrace',
        description: 'Shaded wooden pergolas enveloped in bougainvillea, bird of paradise, and seating pods.',
        afterImage: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Giant Bird of Paradise (Strelitzia)', price: 1850, category: 'Specimen', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=500&q=80' },
          { name: 'Large Commercial FRP Planters (Set of 2)', price: 3400, category: 'Planter', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80' },
        ],
      },
      minimalist: {
        styleName: 'Corporate Green Spine',
        description: 'Linear planters separating collaboration zones with low-maintenance ficus and drip lines.',
        afterImage: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Linear Terrace Planter Box with Drip Kit', price: 2900, category: 'Irrigation', image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=500&q=80' },
        ],
      },
      zen: {
        styleName: 'Zen Tea Deck',
        description: 'Teakwood decking with bamboo water spouts and shade-tolerant ferns.',
        afterImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Solar Powered Bamboo Fountain Spout', price: 2499, category: 'Water Feature', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80' },
        ],
      },
      vertical: {
        styleName: 'Rooftop Hydroponic Wall',
        description: 'High-density vertical greenery providing sound absorption and cooling.',
        afterImage: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=1200&q=80',
        items: [
          { name: 'Commercial Hydroponic Living Wall (30 sq ft)', price: 8900, category: 'Living Wall', image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500&q=80' },
        ],
      },
    },
  },
];

export const GardenVisualizerPage: React.FC = () => {
  const { addToCart, saveDesign, showToast, products, setPage, setIsBookingModalOpen, currentCustomer } = useApp();

  const [selectedSpaceId, setSelectedSpaceId] = useState('balcony');
  const [selectedStyle, setSelectedStyle] = useState<'tropical' | 'minimalist' | 'zen' | 'vertical'>('tropical');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [proposedImage, setProposedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSeed, setGenerationSeed] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'split' | 'after' | 'before'>('split');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSpace = SAMPLE_SPACES.find((s) => s.id === selectedSpaceId) || SAMPLE_SPACES[0];
  const currentDesign = currentSpace.designs[selectedStyle] || currentSpace.designs.tropical;
  const activeSourceImage = customImage || currentSpace.beforeImage;

  // Synthesize proposed design directly from the active source image
  const generateDesign = useCallback(
    async (source: string, styleId: string, seed: number) => {
      setIsGenerating(true);
      try {
        const resultUrl = await generateProposedGardenDesign(source, styleId, seed);
        setProposedImage(resultUrl);
      } catch (err) {
        setProposedImage(currentDesign.afterImage);
      } finally {
        setIsGenerating(false);
      }
    },
    [currentDesign.afterImage]
  );

  useEffect(() => {
    generateDesign(activeSourceImage, selectedStyle, generationSeed);
  }, [activeSourceImage, selectedStyle, generationSeed, generateDesign]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uploadedDataUrl = event.target?.result as string;
        setCustomImage(uploadedDataUrl);
        setGenerationSeed(Date.now());
        showToast('Garden Photo Uploaded 🌱', 'Synthesizing proposed botanical redesign for your space...');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAgain = () => {
    const newSeed = Date.now();
    setGenerationSeed(newSeed);
    showToast('Regenerating Proposed Design ✨', `Synthesizing new botanical arrangement for ${currentDesign.styleName}...`);
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    currentDesign.items.forEach((item) => {
      const matched = products.find((p) => p.id === item.matchedProductId || p.name.includes(item.name.split(' ')[0]));
      if (matched) {
        addToCart(matched, 1);
        addedCount++;
      }
    });
    if (addedCount === 0 && products.length > 0) {
      addToCart(products[0], 1);
      addedCount = 1;
    }
    showToast('Items Added to Cart 🛒', `Added design essentials to your bag.`);
  };

  const handleSaveDesign = () => {
    saveDesign({
      title: `${customImage ? 'My Custom Space' : currentSpace.name} - ${currentDesign.styleName}`,
      spaceType: customImage ? 'Uploaded Garden' : currentSpace.name,
      style: currentDesign.styleName,
      image: proposedImage || currentDesign.afterImage,
      beforeImage: activeSourceImage,
      afterImage: proposedImage || currentDesign.afterImage,
      keyPlants: currentDesign.items.map((i) => i.name),
      itemsCount: currentDesign.items.length,
      estimatedCost: currentDesign.items.reduce((s, i) => s + i.price, 0),
      customerName: currentCustomer?.name || 'Guest User',
      customerEmail: currentCustomer?.email || 'guest@rootandbloom.in',
      customerPhone: currentCustomer?.phone || '',
      status: 'Pending Review',
    });
    showToast('Design Saved to My Garden! 🌿', 'You can review this design anytime in your dashboard.');
  };

  return (
    <div className="py-8 md:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>AI Garden Visualizer Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#142E20] leading-tight">
            Preview your transformation before you plant
          </h1>
          <p className="text-xs sm:text-sm text-[#4E6657] mt-2 leading-relaxed">
            Upload your own balcony, terrace, or garden photo. Our botanical AI transforms your actual space into an improved design with customized plant species, lighting, and materials.
          </p>
        </div>

        {/* Space Selection Strip & Upload Option */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DFD8CB] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
              1. Choose a Space Template or Upload Your Own
            </span>

            {/* Upload Button */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Camera className="w-4 h-4 text-[#8FE388]" />
                <span>Upload My Garden Photo</span>
              </button>
              {customImage && (
                <button
                  onClick={() => {
                    setCustomImage(null);
                    setGenerationSeed(Date.now());
                  }}
                  className="text-xs text-[#9B3B2B] hover:underline font-semibold"
                >
                  Use Template Photo
                </button>
              )}
            </div>
          </div>

          {/* Uploaded space banner indicator */}
          {customImage && (
            <div className="bg-[#EBF5EE] border border-[#C5E2CD] p-3 rounded-2xl flex items-center justify-between text-xs text-[#1D4A2B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2A5C43]" />
                <span className="font-medium">Using your uploaded garden photo for AI generation</span>
              </div>
              <span className="text-[11px] font-bold text-[#2A5C43] bg-white px-2.5 py-0.5 rounded-md">
                Active Source
              </span>
            </div>
          )}

          {/* Sample Spaces Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_SPACES.map((space) => (
              <button
                key={space.id}
                onClick={() => {
                  setSelectedSpaceId(space.id);
                  setCustomImage(null);
                  setGenerationSeed(Date.now());
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedSpaceId === space.id && !customImage
                    ? 'bg-[#1A3828] text-white border-[#1A3828] shadow-md'
                    : 'bg-[#FAF8F5] text-[#1E3929] border-[#DFD8CB] hover:bg-[#F2ECE1]'
                }`}
              >
                <span className="font-serif font-bold text-sm block">{space.name}</span>
                <span className={`text-[11px] block mt-0.5 ${selectedSpaceId === space.id && !customImage ? 'text-[#A7F3D0]' : 'text-[#637C6E]'}`}>
                  {space.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection Tabs */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
            2. Select Botanical Style
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'tropical', label: '🌿 Lush Tropical Oasis' },
              { id: 'minimalist', label: '🪴 Modern Minimalist' },
              { id: 'zen', label: '⛩️ Japanese Zen Sanctuary' },
              { id: 'vertical', label: '🌸 Vertical Herb & Floral Wall' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  setSelectedStyle(style.id as any);
                  setGenerationSeed(Date.now());
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedStyle === style.id
                    ? 'bg-[#2A5C43] text-white shadow-sm scale-102'
                    : 'bg-white text-[#294233] border border-[#DFD8CB] hover:bg-[#F0EBE0]'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Visualizer Canvas: Proposed Design with Generate Again & Save Design */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-[#142E20]">
                  {currentDesign.styleName}
                </h3>
                {isGenerating && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2A5C43] bg-[#E8F2EC] px-2.5 py-0.5 rounded-full">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating transformation...
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#526B5C] mt-0.5">
                {currentDesign.description}
              </p>
            </div>

            {/* Dedicated Action Buttons: Generate Again, Save Design, Book This Setup */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleGenerateAgain}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl border border-[#2A5C43] bg-[#F4F9F5] hover:bg-[#E6F3EA] text-xs font-bold text-[#1A3828] flex items-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#2A5C43] ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Generate Again</span>
              </button>

              <button
                onClick={handleSaveDesign}
                className="px-4 py-2.5 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] hover:bg-[#EAE4D6] text-xs font-bold text-[#183926] flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#2A5C43]" />
                <span>Save Design</span>
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>Book This Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Before/After Split Viewer Frame */}
          <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-md select-none border-4 border-[#FAF8F5] bg-[#E8E2D5]">
            {/* Background "Proposed Design (After)" Image */}
            <img
              src={proposedImage || currentDesign.afterImage}
              alt="Proposed Botanical Transformation"
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleImageError}
            />

            {/* Foreground "Original Space (Before)" with Split Clipping */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeSourceImage}
                alt="Original Space"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100%', maxWidth: 'none', objectFit: 'cover' }}
                onError={handleImageError}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                ORIGINAL SPACE (BEFORE)
              </div>
            </div>

            {/* Proposed Design Tag */}
            <div className="absolute top-4 right-4 bg-[#1A3828]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-[#8FE388]/40">
              ✨ PROPOSED DESIGN (AFTER)
            </div>

            {/* Draggable Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-[#1A3828] text-white flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
                ⇄
              </div>
            </div>

            {/* Slider Control Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Before after slider"
            />
          </div>

          {/* Slider Instruction Microcopy */}
          <div className="flex items-center justify-between text-xs text-[#637C6E]">
            <span>Drag the center divider to compare before & after</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSliderPosition(0)}
                className="underline hover:text-[#1A3828] font-medium"
              >
                Show 100% Proposed Design
              </button>
              <button
                onClick={() => setSliderPosition(100)}
                className="underline hover:text-[#1A3828] font-medium"
              >
                Show 100% Original Photo
              </button>
            </div>
          </div>
        </div>


        {/* Plants & Materials Palette Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                Plants & Items Used in this Design
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#142E20] mt-0.5">
                Complete Recipe for this Botanical Transformation
              </h3>
            </div>

            <button
              onClick={handleAddAllToCart}
              className="bg-[#1A3828] hover:bg-[#12281D] text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-[#1A3828]/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#8FE388]" />
              <span>Add All Design Items to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(currentDesign?.items || []).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-[#E0D8CA]"
                    onError={handleImageError}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#2A5C43] block">
                      {item.category}
                    </span>
                    <h5 className="font-semibold text-xs text-[#132A1D] truncate">
                      {item.name}
                    </h5>
                    <span className="font-serif font-bold text-xs text-[#142E20] block mt-0.5">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const matched = products.find((p) => p.name.includes(item.name.split(' ')[0]));
                    if (matched) addToCart(matched, 1);
                    else if (products.length > 0) addToCart(products[0], 1);
                  }}
                  className="mt-3 w-full py-1.5 rounded-lg bg-white border border-[#D5CDBE] hover:bg-[#1A3828] hover:text-white text-xs font-semibold text-[#183926] transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Bag</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
