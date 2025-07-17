import axios from "axios"
import { useState } from "react"

function App() {
  const [file, setfile] = useState<File | null>(null)
  const [res, setres] = useState<{ quiz?: unknown } | null>(null)
  const difficulty = "medium"
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData();
    if (file) {
      formData.append("pdf", file);
      formData.append("difficulty", difficulty)
    }
    const response = await axios.post("http://localhost:8000/api/v1/feature/quiz", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    setres(response.data)
    console.log(res?.quiz)


  }
  return (
    <>
      <form action="" onSubmit={handleUpload}>
        <input type="file" name="pdf" id="pdf" onChange={(e) => setfile(e.target.files?.[0] || null)} />
        <button type="submit">upload</button>
      </form>
    </>
  )
}

export default App
