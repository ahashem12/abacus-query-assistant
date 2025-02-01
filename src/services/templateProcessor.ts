import { BusinessSector, BusinessTemplate } from '../types/businessTypes';
import { businessTemplates } from '../data/sampleTemplates';
import { CellData } from '../utils/excelProcessor';

export const getTemplateForSector = (sector: BusinessSector): BusinessTemplate | undefined => {
  return businessTemplates.find(template => template.sector === sector);
};

export const processCellBackground = async (
  cells: CellData[],
  onAskUser: (question: string) => Promise<string>,
  onSearch: (query: string) => Promise<string>
) => {
  const processedCells: CellData[] = [];
  
  for (const cell of cells) {
    if (cell.background === 'FFFF00') { // Yellow background
      const response = await onAskUser(`Please provide value for cell ${cell.value}:`);
      processedCells.push({ ...cell, value: response });
    } else if (cell.background === 'FFC0CB') { // Pink background
      const searchResult = await onSearch(cell.value);
      processedCells.push({ ...cell, value: searchResult });
    } else {
      processedCells.push(cell);
    }
  }
  
  return processedCells;
};