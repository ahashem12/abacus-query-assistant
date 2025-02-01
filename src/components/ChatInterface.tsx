import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import FileUpload from "./FileUpload";
import { Download } from "lucide-react";
import { ChatMessage as ChatMessageType, BusinessSector } from "../types/businessTypes";
import { businessTemplates } from "../data/sampleTemplates";

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 1,
      text: "مرحباً! أنا مساعدك في إعداد خطة العمل. ما هو قطاع عملك؟\n\n1. تجارة التجزئة\n2. التكنولوجيا\n3. التصنيع\n4. الخدمات\n5. الطعام",
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
            text: "رائع! لقد تم اختيار النموذج المناسب. أخبرني عن قصة عملك وكيف بدأت الفكرة؟",
            timestamp: new Date(),
            sent: false,
            type: 'question'
          };
          setMessages(prev => [...prev, responseMessage]);
        }
      }
    } else {
      // Handle business story and other questions
      // Here you would implement the logic to process the story
      // and fill the template with the provided information
      processBusinessStory(text);
    }
  };

  const processSectorSelection = (text: string): BusinessSector | null => {
    // Simple mapping of numeric responses to sectors
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
    // Here you would implement the logic to extract relevant information
    // from the story and fill the template
    console.log("Processing business story:", story);
    // Add follow-up questions as needed
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    // Implement file processing logic
  };

  const handleDownload = () => {
    if (template) {
      // Implement template download logic
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${template}`;
      link.download = 'business_plan_template.xlsx';
      link.click();
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