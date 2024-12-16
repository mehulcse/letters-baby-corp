'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Set worker URL for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  onLayoutChange: (layout: '1' | '2' | '4') => void;
}

export function PDFViewer({ onLayoutChange }: PDFViewerProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageLayout, setPageLayout] = useState<'1' | '2' | '4'>('1');

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setSelectedPages([]);
    }
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setSelectedPages([1]); // Select first page by default
  }

  function handlePageSelect(pageNum: number) {
    setSelectedPages((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((p) => p !== pageNum);
      }
      return [...prev, pageNum].sort((a, b) => a - b);
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-4">
        <Input type="file" accept=".pdf" onChange={onFileChange} className="mb-4" />

        <Select
          value={pageLayout}
          onValueChange={(value: '1' | '2' | '4') => {
            setPageLayout(value);
            onLayoutChange(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Single page</SelectItem>
            <SelectItem value="2">Two pages</SelectItem>
            <SelectItem value="4">Four pages</SelectItem>
          </SelectContent>
        </Select>

        {pdfFile && (
          <div className="border rounded-lg p-4">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-wrap gap-4"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={`page_${index + 1}`}
                  className={`cursor-pointer ${
                    selectedPages.includes(index + 1) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePageSelect(index + 1)}
                >
                  <Page
                    pageNumber={index + 1}
                    width={200}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}
