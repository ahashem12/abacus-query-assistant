import * as XLSX from 'xlsx';

export interface CellData {
  value: string;
  background: string | null;
  row: number;
  col: number;
}

export const processExcelFile = (file: File): Promise<CellData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const cells: CellData[] = [];
        
        // Process each cell in the sheet
        Object.keys(firstSheet).forEach(key => {
          if (key[0] === '!') return; // Skip special keys
          
          const cell = firstSheet[key];
          if (!cell) return;
          
          // Get cell background color if it exists
          const background = cell.s?.fgColor?.rgb || null;
          
          // Parse cell address to get row and column
          const match = key.match(/([A-Z]+)(\d+)/);
          if (!match) return;
          
          const col = XLSX.utils.decode_col(match[1]);
          const row = parseInt(match[2]) - 1;
          
          cells.push({
            value: cell.v?.toString() || '',
            background,
            row,
            col
          });
        });
        
        resolve(cells);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsBinaryString(file);
  });
};