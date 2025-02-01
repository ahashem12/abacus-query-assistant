import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 bg-chat-secondary hover:bg-opacity-80 text-white px-4 py-2 rounded-lg cursor-pointer">
        <Upload size={20} />
        Upload File
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx,.xls,.doc,.docx,.pdf"
        />
      </label>
    </div>
  );
};

export default FileUpload;