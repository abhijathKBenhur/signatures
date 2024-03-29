import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronRight, ChevronLeft } from "react-feather";
import PDFFile from "../../../assets/documents/whitepaper.pdf";
import "./tokenomics.scss"
const Help = () => {
  const [pdfPages, setPdfPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages({ ...pdfPages, totalPages: numPages });
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);
  return (
    <div className="main-content-component container tokenomics ">
      <span className="father-grey color-secondary">Tokenomics Whitepaper</span>
      <>
        <p className="page-container text-center cursor-pointer">
          {pdfPages.currentPage != 1 && <ChevronLeft
            className={pdfPages.currentPage === 1 ? "disable" : ""}
            onClick={() =>
              setPdfPages({
                ...pdfPages,
                currentPage: pdfPages.currentPage - 1,
              })
            }
          />}
          Page {pdfPages.currentPage} of {pdfPages.totalPages}
          {pdfPages.currentPage != pdfPages.totalPages && <ChevronRight
            className={
              pdfPages.currentPage === pdfPages.totalPages ? "disable" : ""
            }
            onClick={() =>
              setPdfPages({
                ...pdfPages,
                currentPage: pdfPages.currentPage + 1,
              })
            }
          />}
        </p>
        <Document
          file={PDFFile}
          className="pdf-document"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pdfPages.currentPage} />
        </Document>
      </>
    </div>
  );
};

export default Help;
