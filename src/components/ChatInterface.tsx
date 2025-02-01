import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import FileUpload from "./FileUpload";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage as ChatMessageType, BusinessSector } from "../types/businessTypes";
import { businessTemplates } from "../data/sampleTemplates";
import { processExcelFile, CellData } from "../utils/excelProcessor";
import { getTemplateForSector } from "../services/templateProcessor";
import { createMessage, processSectorSelection } from "../services/chatService";
import { processExcelCells } from "../services/excelService";

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    createMessage(
      "Hello! I'm your business plan assistant. What sector is your business in?\n\n1. Retail\n2. Technology\n3. Manufacturing\n4. Services\n5. Food",
      false,
      'question'
    ),
  ]);
  const [selectedSector, setSelectedSector] = useState<BusinessSector | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<CellData[]>([]);
  const [isProcessingCells, setIsProcessingCells] = useState(false);

  const addMessage = (text: string, sent: boolean, type: 'question' | 'response' | 'system' = 'response') => {
    const newMessage = createMessage(text, sent, type);
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const askUser = async (question: string): Promise<string> => {
    addMessage(question, false, 'question');
    return new Promise((resolve) => {
      const handleResponse = (text: string) => {
        resolve(text);
      };
      // The response will be handled by handleSendMessage
      // This promise will be resolved when the user sends a message
      window.tempResolve = handleResponse;
    });
  };

  const handleSendMessage = async (text: string) => {
    addMessage(text, true);

    if (window.tempResolve) {
      window.tempResolve(text);
      window.tempResolve = null;
      return;
    }

    if (!selectedSector) {
      const sector = processSectorSelection(text);
      if (sector) {
        setSelectedSector(sector);
        const template = getTemplateForSector(sector);
        if (template) {
          setTemplate(template.template);
          addMessage(
            "Great! I've selected the appropriate template for your business. Please upload your Excel file or tell me about your business story.",
            false,
            'question'
          );
        }
      } else {
        addMessage("Please select a valid sector (1-5)", false, 'system');
      }
    } else if (!isProcessingCells) {
      processBusinessStory(text);
    }
  };

  const processBusinessStory = async (story: string) => {
    if (excelData.length > 0 && !isProcessingCells) {
      setIsProcessingCells(true);
      try {
        const processedCells = await processExcelCells(excelData, askUser);
        setExcelData(processedCells);
        addMessage(
          "I've processed all the cells in your Excel file. Is there anything specific you'd like to know about the business plan?",
          false,
          'question'
        );
      } catch (error) {
        toast.error("Error processing cells");
        console.error("Cell processing error:", error);
      } finally {
        setIsProcessingCells(false);
      }
    } else {
      addMessage(
        "Thank you for sharing your story. Please upload an Excel file so I can help you fill in the business plan.",
        false,
        'question'
      );
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const cells = await processExcelFile(file);
      setExcelData(cells);
      
      toast.success(`File ${file.name} uploaded successfully`);
      addMessage(
        `File "${file.name}" has been uploaded. I'll analyze its contents and process cells with pink backgrounds (web search needed) first, then yellow backgrounds (user input needed).`,
        false,
        'system'
      );
      
      // Automatically start processing cells after upload
      processBusinessStory("");
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

// Add this to the global Window interface
declare global {
  interface Window {
    tempResolve: ((value: string) => void) | null;
  }
}

window.tempResolve = null;

export default ChatInterface;