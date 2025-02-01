import { format } from "date-fns";

interface ChatMessageProps {
  message: string;
  timestamp: Date;
  sent: boolean;
}

const ChatMessage = ({ message, timestamp, sent }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${sent ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          sent ? "bg-chat-sent" : "bg-chat-received"
        }`}
      >
        <p className="text-white">{message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {format(timestamp, "HH:mm")}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;