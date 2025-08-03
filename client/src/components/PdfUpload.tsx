import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface PdfUploadProps {
  onFileSelect: (file: File) => void;
}

export default function PdfUpload({ onFileSelect }: PdfUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const MAX_SIZE_MB = 5;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      setError("No file selected.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`PDF must be less than ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file); // Pass to parent
  }, [onFileSelect]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div>
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 rounded-md p-6 py-20 text-center cursor-pointer transition ${selectedFile
            ? "border-green-500 border-dashed bg-gray-200 dark:bg-blue-900"
            : "border-gray-400 border-dashed bg-gray-100 dark:bg-blue-950"
            }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="text-sm text-green-700 dark:text-green-300">
              <span className="underline">{selectedFile.name}</span> uploaded successfully
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Drag & drop a PDF or click to upload</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
