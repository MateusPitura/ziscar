import { Injectable } from '@nestjs/common';
import { Workbook, Worksheet } from 'exceljs';

@Injectable()
export class SheetService {
  async generateSheet(
    sheetName: string,
    generateSheetCallback: (sheet: Worksheet) => void,
  ): Promise<Buffer> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    generateSheetCallback(worksheet);

    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }
}
