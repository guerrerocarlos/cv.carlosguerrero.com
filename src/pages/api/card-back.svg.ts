import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

interface CardOptions {
  email?: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  qrUrl?: string;
  widthMm?: number;
  heightMm?: number;
  backBackground?: string;
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
    email: cvData?.basics?.email || 'hi@carlosguerrero.com',
    phone: cvData?.basics?.phone || '+34 653 596 182',
    linkedin: (cvData?.basics?.profiles?.find((p: any) => p.network === 'LinkedIn')?.url) || 'linkedin.com/in/carlosguerrero',
    website: cvData?.basics?.cvUrl || 'cv.carlosguerrero.com',
    qrUrl: 'https://contact.carlosguerrero.com/',
    widthMm: 88.9,
    heightMm: 50.8,
    backBackground: '#fff',
  };
  const w = 1050;
  const h = 600;
  const padX = 90;
  const padY = 170;
  const gap = 90;
  const fs = 44;
  const qrSize = 180;
  const qrDataUrl = await QRCode.toDataURL(defaults.qrUrl, { margin: 0, width: qrSize });
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${defaults.widthMm}mm' height='${defaults.heightMm}mm' viewBox='0 0 ${w} ${h}'>\n<rect width='${w}' height='${h}' fill='${defaults.backBackground}'/>\n<g font-family='Helvetica,sans-serif' font-size='${fs}' fill='#222'>\n  <text x='${padX}' y='${padY}'>Email: ${escapeXML(defaults.email)}</text>\n  <text x='${padX}' y='${padY + gap}'>Phone: ${escapeXML(defaults.phone)}</text>\n  <text x='${padX}' y='${padY + 2*gap}'>LinkedIn: ${escapeXML(defaults.linkedin)}</text>\n  <text x='${padX}' y='${padY + 3*gap}'>Website: ${escapeXML(defaults.website)}</text>\n</g>\n<image href='${qrDataUrl}' x='${w - padX - qrSize}' y='${padY - 30}' width='${qrSize}' height='${qrSize}'/>\n</svg>`;
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}; 