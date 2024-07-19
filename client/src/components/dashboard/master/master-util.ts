import ExcelJS from 'exceljs';

type ExcelRow = { [key: string]: string };

export const readExcelFile = async (file: File, columnMappings: { [key: string]: number }): Promise<ExcelRow[]> => {
  if (!file) return [];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const jsonData: ExcelRow[] = [];

    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.worksheets[0];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) { // Skip header row
            const rowData: ExcelRow = {};
            for (const key in columnMappings) {
              rowData[key] = row.getCell(columnMappings[key]).value?.toString() || '';
            }
            jsonData.push(rowData);
          }
        });

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
