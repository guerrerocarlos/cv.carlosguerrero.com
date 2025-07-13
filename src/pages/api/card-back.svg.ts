import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

interface CardOptions {
  qrUrl?: string;
  widthMm?: number;
  heightMm?: number;
  backBackground?: string;
}

export const GET: APIRoute = async () => {
  let cvData: any = {};
  try {
    cvData = (await import('../../../cv.json')).default;
  } catch (e) {}
  const defaults: Required<CardOptions> = {
    qrUrl: 'https://carlosguerrero.com/whatsapp',
    widthMm: 88.9,
    heightMm: 50.8,
    backBackground: '#fff',
  };
  const w = 1050;
  const h = 600;
  const qrSize = 260;
  const logoSize = 80;
  const qrDataUrl = await QRCode.toDataURL(defaults.qrUrl, { margin: 0, width: qrSize, errorCorrectionLevel: 'H' });
  const text = '';
  const handleText = '@guerrerocarlos';

  const fontSize = 44;
  const logoX = w/2 - logoSize/2;
  const logoY = h/2 - logoSize/2 - 30;
  const whatsappSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='${logoSize}' height='${logoSize}' viewBox='0 0 24 24'><g><path fill='#25D366' d='M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.58 1.38 5.06L2 22l5.13-1.35A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z'/><path fill='#FFF' d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347Z'/></g></svg>`;
  const handleFontSize = 52;
  // Place the text closer to the QR code
  const textY = (h + qrSize) / 2 + 30; // just below the QR code
  const handleY = textY + handleFontSize + 6; // small gap below the URL
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${defaults.widthMm}mm' height='${defaults.heightMm}mm' viewBox='0 0 ${w} ${h}'>\n<rect width='${w}' height='${h}' fill='${defaults.backBackground}'/>\n<image href='${qrDataUrl}' x='${(w-qrSize)/2}' y='${(h-qrSize)/2-30}' width='${qrSize}' height='${qrSize}'/>\n<circle cx='${w/2}' cy='${h/2-30}' r='${logoSize/2+10}' fill='#fff'/>
<g transform='translate(${logoX},${logoY})'>${whatsappSVG}</g>\n<text x='${w/2}' y='${textY}' font-family='Helvetica,sans-serif' font-size='${fontSize}' fill='#222' text-anchor='middle'>${text}</text>\n<text x='${w/2}' y='${handleY}' font-family='Helvetica,sans-serif' font-size='${handleFontSize}' fill='#222' text-anchor='middle'>${handleText}</text>\n</svg>`;
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}; 