import { ChatMessage, BusinessSector } from "../types/businessTypes";
import { toast } from "sonner";

export const createMessage = (
  text: string,
  sent: boolean,
  type: 'question' | 'response' | 'system' = 'response'
): ChatMessage => ({
  id: Date.now(),
  text,
  timestamp: new Date(),
  sent,
  type
});

export const processSectorSelection = (text: string): BusinessSector | null => {
  const sectorMap: { [key: string]: BusinessSector } = {
    "1": "retail",
    "2": "technology",
    "3": "manufacturing",
    "4": "services",
    "5": "food"
  };
  return sectorMap[text] || null;
};