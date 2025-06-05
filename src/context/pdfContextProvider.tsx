import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface PDFContextType {
    globalSpaceName: string | null;
    pdfExtractedText: string | null;
    difficulty: 'easy' | 'medium' | 'hard' | null;
    llmResponse: string | null;
    summary: string | null;
    setGlobalSpaceName: (name: string | null) => void;
    setPdfExtractedText: (text: string | null) => void;
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard' | null) => void;
    setLlmResponse: (response: string | null) => void;
    setSummary: (summary: string | null) => void;
}

interface PDFProviderProps {
    children: ReactNode;
}

const PDFContext = createContext<PDFContextType | null>(null);

// Helper function to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    }
    return defaultValue;
};

export const PDFProvider: React.FC<PDFProviderProps> = ({ children }) => {
    const [globalSpaceName, setGlobalSpaceName] = useState<string | null>(
        getInitialState('globalSpaceName', null)
    );
    const [pdfExtractedText, setPdfExtractedText] = useState<string | null>(
        getInitialState('pdfExtractedText', null)
    );
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(
        getInitialState('difficulty', null)
    );
    const [llmResponse, setLlmResponse] = useState<string | null>(
        getInitialState('llmResponse', null)
    );
    const [summary, setSummary] = useState<string | null>(
        getInitialState('summary', null)
    );

    // Update localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('globalSpaceName', JSON.stringify(globalSpaceName));
    }, [globalSpaceName]);

    useEffect(() => {
        localStorage.setItem('pdfExtractedText', JSON.stringify(pdfExtractedText));
    }, [pdfExtractedText]);

    useEffect(() => {
        localStorage.setItem('difficulty', JSON.stringify(difficulty));
    }, [difficulty]);

    useEffect(() => {
        localStorage.setItem('llmResponse', JSON.stringify(llmResponse));
    }, [llmResponse]);

    useEffect(() => {
        localStorage.setItem('summary', JSON.stringify(summary));
    }, [summary]);

    // Wrapper functions to update both state and localStorage
    const updateGlobalSpaceName = (name: string | null) => {
        setGlobalSpaceName(name);
    };

    const updatePdfExtractedText = (text: string | null) => {
        setPdfExtractedText(text);
    };

    const updateDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | null) => {
        setDifficulty(difficulty);
    };

    const updateLlmResponse = (response: string | null) => {
        setLlmResponse(response);
    };

    const updateSummary = (summary: string | null) => {
        setSummary(summary);
    };

    const value: PDFContextType = {
        globalSpaceName,
        pdfExtractedText,
        difficulty,
        llmResponse,
        summary,
        setGlobalSpaceName: updateGlobalSpaceName,
        setPdfExtractedText: updatePdfExtractedText,
        setDifficulty: updateDifficulty,
        setLlmResponse: updateLlmResponse,
        setSummary: updateSummary,
    };

    return (
        <PDFContext.Provider value={value}>
            {children}
        </PDFContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePDF = (): PDFContextType => {
    const context = useContext(PDFContext);
    if (!context) {
        throw new Error('usePDF must be used within a PDFProvider');
    }
    return context;
};

export { PDFContext };