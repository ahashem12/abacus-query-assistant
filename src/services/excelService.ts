import { CellData } from "../utils/excelProcessor";
import { searchWeb } from "./searchService";
import { toast } from "sonner";

export const processExcelCells = async (
  cells: CellData[],
  onAskUser: (question: string) => Promise<string>
): Promise<CellData[]> => {
  const processedCells: CellData[] = [];
  
  // First process pink cells (web search)
  const pinkCells = cells.filter(cell => cell.background === 'FFC0CB');
  for (const cell of pinkCells) {
    try {
      const searchResult = await searchWeb(cell.value);
      toast.success(`Found data for ${cell.value}`);
      processedCells.push({ ...cell, value: searchResult });
    } catch (error) {
      toast.error(`Failed to search for ${cell.value}`);
      processedCells.push(cell);
    }
  }

  // Then process yellow cells (user input)
  const yellowCells = cells.filter(cell => cell.background === 'FFFF00');
  for (const cell of yellowCells) {
    try {
      const response = await onAskUser(`Please provide value for: ${cell.value}`);
      processedCells.push({ ...cell, value: response });
    } catch (error) {
      toast.error(`Failed to get user input for ${cell.value}`);
      processedCells.push(cell);
    }
  }

  // Add remaining cells
  const remainingCells = cells.filter(
    cell => cell.background !== 'FFC0CB' && cell.background !== 'FFFF00'
  );
  processedCells.push(...remainingCells);

  return processedCells;
};