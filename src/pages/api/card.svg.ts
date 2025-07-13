import QRCode from 'qrcode';
import type { APIRoute } from 'astro';

// Helper to escape XML special characters
function escapeXML(str: string): string {
  return str.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}

// Card generator logic
interface CardOptions {
  name?: string;
  title?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  qrUrl?: string;
  widthMm?: number;
  heightMm?: number;
  frontGradientStart?: string;
  frontGradientEnd?: string;
  backBackground?: string;
}

const SCALE = 10;

function buildFront(w: number, h: number, c: Required<CardOptions>): string {
  const [first, ...rest] = escapeXML(c.name).split(' ');
  const last = rest.join(' ');
  const nameFs   = 12 * SCALE;
  const titleFs  = 6  * SCALE;
  const tagFs    = 4  * SCALE;
  const leftPad  = 7 * SCALE;
  const startY   = 18 * SCALE;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${c.widthMm}mm' height='${c.heightMm}mm' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid meet'>\n  <defs>\n    <linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'>\n      <stop offset='0%' stop-color='${c.frontGradientStart}'/>\n      <stop offset='100%' stop-color='${c.frontGradientEnd}'/>\n    </linearGradient>\n  </defs>\n  <rect width='${w}' height='${h}' rx='${12*SCALE}' fill='url(#bg)'/>\n  <text x='${leftPad}' y='${startY}' font-family='Inter,Arial,sans-serif' font-weight='700' font-size='${nameFs}' fill='#FFFFFF'>${first}</text>\n  <text x='${leftPad}' y='${startY + 9.5*SCALE}' font-family='Inter,Arial,sans-serif' font-weight='700' font-size='${nameFs}' fill='#FFFFFF'>${last}</text>\n  <text x='${leftPad}' y='${startY + 19*SCALE}' font-family='Inter,Arial,sans-serif' font-weight='500' font-size='${titleFs}' fill='#E0E0E0'>${escapeXML(c.title)}</text>\n  <text x='${leftPad}' y='${startY + 24.5*SCALE}' font-family='Inter,Arial,sans-serif' font-weight='400' font-size='${tagFs}' fill='#9B9BA5'>${escapeXML(c.tagline)}</text>\n</svg>`;
}

function buildBack(w: number, h: number, c: Required<CardOptions>, qrDataURL: string): string {
  const fsIcon  = 4.2 * SCALE;
  const padX    = 8   * SCALE;
  const padY    = 14  * SCALE;
  const gap     = 8   * SCALE;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${c.widthMm}mm' height='${c.heightMm}mm' viewBox='0 0 ${w} ${h}' preserveAspectRatio='xMidYMid meet'>\n  <rect width='${w}' height='${h}' rx='${12*SCALE}' fill='${c.backBackground}'/>\n  <g font-family='Inter,Arial,sans-serif' font-size='${fsIcon}' fill='#222'>\n    <text x='${padX}' y='${padY}'>${escapeXML(c.email)}</text>\n    <text x='${padX}' y='${padY + gap}'>📞 ${escapeXML(c.phone)}</text>\n    <text x='${padX}' y='${padY + 2*gap}'>🔗 ${escapeXML(c.linkedin)}</text>\n    <text x='${padX}' y='${padY + 3*gap}'>🌐 ${escapeXML(c.website)}</text>\n  </g>\n  <image href='${qrDataURL}' x='${w - 18*SCALE}' y='${10*SCALE}' width='${16*SCALE}' height='${16*SCALE}'/>\n</svg>`;
}

export const GET: APIRoute = async () => {
  let cvData: any = {};
  try {
    cvData = (await import('../../../cv.json')).default;
  } catch (e) {
    // fallback to hardcoded defaults if needed
  }
  const defaults: Required<CardOptions> = {
    name: cvData?.basics?.name || 'Carlos Guerrero',
    title: cvData?.basics?.label || 'Full Stack & DevOps Engineer',
    tagline: 'Building modern solutions and infrastructure',
    email: cvData?.basics?.email || 'hi@carlosguerrero.com',
    phone: cvData?.basics?.phone || '+34 653 596 182',
    linkedin: (cvData?.basics?.profiles?.find((p: any) => p.network === 'LinkedIn')?.url) || 'linkedin.com/in/carlosguerrero',
    website: cvData?.basics?.cvUrl || 'cv.carlosguerrero.com',
    qrUrl: 'https://contact.carlosguerrero.com/',
    widthMm: 88.9,
    heightMm: 50.8,
    frontGradientStart: '#221433',
    frontGradientEnd:   '#1A1029',
    backBackground: '#FFFFFF',
  };
  const c = { ...defaults };
  const w = c.widthMm * SCALE;
  const h = c.heightMm * SCALE;
  // Only front for now
  const svg = buildFront(w, h, c);
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export const GET_BACK: APIRoute = async () => {
  let cvData: any = {};
  try {
    cvData = (await import('../../../cv.json')).default;
  } catch (e) {
    // fallback to hardcoded defaults if needed
  }
  const defaults: Required<CardOptions> = {
    name: cvData?.basics?.name || 'Carlos Guerrero',
    title: cvData?.basics?.label || 'Full Stack & DevOps Engineer',
    tagline: 'Building modern solutions and infrastructure',
    email: cvData?.basics?.email || 'hi@carlosguerrero.com',
    phone: cvData?.basics?.phone || '+34 653 596 182',
    linkedin: (cvData?.basics?.profiles?.find((p: any) => p.network === 'LinkedIn')?.url) || 'linkedin.com/in/carlosguerrero',
    website: cvData?.basics?.cvUrl || 'cv.carlosguerrero.com',
    qrUrl: 'https://contact.carlosguerrero.com/',
    widthMm: 88.9,
    heightMm: 50.8,
    frontGradientStart: '#221433',
    frontGradientEnd:   '#1A1029',
    backBackground: '#FFFFFF',
  };

  // US Letter size in mm
  const letterWidthMm = 215.9;
  const letterHeightMm = 279.4;
  const cardW = defaults.widthMm;
  const cardH = defaults.heightMm;
  const margin = 5; // mm between cards
  const cols = Math.floor((letterWidthMm + margin) / (cardW + margin));
  const rows = Math.floor((letterHeightMm + margin) / (cardH + margin));
  const offsetX = (letterWidthMm - (cols * cardW + (cols - 1) * margin)) / 2;
  const offsetY = (letterHeightMm - (rows * cardH + (rows - 1) * margin)) / 2;

  const qr = await QRCode.toDataURL(defaults.qrUrl, { margin: 0, width: 256 });
  const wPx = letterWidthMm * SCALE;
  const hPx = letterHeightMm * SCALE;
  const cardWPx = cardW * SCALE;
  const cardHPx = cardH * SCALE;
  const marginPx = margin * SCALE;
  const offsetXPx = offsetX * SCALE;
  const offsetYPx = offsetY * SCALE;

  // Generate one card back SVG as a group
  const cardSVG = buildBack(cardWPx, cardHPx, defaults, qr)
    .replace(/^<\?xml[^>]*>\n?/, '')
    .replace(/^<svg[^>]*>|<\/svg>$/g, '');

  let cards = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetXPx + col * (cardWPx + marginPx);
      const y = offsetYPx + row * (cardHPx + marginPx);
      cards += `<g transform='translate(${x},${y})'>${cardSVG}</g>\n`;
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${letterWidthMm}mm' height='${letterHeightMm}mm' viewBox='0 0 ${wPx} ${hPx}' preserveAspectRatio='xMinYMin meet'>\n${cards}</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}; 