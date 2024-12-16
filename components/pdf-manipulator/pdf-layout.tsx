'use client';

import { useState } from 'react';
import { PDFViewer } from './pdf-viewer';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

export function PDFLayout() {
  const [layout, setLayout] = useState<'1' | '2' | '4'>('1');

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    // Implementation for download will be added
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PDF Layout Manager</h1>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <PDFViewer onLayoutChange={setLayout} />

        <div className="print:block hidden">{/* This div will contain the print layout */}</div>
      </div>
    </div>
  );
}
