import { useState } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

interface Message {
  id: number;
  text: string;
  timestamp: Date;
  sent: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to the chat!",
      timestamp: new Date(),
      sent: false,
    },
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      timestamp: new Date(),
      sent: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-chat-bg">
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

export default Index;