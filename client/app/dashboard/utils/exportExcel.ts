import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportExcel = async (
  data: Record<string, any>[],
  columns: { label: string; key: string }[],
  title: string
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add columns
  worksheet.columns = columns.map(col => ({
    header: col.label,
    key: col.key,
    width: 20
  }));

  // Add data
  data.forEach(row => worksheet.addRow(row));

  // Add header styling
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  // Write file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${title}.xlsx`);
};
