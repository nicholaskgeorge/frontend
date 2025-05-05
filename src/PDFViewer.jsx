import React from "react";

export default function PDFViewer({ fileUrl }) {
  const placeholderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontStyle: "italic",
    color: "#666",
  };

  if (!fileUrl) {
    return (
      <div style={placeholderStyle}>
        Upload a PDF datasheet to view it here
      </div>
    );
  }

  return (
    <embed
      src={fileUrl}
      type="application/pdf"
      width="100%"
      height="100%"
      style={{ border: "none" }}
    />
  );
}
