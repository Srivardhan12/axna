export const SETPDF = (file: File) => {
    return {
        type: "SET_PDF_FILE",
        payload: file,
    };
};

export const CLEARPDF = () => {
    return {
        type: "CLEAR_PDF_FILE",
    };
};
