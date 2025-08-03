import PdfUpload from '@/components/PdfUpload';
import { useState } from 'react';
import { GENERATE_QUIZ } from '@/redux/feature-actions';
import { useDispatch, useSelector } from 'react-redux';
import Difficulty from '@/components/Difficulty';
import { useNavigate } from 'react-router-dom';

export default function GenerateQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  //@ts-expect-error error
  const user = useSelector((state) => state.user);

  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);

    if (!file) {
      setError("Please upload a PDF file");
      return;
    }
    if (!difficulty) {
      setError("Please select difficulty level.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("difficulty", difficulty);
    //@ts-expect-error error
    dispatch(GENERATE_QUIZ(formData, user.token, file, difficulty, navigate));
  };

  return (
    <div>
      <PdfUpload onFileSelect={(f) => setFile(f)} />
      <div className='flex'>
        <Difficulty value={difficulty} onChange={(val) => setDifficulty(val)} />
        <div className='p-5'>
          <button onClick={handleGenerate} className='px-5 bg-blue-500 text-white rounded-sm py-1.5 cursor-pointer dark:bg-blue-800'>Generate</button>
        </div>
      </div>
      {error && <p className='text-sm bg-red-800 dark:bg-red-600 py-2 px-5 w-fit rounded-sm'>{error}</p>}
    </div>
  );
}
