import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { SETPDF } from "@/redux/pdf-actions";

export default function PdfUpload() {
  const dispatch = useDispatch();

  // @ts-expect-error need to type RootState later
  const file = useSelector((state) => state.file);

  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE_MB = 5;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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
      dispatch(SETPDF(file));
    },
    [dispatch]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div>
      <div className="space-y-4 px-5">
        <div
          {...getRootProps()}
          className={`border-2 rounded-md p-6 py-20 text-center cursor-pointer transition
          ${file ? "border-green-500 border-dashed bg-gray-200 dark:bg-gray-950" : "border-gray-400 border-dashed bg-gray-100 dark:bg-gray-950"}
        `}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="text-sm text-green-700 dark:text-green-300">
              <span className="underline">{file.path}</span> uploaded successfully
            </div>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Drag & drop a PDF or click to upload</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
