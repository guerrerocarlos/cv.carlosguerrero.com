import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

interface CardOptions {
  name?: string;
  title?: string;
  tagline?: string;
  widthMm?: number;
  heightMm?: number;
  frontGradientStart?: string;
}

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

export const GET: APIRoute = async () => {
  let cvData: any = {};
  try {
    cvData = (await import('../../../cv.json')).default;
  } catch (e) {}
  const defaults: Required<CardOptions> = {
    name: cvData?.basics?.name || 'Carlos Guerrero',
    title: cvData?.basics?.label || 'Full Stack & DevOps Engineer',
    tagline: 'Building modern web applications and infrastructure',
    widthMm: 88.9,
    heightMm: 50.8,
    frontGradientStart: '#221433',
  };
  const w = 1050; // ~300dpi for 88.9mm
  const h = 600;  // ~300dpi for 50.8mm
  const leftPad = 80;
  const nameFontSize = 110;
  const titleFontSize = 48;
  const tagFontSize = 32;
  const [first, ...rest] = escapeXML(defaults.name).split(' ');
  const last = rest.join(' ');
  const startY = 210;
  const qrUrl = 'https://cv.carlosguerrero.com/';
  const qrSize = 300;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 0,
    width: qrSize,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#FFFFFF', // White modules
      light: '#00000000' // Transparent background
    }
  });
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${defaults.widthMm}mm' height='${defaults.heightMm}mm' viewBox='0 0 ${w} ${h}'>
<rect width='${w}' height='${h}' fill='${defaults.frontGradientStart}'/>
<text x='${leftPad}' y='${startY}' font-family='Montserrat,Helvetica,sans-serif' font-weight='700' font-size='${nameFontSize}' fill='#fff'>${first}</text>
<text x='${leftPad}' y='${startY + nameFontSize*1.05}' font-family='Montserrat,Helvetica,sans-serif' font-weight='700' font-size='${nameFontSize}' fill='#fff'>${last}</text>
<text x='${leftPad}' y='${startY + nameFontSize*2.15}' font-family='Montserrat,Helvetica,sans-serif' font-weight='700' font-size='${titleFontSize}' fill='#fff'>${escapeXML(defaults.title)}</text>
<text x='${leftPad}' y='${startY + nameFontSize*2.85}' font-family='Montserrat,Helvetica,sans-serif' font-weight='400' font-size='${tagFontSize}' fill='#9B9BA5'>${escapeXML(defaults.tagline)}</text>\n<image href='${qrDataUrl}' x='${w-qrSize-40}' y='40' width='${qrSize}' height='${qrSize}'/>\n</svg>`;
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}; 