import { Button } from "@/components/ui/button";
import { usePDF } from "@/context/pdfContextProvider"
import { useUser } from "@/context/userContextProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Generate() {
    const navigate = useNavigate();
    const { pdfExtractedText } = usePDF();
    const { user } = useUser();
    console.log("PDF Extracted Text:", pdfExtractedText);

    const generateButtons = [
        {
            title: "Generate Quiz",
            description: "Generate 10 Quiz questions based on the extracted text from the PDF.",
            function: "handleGenerateQuiz",
        },
        {
            title: "Generate Flashcards",
            description: "Ge 10 flashcards from the extracted text to help with memorization.",
            function: "handleGenerateFlashcards",
        },
        {
            title: "Generate Summary",
            description: "Generate a concise summary of the extracted text from the PDF.",
            function: "handleGenerateSummary",
        },
    ]

    const handleGenerateQuiz = () => {
        console.log("Generating Quiz...");
    }
    const handleGenerateFlashcards = () => {
        console.log("Generating Flashcards...");
    }
    const handleGenerateSummary = () => {
        console.log("Generating Summary...");
    }

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="p-5">
            <h2 className="text-3xl font-bold pb-3 border-b-2">Subject</h2>
            <div className="flex gap-1 mt-3 md:sm:flex-row flex-col">
                {generateButtons.map((button, index) => (
                    <div key={index} className="border-1 p-4 rounded">
                        <p className="text-gray-600 mt-2">{button.description}</p>
                        <Button
                            className="py-2 px-4 rounded w-full bg-blue-500 text-gray-50 hover:bg-blue-600 transition-colors mt-2 cursor-pointer"
                            onClick={() => {
                                if (button.function === "handleGenerateQuiz") {
                                    handleGenerateQuiz();
                                } else if (button.function === "handleGenerateFlashcards") {
                                    handleGenerateFlashcards();
                                } else if (button.function === "handleGenerateSummary") {
                                    handleGenerateSummary();
                                }
                            }}>
                            {button.title}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
