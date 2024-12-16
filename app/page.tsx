import { LetterGenerator } from '@/components/letter-generator';
import { PDFLayout } from '@/components/pdf-manipulator/pdf-layout';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <h1 className="text-3xl font-bold text-center">Letter Generator</h1>
          <LetterGenerator />
          <footer className="text-sm text-gray-500">
            © {new Date().getFullYear()} Letter Generator
          </footer>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">PDF Layout Tool</h2>
          <PDFLayout />
        </div>
      </div>
    </main>
  );
}
