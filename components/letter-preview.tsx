"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LetterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  letterType: "TUTU" | "GENERIC" | "ADDRESS";
  data: any;
}

const LogoHeader = () => (
  <div className="w-full">
    <div className="flex justify-center mb-6">
      <div className="relative w-[120px] h-[120px]">
        <Image 
          src="/baby-corp-logo.png" 
          alt="Baby Corp Logo" 
          fill
          priority
          sizes="120px"
          className="object-contain"
          style={{ transform: 'scale(1.2)' }}
        />
      </div>
    </div>
    <div className="w-full border-b-2 border-black mb-8" />
  </div>
);

const Footer = () => (
  <footer className="text-xs mt-8 text-gray-600 border-t pt-4 text-center">
    <p className="text-center">Com. Add: B-602, Kadamb Greens, Zundal, Gandhi Nagar, Ahmedabad, Gujarat, India</p>
    <p className="text-center">+91 977-301-3115 / +91-972-244-1030 keshivsbabycorp@gmail.com</p>
  </footer>
);

export function LetterPreview({ isOpen, onClose, letterType, data }: LetterPreviewProps): ReactNode {
  const letterRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!letterRef.current) return;

    try {
      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(letterRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 5000,
        onclone: (document) => {
          // Ensure images are loaded
          const images = document.getElementsByTagName('img');
          return Promise.all(Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }));
        },
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: letterType === 'ADDRESS' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
      pdf.save(`${letterType.toLowerCase()}-letter.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderLetter = () => {
    switch (letterType) {
      case "TUTU":
        return renderTUTULetter();
      case "GENERIC":
        return renderGenericLetter();
      case "ADDRESS":
        return renderAddressLetter();
      default:
        return null;
    }
  };

  const renderTUTULetter = () => (
    <div className="space-y-4 bg-white font-[family-name:var(--font-geist-sans)]">
      {/* Page 1: English Content */}
      <div className="p-8 min-h-[297mm] flex flex-col print-page">
        <LogoHeader />
        
        <div className="flex-grow space-y-4">
          <p className="mb-4">Dear {data.englishName},</p>
          <p>We're thrilled to accompany you on this journey as you introduce our Automatic Cradle Kit into your home. Our cradle combines safety and durability with a shock-proof design, a safe adapter, and sturdy stainless steel hooks to ensure a secure environment for your cherished ones. Built to last, its reliable motor provides lasting, gentle movements.</p>
          
          <p>Imagine the cradle softly swaying, infusing your home with peaceful moments and joyful smiles. We hope it enhances your daily life, bringing not just rest but deep satisfaction, knowing that your family experiences the best in comfort and safety.</p>
          
          <p className="font-semibold">Love What You Bought? 🌟</p>
          
          <p>If you're delighted with our product, we'd truly appreciate a <span className="font-semibold">5-star rating!</span> Your positive feedback helps other customers choose Baby Corp with confidence.</p>
          
          <p>Want to make a greater impact? Share a <span className="font-semibold">photo or video review</span> to show others the quality firsthand.</p>
          
          <p className="font-semibold">Exclusive Offer 🎁</p>
          
          <p>As a thank-you, send us a <span className="font-semibold">screenshot of your photo/video review</span> along with your invoice on WhatsApp at <span className="font-semibold">9722441030</span>, and we'll send you <span className="font-semibold">Rs. 50</span> as a token of our appreciation!</p>
          
          <p>Thank you for your support, and we hope to see you again soon!</p>
          
          <p>Warm regards,<br />
          Baby Corp<sup>TM</sup><br />
          +91-972-244-1030<br />
          +91 977-301-3115</p>
        </div>
        <Footer />
      </div>

      {/* Page 2: Local Language Content */}
      <div className="p-8 min-h-[297mm] flex flex-col print-page">
        <LogoHeader />
        
        <div className="flex-grow space-y-4">
          {data.language === "hindi" && (
            <>
              <p>{data.localName},</p>
              <p>बेबी कॉर्प परिवार में आपका स्वागत है! हमारी ऑटोमैटिक क्रैडल किट आपके घर में लाने के लिए हम बहुत उत्सहित हैं। इस क्रैडल के डिजाइन में सुरक्षा और टिकाऊपन को ध्यान में रखा गया है—इसमें शॉक-प्रूफ डिजाइन, सुरक्षित एडेप्टर, और मजबूत स्टेनलेस स्टील हुक है, ताकि आपके बच्चों को सुरक्षित वातावरण मिले। टिकाऊ मोटर इसे लंबे समय तक बनाए रखेगी।</p>
              
              <p>आशा है कि झूले का धीमा हिलना-डुलना आपके घर में शांति और आनंद लाए���। यह नया जोड़ आपके दैनिक जीवन को और अधिक आरामदायक और सुखद बनाएगा, और आपको यकीन दिलाएगा कि आपके परिवार को सर्वोत्तम सुविधा मिल रही है।</p>
              
              <p>क्या आपको हमारा उत्पाद पसंद आया? जब आप नए क्रैडल का उपयोग करें, तो आपके अनुभव के बारे में जानकर हमें खुशी होगी। अगर आपको थोड़ा समय मिले, तो कृपया अपने विचार हमारे साथ साझा करें। आपकी समीक्षा हमें इस उत्पाद में सुधार करने और अन्य खरीदारों की मदद करने में सहायता करेगी। यदि आप हमारे उत्पाद से प्रसन्न हैं, तो अमेज़न पर 5-स्टार रेटिंग देकर हमें खुशी होगी! आपकी सकारात्मक प्रतिक्रिया अन्��� ग्राहकों को बेबी कॉर्प पर विश्वास के साथ निर्णय लेने में मदद करती है।</p>
              
              <p>बड़ा प्रभाव डालना चाहते हैं? अन्य ग्राहकों को गुणवत्ता का अनुभव देने के लिए एक फोटो या वीडियो रिव्यू साझा करें।</p>
              
              <p>विशेष फर 🎁 आपके समर्थन के लिए धन्यवाद स्वरूप, अपनी 5-स्टार फोटो/वीडियो रिव्यू का स्क्रीनशॉट और इनवॉइस हमें व्हाट्सएप पर 9722441030 पर भेजें, और हम आपको आभार स्वरूप ₹50 भेजेंगे!</p>
              
              <p>आपके समर्थन के लिए धन्यवाद!</p>
              
              <p>धन्यवाद,<br />
              बेबी कॉर्प™<br />
              +९१ ९७७-३०१-३११५<br />
              +९१ ९७२-२४४-१०३०</p>
            </>
          )}
          {data.language === "gujarati" && (
            <>
              <p>{data.localName},</p>
              <p>બેબી કોર્પ પરિવારમાં તમારું સ્વાગત છે! તમારું નવું વર્ષ ખુશી અને સમૃદ્ધિથી ભરેલું રહે તેવી શુભેચ્છાઓ. અમારી ઑટોમેટિક ક્રેડલ કિટ તમારા ઘરમાં લઈને આવવા માટે અમે ખૂબ જ ઉત્સાહી છીએ. આ ક્રેડલના ડિઝાઇનમં સલાતી અને ટકાઉપણાને ધ્યાનમાં રાખવામાં આવ્યું છે—આમાં shock-proof ડિઝાઇન, સલામત એડેપ્ટર, અને મજબૂત સ્ટેનલેસ સ્ટીલ હૂક છે, જેથી તમારા બાળકોને સુરક્ષિત વાતવરણ મળે. ટકાવટ વાતી મોટર લાંબા સમય સુધી આને ટકાવી રાખશે.</p>
              
              <p>આશા છે કે ઘોડિયા નું ધીમું ધીમું હલનચલન, તમારા ઘરમાં શાંતિ અને આનંદ લાવશે. આ નવું ઉમેરણ તમારા દૈનિક જીવનને વધુ આરામદાયક અને સુખદ બનાવશે, અને તમને ખાતરી મળશે કે તમારા પરિવારને શ્રેષ્ઠ સગવડ મળી છે.</p>
              
              <p>અમારા પ્રોડક્ટથી ખુશ છો? તમારો અનુભવ શેર કરો 📹</p>
              
              <p>જો આ પ્રોડક્ટથી તમે ખુશ છો તો મારા અનુવ અંગે જાણીને અમને આ��દ થશે. જો તમને થોડીવાર મળે, તો કૃપા કરીને તમારા અભિપ્રાય સાથે અમને 5-star મૂલ્યાંકન આપો. તમારો રિવ્યૂ અમને આ પ્રોડક્ટ સુધારવામાં અનેય ખરીદદારોને દદરૂપ થશે.</p>
              
              <p>વિશિષ્ટ ઑફર 🎁</p>
              
              <p>તમે ફોટો અથવા વિડિયો રિવ્યુનો સ્ક્રીનશોટ અને તમારી ઈન્વૉઇસ 9722441030 પર વોટ્સએપ્ કરો, અને અમે તમારા આભારની નિશાની તરીકે તમને રૂ. 50 મોકલીશું!</p>
              
              <p>તમારા સપોર્ટ માટે આભાર!</p>
              
              <p>આભાર,<br />
              બેબી કોર્પ™<br />
              +૯૧-૯૭૨-૨૪૪-૧૦૩૦<br />
              +૯૧ ૯૭૭-૩૦૧-૩૧૧૫</p>
            </>
          )}
          {data.language === "marathi" && (
            <>
              <p>{data.localName},</p>
              <p>बेबी कॉर्प ुटुंबात तुमचं स्वागत आहे!</p>
              <p>आपल्याला आमच्या ऑटोमॅटिक क्रॅडल किटला आपल्या घरात आणण्याच्या या प्रवासात आपला साथीदार बून आम्हाला त्यंत आनंद होतो आहे. आमचे क्रॅडल सुरक्षितता आणि टिकाऊपणाचा संगम आहे, शॉक-प्रूफ डिझाइन, सुरक्षित अडॅप्टर आणि मजबूत स्टेनलेस स्टील हुक्ससह, ज्यामुळे आपल्या प्रियजनांसाठी एक सुरक्षित वातावरण सुनिश्चित होते. दीर्घकाळ टिकण्यासाठी बनवलेले, त्याचे विश्वासार्ह मोटर हलक्या आणि सौम्य हालचालींनी चालते.</p>

              <p>कल्पना करा की क्रॅडल सौम्यपणे हलत आहे, आपल्या घरात शांतेच्या क्षणांनी आणि आनंददयी हसण्याने भरले आहे. आम्ही आशा करतो की हे आपल्या दैनंदिन जीवनाला सुधारेल, केवळ विश्रांतीच नाही तर खोल समाधान आणेल, कारण आपली कुटुंबे आराम आणि सुरक्षित अनुभवतात.</p>

              <p>आपण जे खरेदी केले त्यावर खुश आहे का? जर आपल्याला आमच्या उत्पादनावर आनंद झाला असेल, तर आम्ही 5-स्टार रेटिंगची अत्यंत प्रशंसा करू! आपले सकारात्मक अभिप्राय इतर ग्राहकांना Baby Corp निवडण्यास आत्मविश्वासाने मदत करतात. आपला प्रभाव वाढवू इच्छिता? दुसऱ्यांना गुणवत्ता प्रत्यक्ष पाहण्यासाठी फोटो किंवा व्हिडिओ पुनरावलोकन शेअर करा.</p>

              <p>विशेष ऑफर 🎁 धन्यवाद म्णून, आपला 5-स्टार फोटो/व्हिडिओ पुनरावलोकन आणि बिलचा स्क्रीनशॉट WhatsApp वर 9722441030 वर पाठवा आणि आम्ही आपल्या कृतज्ञते चिन्ह णून Rs. 50 पाठवू!</p>

              <p>आपल्या समर्थनाबद्दल धन्यवाद, आणि आम्ही लवकरच पुन्हा आपल्याला पाहण्याची आशा करतो!</p>

              <p>आपुलकीने,<br />
              बेबी कॉर्प (Baby Corp<sup>TM</sup>)<br />
              +91-972-244-1030<br />
              +91 977-301-3115</p>
            </>
          )}
        </div>
        <Footer />
      </div>

      {/* Page 3: Gift Message */}
      <div className="p-8 min-h-[297mm] flex flex-col print-page">
        <LogoHeader />
        
        <div className="flex-grow space-y-8">
          {/* English Gift Message */}
          <div className="space-y-4 mb-12">
            <p>Dear {data.englishName},</p>
            <p>Welcome to the Baby Corp family! As you're one of our valued customers, we're thrilled to celebrate this milestone with you. To show our appreciation, we've included a special surprise gift with your Automatic Cradle Kit. We hope it brings you and your little one extra joy!</p>
            <p>Warm regards,<br />
            Baby Corp<sup>TM</sup><br />
            +91-972-244-1030<br />
            +91 977-301-3115</p>
          </div>

          {/* Local Language Gift Message */}
          <div className="space-y-4 pt-8 border-t">
            {data.language === "hindi" && (
              <>
                <p>प्रिय {data.localName},</p>
                <p>बेबी कॉर्प परिवार में आपका स्वागत है! आप हमारे प्रिय ग्राहक हैं, और हम इस माइलस्टोन को आपके साथ मनाने के लिए आपके ऑटोमैटिक क्रैडल किट के साथ एक विशेष सरप्राइज़ गिफ्ट शामिल करके रोमांचित हैं। हमें उम्मीद है कि आपको यह पसंद आएगा!</p>
                <p>सादर,<br />
                बेबी कॉर्प (Baby Corp<sup>TM</sup>)<br />
                +91-972-244-1030<br />
                +91 977-301-3115</p>
              </>
            )}
            {data.language === "gujarati" && (
              <>
                <p>{data.localName},</p>
                <p>બેબી કોર્પ પરિવારમા આપનું દિલથી સ્વાગત છે! આપ અમારા પ્રિય અને મૂલ્યવાન ગ્રાહક છો, આપ સાથે આ ખુસ્સની ઉજવણી કરતા અમને ખુબ આનંદ થાય છે. તેથી, અમે આપના ઓટોમેટિક ક્રેડલ કિટ સાથે એક વિશેષ આશ્ચર્ય ભેટ તરીકે ઉમેરવા માંગીએ છીએ. આ ભેટ આપને પ્રેમ અને આનંદ લાવશે, એવી આશા રાખીએ છીએ!</p>
                <p>આભાર,<br />
                બેબી કોર્પ™<br />
                +૯૧-૯૭૨-૨૪૪-૧૦૩૦<br />
                +૯૧ ૯૭૭-૩૦૧-૩૧૧૫</p>
              </>
            )}
            {data.language === "marathi" && (
              <>
                <p>{data.localName},</p>
                <p>Baby Corp कुटुंबात तुमचं स्वागत आहे! महाराष्ट् आमचे प्रिय ग्राहक म्हणून, आम्ही तुमच्यासोबत हा महत्त्वपूर्ण क्षण साजरा करत आहोत आणि तुमच्या Automatic Cradle Kit सोबत एक खास सरप्राईज गिफ्ट देत आहोत. तुम्हाला ते आवडेल अशी आम्हाला आशा आहे!</p>
                <p>ध्यवाद!</p>
                <p>आपुलकीने,<br />
                बेबी कॉर्प (Baby Corp<sup>TM</sup>)<br />
                +91-972-244-1030<br />
                +91 977-301-3115</p>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );

  const renderGenericLetter = () => (
    <div className="p-8 min-h-[297mm] flex flex-col print-page bg-white font-[family-name:var(--font-geist-sans)]">
      <LogoHeader />
      <div className="flex-grow space-y-4">
        <div className="pt-4">
          <p className="mb-4">Dear {data.customerName},</p>
          <p className="font-semibold mb-2">Love What You Bought? 🎁</p>
          
          <p>If you're delighted with our product, we'd truly appreciate a <span className="font-semibold">5-star rating on Amazon!</span> Your positive feedback helps other customers choose Baby Corp with confidence.</p>
          
          <p>Want to share a greater impact? Leave a <span className="font-semibold">photo or video review</span> to show others the quality firsthand.</p>
          
          <p className="font-semibold mt-4 mb-2">Exclusive Offer 🎉</p>
          
          <p>As a thank-you, send us a <span className="font-semibold">screenshot of your 5-star photo/video review</span> along with your invoice on WhatsApp (<span className="font-semibold">+917922441030</span>), and we'll send you <span className="font-semibold">Rs. 50</span> as a token of our appreciation!</p>
          
          <p>Thank you for your support, and we hope to see you again soon!</p>
        </div>
        <div className="pt-8">
          <p className="mb-4"><span className="font-semibold">क्या आपको हमारा उत्पाद पसंद आया?</span> तो आपके अनुभव के बारे में जानकर हमें खुशी होगी। अगर आपको थोड़ा समय मिले, तो कृपया अपने विचार हमारे साथ साझा करें। आपकी समीक्षा हमें इस उत्पाद में सुधार करने और अन्य खरीदारों की मदद करने में सहायता करेगी। यदि आप हमारे उत्पाद से प्रसन्न हैं, तो अमेज़न पर 5-स्टार रेटिंग देकर हमें खुशी होगी! आपकी सकारात्मक प्रतिक्रिया अन्य ग्रा��कों को बेबी कॉर्प पर विश्वास के साथ निर्णय लेने में मदद करती है।</p>
          <p className="mb-4"><span className="font-semibold">बड़ा प्रभाव डालना चाहते हैं?</span> अन्य ग्राहकों को गुणवत्ता का अनुभव देने के लिए एक फोटो या वीडियो रिव्यू साझा करें।</p>
          <p className="mb-4"><span className="font-semibold">विशेष ऑफर</span> 🎁 आपके समर्थन के लिए धन्यवाद स्वरूप, अपनी 5-स्टार फोटो/वीडियो रिव्यू का स्क्रीनशॉट और इनवॉइस हमें व्हाट्सएप पर 9722441030 पर भेजें, और हम आपको आभार स्वरूप ₹50 भेजेंगे!</p>
          <p>आपके समर्थन के लिए धन्यवाद!</p>
        </div>
        <div className="pt-4">
          <p>Warm regards,<br />
          Baby Corp<sup>TM</sup><br />
          +91-972-244-1030<br />
          +91 977-301-3115</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  const renderAddressLetter = () => (
    <div className="p-8 min-h-[210mm] w-[297mm] flex flex-col print-page-landscape bg-white font-[family-name:var(--font-geist-sans)]">
      <LogoHeader />
      
      <div className="flex-grow">
        {/* Ship To and Tracking Number */}
        <div className="flex justify-between mb-12">
          <div className="text-xl font-normal">Ship To</div>
          <div className="text-xl font-normal">Tracking Number: {data.trackingId}</div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-2 text-2xl">
          <p className="font-bold">{data.name}</p>
          <p className="font-bold">{data.address?.split(',')[0] || data.address}</p>
          <p className="font-bold">{data.address?.split(',')[1]}</p>
          <p className="font-bold uppercase">{data.address?.split(',')[2]}</p>
          <p className="font-bold">Phone : {data.phone}</p>
        </div>

        {/* Return Address */}
        <div className="mt-auto text-right space-y-1 text-xl">
          <p className="font-bold mb-2">If Undelivered, Please return to</p>
          <p>Baby Corp,</p>
          <p>614, Ganesh Glory, Jagatpur</p>
          <p>Road, Gota,</p>
          <p>Ahmedabad - 382481, Gujarat</p>
          <p>Phone: 9722441030</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-h-[80vh] overflow-y-auto",
          letterType === "ADDRESS" 
            ? "max-w-[297mm] min-h-[210mm] p-0 address-letter-preview" 
            : "max-w-3xl"
        )}
      >
        <DialogHeader className="dialog-header">
          <DialogTitle>Letter Preview</DialogTitle>
        </DialogHeader>
        
        <div ref={letterRef} className="border rounded-lg shadow-sm">
          {renderLetter()}
        </div>
        
        <div className="dialog-footer flex justify-end gap-4 mt-4">
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