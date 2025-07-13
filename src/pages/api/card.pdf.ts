import type { APIRoute } from 'astro';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

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
    tagline: 'Building modern web applications and infrastructure',
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
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
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
      // Draw a single solid background rectangle (use gradStart color)
      page.drawRectangle({
        x,
        y,
        width: cardW,
        height: cardH,
        color: rgb(gradStart[0], gradStart[1], gradStart[2]),
      });
      // Name (split first/last)
      const [first, ...rest] = defaults.name.split(' ');
      const last = rest.join(' ');
      const nameFontSize = cardH * 0.32;
      const titleFontSize = cardH * 0.14;
      const tagFontSize = cardH * 0.10;
      const leftPad = cardW * 0.08;
      const startY = y + cardH * 0.68;
      page.drawText(first, {
        x: x + leftPad,
        y: startY,
        size: nameFontSize,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      page.drawText(last, {
        x: x + leftPad,
        y: startY - nameFontSize * 1.05,
        size: nameFontSize,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      page.drawText(defaults.title, {
        x: x + leftPad,
        y: startY - nameFontSize * 2.15,
        size: titleFontSize,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      page.drawText(defaults.tagline, {
        x: x + leftPad,
        y: startY - nameFontSize * 2.85,
        size: tagFontSize,
        font: fontRegular,
        color: rgb(0.61, 0.61, 0.65),
        maxWidth: cardW - leftPad * 2,
      });
    }
  }

  // --- BACK PAGE ---
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);
  const qrDataUrl = await QRCode.toDataURL(defaults.qrUrl, { margin: 0, width: 128 });
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
      page2.drawText(`Email: ${defaults.email}`, {
        x: x + padX,
        y: y + cardH - padY,
        size: fsIcon,
        font: fontRegular,
        color: rgb(0.13, 0.13, 0.13),
      });
      page2.drawText(`Phone: ${defaults.phone}`, {
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
      page2.drawText(`Website: ${defaults.website}`, {
        x: x + padX,
        y: y + cardH - padY - 3 * gap,
        size: fsIcon,
        font: fontRegular,
        color: rgb(0.13, 0.13, 0.13),
      });
      // QR code
      const qrSize = cardH * 0.45;
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
      'Content-Disposition': 'attachment; filename="card.pdf"',
    },
  });
}; 