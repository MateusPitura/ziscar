import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

interface GeneratePdfProperties {
  html: string;
}

@Injectable()
export class PdfService {
  async generatePdf({
    html,
  }: GeneratePdfProperties): Promise<Uint8Array<ArrayBufferLike>> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    return pdfBuffer;
  }
}
