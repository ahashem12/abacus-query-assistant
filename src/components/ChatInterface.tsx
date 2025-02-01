import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import FileUpload from "./FileUpload";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage as ChatMessageType, BusinessSector } from "../types/businessTypes";
import { businessTemplates } from "../data/sampleTemplates";

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

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: messages.length + 1,
      text,
      timestamp: new Date(),
      sent: true
    };
    setMessages(prev => [...prev, userMessage]);

    // Process user input
    if (!selectedSector) {
      // Handle sector selection
      const sector = processSectorSelection(text);
      if (sector) {
        setSelectedSector(sector);
        const template = businessTemplates.find(t => t.sector === sector);
        if (template) {
          setTemplate(template.template);
          const responseMessage: ChatMessageType = {
            id: messages.length + 2,
            text: "Great! I've selected the appropriate template for your business. Tell me about your business story - how did it start and what's your vision?",
            timestamp: new Date(),
            sent: false,
            type: 'question'
          };
          setMessages(prev => [...prev, responseMessage]);
        }
      } else {
        const errorMessage: ChatMessageType = {
          id: messages.length + 2,
          text: "Please select a valid sector (1-5)",
          timestamp: new Date(),
          sent: false,
          type: 'system'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } else {
      // Process business story and ask follow-up questions
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

  const processBusinessStory = (story: string) => {
    console.log("Processing business story:", story);
    // Add follow-up question
    const followUpMessage: ChatMessageType = {
      id: messages.length + 2,
      text: "Thank you for sharing your story. What's your expected revenue for the first year?",
      timestamp: new Date(),
      sent: false,
      type: 'question'
    };
    setMessages(prev => [...prev, followUpMessage]);
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Here you would process the file content
        // For now, just show a success message
        toast.success(`File ${file.name} uploaded successfully`);
        
        const message: ChatMessageType = {
          id: messages.length + 1,
          text: `File "${file.name}" has been uploaded. I'll analyze its contents.`,
          timestamp: new Date(),
          sent: false,
          type: 'system'
        };
        setMessages(prev => [...prev, message]);
      } catch (error) {
        toast.error("Error processing file");
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (template) {
      // For demo purposes, we'll create a simple text file
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