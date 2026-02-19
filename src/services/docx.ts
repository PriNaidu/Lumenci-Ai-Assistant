import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  Packer,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ChartData } from '../types';

export async function exportToDocx(chartData: ChartData): Promise<void> {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: '999999',
  };

  const cellBorders = {
    top: borderStyle,
    bottom: borderStyle,
    left: borderStyle,
    right: borderStyle,
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: ['Claim Element', 'Product Feature', 'Evidence'].map(
      (text) =>
        new TableCell({
          borders: cellBorders,
          shading: { fill: 'E2E8F0' },
          children: [
            new Paragraph({
              children: [new TextRun({ text, bold: true, size: 20, font: 'Calibri' })],
            }),
          ],
        })
    ),
  });

  const dataRows = chartData.elements.map(
    (el) =>
      new TableRow({
        children: [el.claimElement, el.productFeature, el.evidence].map(
          (text) =>
            new TableCell({
              borders: cellBorders,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: text || '', size: 20, font: 'Calibri' })],
                }),
              ],
            })
        ),
      })
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: chartData.title,
                bold: true,
                size: 32,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Generated: ${new Date().toLocaleDateString()}`,
                size: 20,
                color: '666666',
                font: 'Calibri',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = chartData.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  saveAs(blob, `${filename}_refined.docx`);
}
