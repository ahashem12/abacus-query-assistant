import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-chat-secondary">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-chat-bg text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chat-accent"
      />
      <button
        type="submit"
        className="bg-chat-accent text-white p-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default ChatInput;