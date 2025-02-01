import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import FileUpload from "./FileUpload";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage as ChatMessageType, BusinessSector } from "../types/businessTypes";
import { businessTemplates } from "../data/sampleTemplates";
import { processExcelFile, CellData } from "../utils/excelProcessor";
import { processCellBackground, getTemplateForSector } from "../services/templateProcessor";
import { searchWeb } from "../services/searchService";

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 1,
      text: "Hello! I'm your business plan assistant. What sector is your business in?\n\n1. Retail\n2. Technology\n3. Manufacturing\n4. Services\n5. Food",
      timestamp: new Date(),
      sent: false,
      type: 'question'
    },
  ]);
  const [selectedSector, setSelectedSector] = useState<BusinessSector | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<CellData[]>([]);

  const addMessage = (text: string, sent: boolean, type: 'question' | 'response' | 'system' = 'response') => {
    const newMessage: ChatMessageType = {
      id: messages.length + 1,
      text,
      timestamp: new Date(),
      sent,
      type
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const askUser = async (question: string): Promise<string> => {
    addMessage(question, false, 'question');
    // In a real implementation, you would wait for user input
    // For now, we'll return a mock response
    return "Mock user response";
  };

  const handleSendMessage = async (text: string) => {
    addMessage(text, true);

    if (!selectedSector) {
      const sector = processSectorSelection(text);
      if (sector) {
        setSelectedSector(sector);
        const template = getTemplateForSector(sector);
        if (template) {
          setTemplate(template.template);
          addMessage(
            "Great! I've selected the appropriate template for your business. Tell me about your business story - how did it start and what's your vision?",
            false,
            'question'
          );
        }
      } else {
        addMessage("Please select a valid sector (1-5)", false, 'system');
      }
    } else {
      processBusinessStory(text);
    }
  };

  const processSectorSelection = (text: string): BusinessSector | null => {
    const sectorMap: { [key: string]: BusinessSector } = {
      "1": "retail",
      "2": "technology",
      "3": "manufacturing",
      "4": "services",
      "5": "food"
    };
    return sectorMap[text] || null;
  };

  const processBusinessStory = async (story: string) => {
    console.log("Processing business story:", story);
    
    if (excelData.length > 0) {
      const processedCells = await processCellBackground(
        excelData,
        askUser,
        searchWeb
      );
      setExcelData(processedCells);
      addMessage("I've processed your Excel file and updated the cells accordingly.", false, 'system');
    }

    addMessage(
      "Thank you for sharing your story. What's your expected revenue for the first year?",
      false,
      'question'
    );
  };

  const handleFileUpload = async (file: File) => {
    try {
      const cells = await processExcelFile(file);
      setExcelData(cells);
      
      toast.success(`File ${file.name} uploaded successfully`);
      addMessage(
        `File "${file.name}" has been uploaded. I'll analyze its contents and process cells with yellow (user input needed) and pink (web search needed) backgrounds.`,
        false,
        'system'
      );
    } catch (error) {
      toast.error("Error processing file");
      console.error("File processing error:", error);
    }
  };

  const handleDownload = () => {
    if (template) {
      const blob = new Blob([`Sample template for ${selectedSector} sector`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business_plan_template_${selectedSector}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Template downloaded successfully");
    } else {
      toast.error("No template available");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      <div className="flex justify-between items-center p-4 bg-chat-secondary">
        <h1 className="text-white text-xl font-bold">Business Plan Assistant</h1>
        <div className="flex gap-4">
          <FileUpload onFileUpload={handleFileUpload} />
          {template && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-chat-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-lg"
            >
              <Download size={20} />
              Download Template
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto messages-container p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            timestamp={message.timestamp}
            sent={message.sent}
          />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;