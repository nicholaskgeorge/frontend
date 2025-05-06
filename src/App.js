import React, { useState } from "react";
import PDFViewer from "./PDFViewer";
import ChatWindow from "./ChatWindow";
import axios from "axios";

export default function App() {
  const [pdfUrl, setPdfUrl] = useState(null);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        // Upload PDF
        await axios.post("http://localhost:8000/upload_pdf/", formData);
        // Index PDF for RAG
        const indexRes = await axios.post("http://localhost:8000/index_pdf/");
        console.log("Indexing result:", indexRes.data);
        // Show PDF
        setPdfUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, borderRight: "2px solid #222" }}>
        <PDFViewer fileUrl={pdfUrl} />
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        <label className="upload-button">
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            style={{ display: "none" }}
          />
        </label>
        <ChatWindow />
      </div>
    </div>
  );
}
