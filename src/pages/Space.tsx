import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, CheckCircle } from "lucide-react";
import { usePDF } from "@/context/pdfContextProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// PDF.js types
declare global {
  interface Window {
    pdfjsLib: unknown;
  }
}

interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export default function PDFExtractor() {
  const [, setUploadSuccess] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { pdfExtractedText, setPdfExtractedText } = usePDF();
  const navigate = useNavigate();

  const [extractedText, setExtractedText] = useState<ExtractedPage[]>(() => {
    if (!pdfExtractedText) return [];

    try {
      if ((pdfExtractedText?.length || 0) > 0) {
        setUploadSuccess(true)
      }
      const pages = pdfExtractedText.split('\n\n');
      return pages.map(page => {
        const match = page.match(/---PAGE(\d+)---\n(.*)/s);
        return match ? {
          pageNumber: parseInt(match[1]),
          text: match[2]
        } : {
          pageNumber: 0,
          text: page
        };
      });
    } catch (e) {
      console.error("Error parsing stored PDF text:", e);
      return [];
    }
  });

  useEffect(() => {
    if (!window.pdfjsLib) {
      localStorage.setItem('pdfExtractedText', "");
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfLoaded(true);
      };
      script.onerror = () => {
        setError('Failed to load PDF processing library');
      };
      document.head.appendChild(script);
      return () => {
        localStorage.removeItem('pdfExtractedText');
      }
    } else {
      setPdfLoaded(true);
    }
  }, []);

  const extractTextFromPDF = async (file: File): Promise<ExtractedPage[]> => {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js not loaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdf = await (window.pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
    const pages: ExtractedPage[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      pages.push({
        pageNumber: i,
        text: text
      });
    }

    return pages;
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setSuccessMessage(null);

    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      e.target.value = "";
      setUploadSuccess(false);
      return;
    }

    if (file) {
      setSelectedFile(file);
      setUploadSuccess(true);
      setSuccessMessage("PDF file uploaded successfully!");

      if (pdfLoaded) {
        await processPDF(file);
      }
    }
  };

  const processPDF = async (file: File) => {
    setIsExtracting(true);
    setError(null);

    try {
      const pages = await extractTextFromPDF(file);
      setExtractedText(pages);
      // Store in context (which saves to localStorage)
      setPdfExtractedText(pages.map((page) =>
        `---PAGE${page.pageNumber}---\n${page.text || 'No text found on this page'}`
      ).join('\n\n'));
      setSuccessMessage(`Successfully extracted text from ${pages.length} pages`);
    } catch (error) {
      console.error('Error extracting PDF:', error);
      setError("Failed to extract text from PDF. Please try again with a different file.");
    } finally {
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    if (pdfLoaded && selectedFile && !isExtracting) {
      processPDF(selectedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfLoaded, selectedFile]);

  return (
    <div className="p-5 w-full mx-auto">
      <header>
        <div className="border-b-2 pb-3">
          <h2 className="text-3xl font-bold">Subject</h2>
        </div>
      </header>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mt-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-5">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-[#0f0f0f] dark:bg-[#0e0e0e] hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors"
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileText className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>

              {isExtracting && (
                <div className="mt-4 flex items-center gap-2 text-blue-500 dark:text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-semibold">Extracting text...</span>
                </div>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <label className="text-sm">
              {selectedFile ? selectedFile.name : 'No file selected'}
            </label>
          </label>
        </div>
      </div>

      {(extractedText.length > 0 || pdfExtractedText) && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Extracted Text</h2>
              <p className="text-sm text-muted-foreground">
                {extractedText.length} page{extractedText.length !== 1 ? 's' : ''} processed
              </p>
            </div>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">PDF Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {pdfExtractedText || 'No text extracted from the PDF.'}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
      {extractedText.length > 0 && (<div>
        <div className="flex gap-1 mt-3 md:sm:flex-row flex-col w-1/4">
          <div className="border-1 p-4 rounded">
            <p className="text-gray-600 mt-2">Generate 10 Quiz questions based on the extracted text from the PDF.</p>
            <Button
              className="py-2 px-4 rounded w-full bg-blue-500 text-gray-50 hover:bg-blue-600 transition-colors mt-2 cursor-pointer"
              onClick={() => {
                navigate('/dashboard/quiz')
              }}>
              Generate Quiz
            </Button>
          </div>
        </div>
      </div>)
      }
    </div >
  );
}