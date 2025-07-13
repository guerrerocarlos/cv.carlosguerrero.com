import type { APIRoute } from 'astro';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

// mm to points (1 inch = 25.4mm, 1 point = 1/72 inch)
const mmToPt = (mm: number) => (mm / 25.4) * 72;

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

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

export const GET: APIRoute = async () => {
  let cvData: any = {};
  try {
    cvData = (await import('../../../cv.json')).default;
  } catch (e) {}
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

  // US Letter size
  const letterWidthMm = 215.9;
  const letterHeightMm = 279.4;
  const cardWmm = defaults.widthMm;
  const cardHmm = defaults.heightMm;
  const marginMm = 5;
  const cols = Math.floor((letterWidthMm + marginMm) / (cardWmm + marginMm));
  const rows = Math.floor((letterHeightMm + marginMm) / (cardHmm + marginMm));
  const offsetXmm = (letterWidthMm - (cols * cardWmm + (cols - 1) * marginMm)) / 2;
  const offsetYmm = (letterHeightMm - (rows * cardHmm + (rows - 1) * marginMm)) / 2;

  // Convert to points
  const pageWidth = mmToPt(letterWidthMm);
  const pageHeight = mmToPt(letterHeightMm);
  const cardW = mmToPt(cardWmm);
  const cardH = mmToPt(cardHmm);
  const margin = mmToPt(marginMm);
  const offsetX = mmToPt(offsetXmm);
  const offsetY = mmToPt(offsetYmm);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Colors
  const gradStart = hexToRgb(defaults.frontGradientStart);
  const gradEnd = hexToRgb(defaults.frontGradientEnd);

  // --- FRONT PAGE ---
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * (cardW + margin);
      const y = pageHeight - (offsetY + (row + 1) * cardH + row * margin);
      // Simulate vertical gradient by drawing many thin rectangles
      const gradSteps = 40;
      for (let i = 0; i < gradSteps; i++) {
        const t = i / (gradSteps - 1);
        const r = gradStart[0] * (1 - t) + gradEnd[0] * t;
        const g = gradStart[1] * (1 - t) + gradEnd[1] * t;
        const b = gradStart[2] * (1 - t) + gradEnd[2] * t;
        page.drawRectangle({
          x,
          y: y + (cardH * i) / gradSteps,
          width: cardW,
          height: cardH / gradSteps,
          color: rgb(r, g, b),
        });
      }
      // Name (split first/last)
      const [first, ...rest] = defaults.name.split(' ');
      const last = rest.join(' ');
      const nameFontSize = cardH * 0.27;
      const titleFontSize = cardH * 0.13;
      const tagFontSize = cardH * 0.08;
      const leftPad = cardW * 0.08;
      const startY = y + cardH * 0.35;
      page.drawText(first, {
        x: x + leftPad,
        y: startY,
        size: nameFontSize,
        font,
        color: rgb(1, 1, 1),
      });
      page.drawText(last, {
        x: x + leftPad,
        y: startY - nameFontSize * 0.8,
        size: nameFontSize,
        font,
        color: rgb(1, 1, 1),
      });
      page.drawText(defaults.title, {
        x: x + leftPad,
        y: startY - nameFontSize * 1.8,
        size: titleFontSize,
        font: fontRegular,
        color: rgb(0.88, 0.88, 0.88),
      });
      page.drawText(defaults.tagline, {
        x: x + leftPad,
        y: startY - nameFontSize * 2.3,
        size: tagFontSize,
        font: fontRegular,
        color: rgb(0.61, 0.61, 0.65),
      });
    }
  }

  // --- BACK PAGE ---
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  // Generate QR code PNG as Uint8Array
  const qrDataUrl = await QRCode.toDataURL(defaults.qrUrl, { margin: 0, width: 128 });
  // Convert data URL to Uint8Array
  function dataURLtoUint8Array(dataURL: string) {
    const base64 = dataURL.split(',')[1];
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  const qrPngBytes = dataURLtoUint8Array(qrDataUrl);
  const qrImage = await pdfDoc.embedPng(qrPngBytes);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * (cardW + margin);
      const y = pageHeight - (offsetY + (row + 1) * cardH + row * margin);
      // Card background
      page2.drawRectangle({
        x,
        y,
        width: cardW,
        height: cardH,
        color: rgb(1, 1, 1),
      });
      // Contact info
      const fsIcon = cardH * 0.09;
      const padX = cardW * 0.09;
      const padY = cardH * 0.28;
      const gap = cardH * 0.16;
      page2.drawText(`${defaults.email}`, {
        x: x + padX,
        y: y + cardH - padY,
        size: fsIcon,
        font: fontRegular,
        color: rgb(0.13, 0.13, 0.13),
      });
      page2.drawText(`Tel: ${defaults.phone}`, {
        x: x + padX,
        y: y + cardH - padY - gap,
        size: fsIcon,
        font: fontRegular,
        color: rgb(0.13, 0.13, 0.13),
      });
      page2.drawText(`LinkedIn: ${defaults.linkedin}`, {
        x: x + padX,
        y: y + cardH - padY - 2 * gap,
        size: fsIcon,
        font: fontRegular,
        color: rgb(0.13, 0.13, 0.13),
      });
      page2.drawText(`Web: ${defaults.website}`, {
        x: x + padX,
        y: y + cardH - padY - 3 * gap,
        size: fsIcon,
        font: fontRegular,
        color: rgb(0.13, 0.13, 0.13),
      });
      // QR code
      const qrSize = cardH * 0.32;
      page2.drawImage(qrImage, {
        x: x + cardW - padX - qrSize,
        y: y + padY - qrSize * 0.5,
        width: qrSize,
        height: qrSize,
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="card-front.pdf"',
    },
  });
}; 