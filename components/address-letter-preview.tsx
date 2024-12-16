'use client';

import { useRef, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { cn } from '@/lib/utils';
import { AddressFormValues } from '@/components/forms/address-letter-form';

type AddressData = AddressFormValues;

interface AddressPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: AddressData[];
}

// Single address block component
const AddressBlock = ({ data }: { data: AddressData }) => (
  <div className="relative h-full">
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <div className="relative w-[80px] h-[80px]">
          <Image
            src="/baby-corp-logo.png"
            alt="Baby Corp Logo"
            fill
            priority
            sizes="80px"
            className="object-contain"
          />
        </div>
      </div>
      <div className="w-full border-b-2 border-black mb-8" />
    </div>

    <div className="flex-grow">
      <div className="flex justify-between mb-6">
        <div className="text-base font-normal">Ship To</div>
        <div className="text-base font-normal">Tracking Number: {data.trackingId}</div>
      </div>

      <div className="space-y-1 text-lg">
        <p className="font-bold">{data.name}</p>
        <p className="font-bold">
          {data.houseNumber}, {data.addressLine1}
        </p>
        {data.addressLine2 && <p className="font-bold">{data.addressLine2}</p>}
        <p className="font-bold">
          {data.city}, {data.state} - {data.zipCode}
        </p>
        <p className="font-bold">Phone : {data.phone}</p>
      </div>

      <div className="absolute bottom-0 right-0 text-right space-y-0.5 text-sm">
        <p className="font-bold mb-1">If Undelivered, Please return to</p>
        <p>Baby Corp,</p>
        <p>614, Ganesh Glory, Jagatpur</p>
        <p>Road, Gota,</p>
        <p>Ahmedabad - 382481, Gujarat</p>
        <p>Phone: 9722441030</p>
      </div>
    </div>
  </div>
);

interface AddressSlot {
  id: string;
  address?: AddressFormValues;
}

export function AddressLetterPreview({ isOpen, onClose, data }: AddressPreviewProps) {
  const letterRef = useRef<HTMLDivElement>(null);

  // Initialize 4 slots, fill with available addresses
  const [slots, setSlots] = useState<AddressSlot[]>(() => {
    const initialSlots: AddressSlot[] = Array(4)
      .fill(null)
      .map((_, index) => ({
        id: `slot-${index}`,
        address: data[index],
      }));
    return initialSlots;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!letterRef.current) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(letterRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 5000,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
      pdf.save('address-letter.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSlots = Array.from(slots);
    const [removed] = newSlots.splice(result.source.index, 1);
    newSlots.splice(result.destination.index, 0, removed);

    setSlots(newSlots);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[297mm] min-h-[210mm] p-0 address-letter-preview">
        <DialogHeader className="dialog-header">
          <DialogTitle>Address Label Preview</DialogTitle>
        </DialogHeader>

        <div ref={letterRef} className="border rounded-lg shadow-sm">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="addresses" direction="horizontal">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-8 min-h-[210mm] w-[297mm] grid grid-cols-2 grid-rows-2 gap-4 print-page-landscape bg-white"
                >
                  {slots.map((slot, index) => (
                    <Draggable key={slot.id} draggableId={slot.id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            'p-4 min-h-[200px] bg-white',
                            index % 2 === 0 && 'border-r',
                            index < 2 && 'border-b',
                            !slot.address && 'border-2 border-dashed'
                          )}
                        >
                          {slot.address ? (
                            <AddressBlock data={slot.address} />
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                              Drag address here
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="dialog-footer flex justify-end gap-4 mt-4 px-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint}>Print</Button>
          <Button onClick={handleDownloadPDF}>Download PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
