import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

interface CardOptions {
  qrUrl?: string;
  widthMm?: number;
  heightMm?: number;
  backBackground?: string;
}

export const GET: APIRoute = async () => {
  try {
    // cvData = (await import('../../../cv.json')).default;
  } catch (e) {}
  const defaults: Required<CardOptions> = {
    qrUrl: 'https://carlosguerrero.com/whatsapp',
    widthMm: 88.9,
    heightMm: 50.8,
    backBackground: '#000',
  };
  const w = 1050;
  const h = 600;
  const qrSize = 260;
  const logoSize = 80;
  // Three QR codes: WhatsApp (left), LinkedIn (center), Instagram (right)
  const margin = 80;
  const space = (w - 2 * margin - 3 * qrSize) / 2;
  const whatsappQrX = margin;
  const linkedinQrX = margin + qrSize + space;
  const instagramQrX = margin + 2 * (qrSize + space);
  // WhatsApp QR
  const qrDataUrl = await QRCode.toDataURL(defaults.qrUrl, {
    margin: 0,
    width: qrSize,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#FFFFFF',
      light: '#00000000'
    }
  });
  // LinkedIn QR
  const linkedinUrl = 'https://carlosguerrero.com/linkedin';
  const linkedinQrDataUrl = await QRCode.toDataURL(linkedinUrl, {
    margin: 0,
    width: qrSize,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#FFFFFF',
      light: '#00000000'
    }
  });
  // Instagram QR
  const instagramUrl = 'https://instagram.com/guerrerocarlos';
  const instagramQrDataUrl = await QRCode.toDataURL(instagramUrl, {
    margin: 0,
    width: qrSize,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#FFFFFF',
      light: '#00000000'
    }
  });
  // LinkedIn logo SVG (from public/linkedin-icon.svg, scaled to logoSize)
  const linkedinSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}" viewBox="7.025 7.025 497.951 497.95"><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="-974.482" y1="1306.773" x2="-622.378" y2="1658.877" gradientTransform="translate(1054.43 -1226.825)"><stop offset="0" stop-color="#2489be"/><stop offset="1" stop-color="#0575b3"/></linearGradient><path d="M256 7.025C118.494 7.025 7.025 118.494 7.025 256S118.494 504.975 256 504.975 504.976 393.506 504.976 256C504.975 118.494 393.504 7.025 256 7.025zm-66.427 369.343h-54.665V199.761h54.665v176.607zM161.98 176.633c-17.853 0-32.326-14.591-32.326-32.587 0-17.998 14.475-32.588 32.326-32.588s32.324 14.59 32.324 32.588c.001 17.997-14.472 32.587-32.324 32.587zm232.45 199.735h-54.4v-92.704c0-25.426-9.658-39.619-29.763-39.619-21.881 0-33.312 14.782-33.312 39.619v92.704h-52.43V199.761h52.43v23.786s15.771-29.173 53.219-29.173c37.449 0 64.257 22.866 64.257 70.169l-.001 111.825z" fill="url(#a)"/></svg>`;
  // Instagram logo SVG (simple two-tone: white glyph on Instagram pink/purple circle)
  const instagramSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='${logoSize}' height='${logoSize}' viewBox='0 0 32 32'>
    <circle cx='16' cy='16' r='16' fill='#E1306C'/>
    <rect x='9' y='9' width='14' height='14' rx='4' fill='none' stroke='#fff' stroke-width='2'/>
    <circle cx='16' cy='16' r='4' fill='none' stroke='#fff' stroke-width='2'/>
    <circle cx='21.5' cy='10.5' r='1.2' fill='#fff'/>
  </svg>`;
  // Center Y for all QR codes (move higher to center in black area)
  const barHeight = 160;
  const blackAreaHeight = h - barHeight;
  const qrY = blackAreaHeight/2 - qrSize/2 - 10;
  // Logo positions
  const whatsappLogoX = whatsappQrX + qrSize/2 - logoSize/2;
  const linkedinLogoX = linkedinQrX + qrSize/2 - logoSize/2;
  const instagramLogoX = instagramQrX + qrSize/2 - logoSize/2;
  const logoY = qrY + qrSize/2 - logoSize/2;
  const whatsappSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='${logoSize}' height='${logoSize}' viewBox='0 0 24 24'><g><path fill='#25D366' d='M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.58 1.38 5.06L2 22l5.13-1.35A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z'/><path fill='#FFF' d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347Z'/></g></svg>`;
  // Add a white bar at the bottom for writing
  // Make the bar bigger and remove round borders
  const barY = h - barHeight;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${defaults.widthMm}mm' height='${defaults.heightMm}mm' viewBox='0 0 ${w} ${h}'>\n<rect width='${w}' height='${h}' fill='${defaults.backBackground}'/>
<image href='${qrDataUrl}' x='${whatsappQrX}' y='${qrY}' width='${qrSize}' height='${qrSize}'/>
<circle cx='${whatsappQrX+qrSize/2}' cy='${qrY+qrSize/2}' r='${logoSize/2+10}' fill='#fff'/>
<g transform='translate(${whatsappLogoX},${logoY})'>${whatsappSVG}</g>
<image href='${linkedinQrDataUrl}' x='${linkedinQrX}' y='${qrY}' width='${qrSize}' height='${qrSize}'/>
<circle cx='${linkedinQrX+qrSize/2}' cy='${qrY+qrSize/2}' r='${logoSize/2+10}' fill='#fff'/>
<g transform='translate(${linkedinLogoX},${logoY})'>${linkedinSVG}</g>
<image href='${instagramQrDataUrl}' x='${instagramQrX}' y='${qrY}' width='${qrSize}' height='${qrSize}'/>
<circle cx='${instagramQrX+qrSize/2}' cy='${qrY+qrSize/2}' r='${logoSize/2+10}' fill='#fff'/>
<g transform='translate(${instagramLogoX},${logoY})'>${instagramSVG}</g>
<rect x='0' y='${barY}' width='${w}' height='${barHeight}' fill='#fff'/>
</svg>`;
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}; 