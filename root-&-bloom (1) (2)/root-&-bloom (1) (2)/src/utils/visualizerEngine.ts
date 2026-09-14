// AI Garden Visualizer Transformation Engine for Root & Bloom

export interface VisualizerStyleConfig {
  id: string;
  name: string;
  description: string;
  lightingTone: 'warm-golden' | 'scandi-neutral' | 'zen-ambient' | 'vibrant-morning';
  accentFoliage: string[];
}

export const VISUALIZER_STYLES: Record<string, VisualizerStyleConfig> = {
  tropical: {
    id: 'tropical',
    name: 'Lush Tropical Oasis',
    description: 'Dense canopy layering with broad-leaf monsteras, golden pothos cascades, and terracotta planters.',
    lightingTone: 'warm-golden',
    accentFoliage: ['Monstera Deliciosa', 'Areca Palm Fronds', 'Trailing Pothos', 'Bougainvillea'],
  },
  minimalist: {
    id: 'minimalist',
    name: 'Modern Minimalist',
    description: 'Clean architectural lines, neutral grey matte fiber pots, and sculptural snake plants.',
    lightingTone: 'scandi-neutral',
    accentFoliage: ['Sansevieria Trifasciata', 'ZZ Emerald Plant', 'Ficus Lyrata', 'Cast Iron Plant'],
  },
  zen: {
    id: 'zen',
    name: 'Japanese Zen Sanctuary',
    description: 'Peaceful bamboo accents, polished black river stones, and delicate Japanese bonsai silhouettes.',
    lightingTone: 'zen-ambient',
    accentFoliage: ['Ficus Retusa Bonsai', 'Slender Bamboo', 'Maidenhair Ferns', 'Japanese Maple'],
  },
  vertical: {
    id: 'vertical',
    name: 'Vertical Herb & Floral Wall',
    description: 'Wall-mounted felt pocket hydro-wicking system with culinary herbs and flowering bougainvillea.',
    lightingTone: 'vibrant-morning',
    accentFoliage: ['Creeping Fig', 'Pink Bougainvillea', 'Thai Basil & Rosemary', 'English Ivy'],
  },
};

/**
 * Transforms an uploaded or template garden image into a proposed architectural design concept.
 * Enhances the existing physical space with botanical layering, lighting, and style-specific accents.
 */
export async function generateProposedGardenDesign(
  sourceImageUrl: string,
  styleId: string,
  seed = Date.now()
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = img.naturalWidth || 1200;
      const height = img.naturalHeight || 800;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(sourceImageUrl);
        return;
      }

      // 1. Draw base photo of the user's space
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Apply Botanical Color Harmonization
      // Warm botanical sunlight and leaf vibrancy
      ctx.save();
      const style = VISUALIZER_STYLES[styleId] || VISUALIZER_STYLES.tropical;

      if (styleId === 'tropical') {
        // Warm emerald wash
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(34, 139, 34, 0.14)');
        grad.addColorStop(0.5, 'rgba(235, 180, 70, 0.12)');
        grad.addColorStop(1, 'rgba(20, 80, 45, 0.18)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillRect(0, 0, width, height);
      } else if (styleId === 'minimalist') {
        // High contrast, crisp modern cool slate
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(240, 245, 242, 0.1)');
        grad.addColorStop(1, 'rgba(40, 60, 50, 0.15)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillRect(0, 0, width, height);
      } else if (styleId === 'zen') {
        // Warm earth & serene amber glow
        const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.7);
        grad.addColorStop(0, 'rgba(255, 240, 210, 0.16)');
        grad.addColorStop(1, 'rgba(35, 45, 30, 0.22)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, width, height);
      } else {
        // Vertical garden: morning dew fresh saturation
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(50, 180, 90, 0.15)');
        grad.addColorStop(1, 'rgba(255, 182, 193, 0.14)');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();

      // 3. Synthesize Architectural Botanical Elements Over Space
      ctx.save();

      // Top Canopy / Hanging Planters / Vines (framing the ceiling/railing)
      drawTopCanopyVines(ctx, width, height, styleId, seed);

      // Corner Planters and Specimen Plants (Left and Right floor foreground)
      drawBotanicalCornerAccents(ctx, width, height, styleId, seed);

      // Floor Stepping Stones / Teak Decking / River Pebbles border
      drawFloorHardscapeAccent(ctx, width, height, styleId);

      // Ambient Garden Fairy / Solar Glow
      drawAmbientGardenGlow(ctx, width, height, styleId);

      ctx.restore();

      // 4. Proposed Design Architectural Badge
      drawProposedBadge(ctx, width, height, style.name);

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        resolve(dataUrl);
      } catch (err) {
        // In case of canvas taint from cross-origin image
        resolve(sourceImageUrl);
      }
    };

    img.onerror = () => {
      resolve(sourceImageUrl);
    };

    img.src = sourceImageUrl;
  });
}

