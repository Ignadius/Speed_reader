import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const extractTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const pages = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item) => item.str).join(" ");

    pages.push({
      pageNumber: pageNum,
      text: pageText,
    });
  }

  return pages;
};

export default function PdfUpload({
  onTextExtracted,
  setDocumentName,
  setPdfPages,
}) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // User closed the file picker

    if (file.type !== "application/pdf") {
      // Validate file type
      alert("Please select a PDF file");
      return;
    }

    setDocumentName(file.name);

    try {
      //This try/catch because file reading and PDF parsing can fail. Error handling prevents the application from crashing and allows feedback to be shown to the user.
      const pages = await extractTextFromPdf(file);

      setPdfPages(pages);

      const combinedText = pages.map((page) => page.text).join("\n\n");

      onTextExtracted(combinedText);
    } catch (error) {
      console.error(error);

      alert("Failed to read PDF");
    }
  };

  return (
    <div className="pdf-upload">
      <label htmlFor="pdf-input" className="pdf-upload-btn">
        📄 Upload PDF
      </label>

      <input
        id="pdf-input"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
}