function drawTopCanopyVines(ctx: CanvasRenderingContext2D, width: number, height: number, styleId: string, seed: number) {
  ctx.save();
  const vineCount = styleId === 'tropical' || styleId === 'vertical' ? 14 : 7;
  const leafColor = styleId === 'zen' ? '#2A4A33' : '#1E4D2B';
  const highlightColor = styleId === 'tropical' ? '#68BB59' : '#8FE388';

  for (let i = 0; i < vineCount; i++) {
    const startX = (width / (vineCount + 1)) * (i + 0.5) + (Math.sin(seed + i) * 30);
    const dropLength = (height * 0.18) + (Math.cos(seed + i * 2) * (height * 0.12));

    // Vine stem
    ctx.strokeStyle = '#2B4A34';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.bezierCurveTo(startX - 15, dropLength * 0.4, startX + 20, dropLength * 0.7, startX + 5, dropLength);
    ctx.stroke();

    // Leaves along vine
    const leafSteps = 6;
    for (let j = 1; j <= leafSteps; j++) {
      const ly = (dropLength / leafSteps) * j;
      const lx = startX + Math.sin(j + i) * 12;
      const leafRadius = 14 + (Math.sin(j + seed) * 6);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(lx + 2, ly + 3, leafRadius, leafRadius * 0.6, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Leaf base
      ctx.fillStyle = leafColor;
      ctx.beginPath();
      ctx.ellipse(lx, ly, leafRadius, leafRadius * 0.6, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Leaf highlight
      ctx.fillStyle = highlightColor;
      ctx.beginPath();
      ctx.ellipse(lx - 2, ly - 2, leafRadius * 0.5, leafRadius * 0.3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Optional pink bougainvillea flower buds
      if (styleId === 'vertical' && j % 2 === 0) {
        ctx.fillStyle = '#E63980';
        ctx.beginPath();
        ctx.arc(lx + 8, ly - 4, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

function drawBotanicalCornerAccents(ctx: CanvasRenderingContext2D, width: number, height: number, styleId: string, seed: number) {
  ctx.save();
  const potColor = styleId === 'tropical' ? '#B85D38' : styleId === 'minimalist' ? '#2A2E2B' : '#655345';

  // Left Corner Planter
  const leftX = width * 0.12;
  const leftY = height * 0.88;
  const leftPotW = width * 0.14;
  const leftPotH = height * 0.18;

  // Planter base shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(leftX, leftY + leftPotH * 0.45, leftPotW * 0.7, leftPotH * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Planter body
  ctx.fillStyle = potColor;
  ctx.beginPath();
  ctx.ellipse(leftX, leftY, leftPotW * 0.5, leftPotH * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lush Foliage fan erupting from left planter
  const fanCount = 9;
  for (let f = 0; f < fanCount; f++) {
    const angle = -Math.PI * 0.8 + (Math.PI * 0.65 * (f / fanCount));
    const frondLen = height * 0.28 + (Math.sin(f + seed) * 20);
    const tipX = leftX + Math.cos(angle) * frondLen;
    const tipY = (leftY - leftPotH * 0.2) + Math.sin(angle) * frondLen;

    ctx.strokeStyle = '#184725';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(leftX, leftY - leftPotH * 0.2);
    ctx.quadraticCurveTo(leftX + Math.cos(angle) * (frondLen * 0.5), tipY - 20, tipX, tipY);
    ctx.stroke();

    ctx.strokeStyle = '#439B54';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  // Right Corner Planter
  const rightX = width * 0.88;
  const rightY = height * 0.86;
  const rightPotW = width * 0.12;
  const rightPotH = height * 0.16;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(rightX, rightY + rightPotH * 0.45, rightPotW * 0.7, rightPotH * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = potColor;
  ctx.beginPath();
  ctx.ellipse(rightX, rightY, rightPotW * 0.5, rightPotH * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sculptural architectural plant (Sansevieria or Ficus)
  const leafCount = 7;
  for (let l = 0; l < leafCount; l++) {
    const lx = rightX - 25 + l * 8;
    const h = height * 0.24 + Math.sin(l * 1.5) * 25;
    ctx.fillStyle = l % 2 === 0 ? '#1E492B' : '#2D6B3F';
    ctx.beginPath();
    ctx.moveTo(lx - 8, rightY - 10);
    ctx.lineTo(lx, rightY - h);
    ctx.lineTo(lx + 8, rightY - 10);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawFloorHardscapeAccent(ctx: CanvasRenderingContext2D, width: number, height: number, styleId: string) {
  ctx.save();
  const bottomY = height * 0.94;

  if (styleId === 'minimalist' || styleId === 'tropical') {
    // Teakwood Decking border strip
    ctx.fillStyle = 'rgba(92, 58, 33, 0.6)';
    ctx.fillRect(0, bottomY, width, height - bottomY);

    ctx.strokeStyle = 'rgba(45, 25, 12, 0.8)';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, bottomY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  } else if (styleId === 'zen') {
    // Polished black river stones along floor
    ctx.fillStyle = 'rgba(25, 28, 26, 0.75)';
    ctx.fillRect(0, bottomY, width, height - bottomY);
    for (let i = 0; i < width; i += 28) {
      ctx.fillStyle = '#3A403C';
      ctx.beginPath();
      ctx.ellipse(i + 14, bottomY + 12, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawAmbientGardenGlow(ctx: CanvasRenderingContext2D, width: number, height: number, styleId: string) {
  ctx.save();
  // Warm solar garden fairy lights strung along upper railing/ceiling
  const lightCount = 10;
  for (let i = 0; i < lightCount; i++) {
    const x = (width / (lightCount + 1)) * (i + 1);
    const y = height * 0.12 + Math.sin(i * 0.8) * 12;

    const radial = ctx.createRadialGradient(x, y, 2, x, y, 24);
    radial.addColorStop(0, 'rgba(255, 235, 150, 0.9)');
    radial.addColorStop(0.3, 'rgba(255, 190, 80, 0.4)');
    radial.addColorStop(1, 'rgba(255, 180, 50, 0)');

    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF8DB';
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawProposedBadge(ctx: CanvasRenderingContext2D, width: number, height: number, styleName: string) {
  ctx.save();
  const badgeW = Math.min(380, width * 0.45);
  const badgeH = 54;
  const badgeX = width - badgeW - 20;
  const badgeY = 24;

  // Glassmorphic dark badge background
  ctx.fillStyle = 'rgba(20, 46, 32, 0.88)';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
  ctx.fill();

  ctx.strokeStyle = 'rgba(143, 227, 136, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Typography inside badge
  ctx.fillStyle = '#8FE388';
  ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('✨ ROOT & BLOOM PROPOSED DESIGN', badgeX + 16, badgeY + 22);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.fillText(styleName, badgeX + 16, badgeY + 41);

  ctx.restore();
}
