
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator = ({ value, size = 200, className = "" }: QRCodeGeneratorProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: '#166534', // green-800
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (value) {
      generateQR();
    }
  }, [value, size]);

  if (!qrCodeUrl) {
    return (
      <div className={`w-${size/4} h-${size/4} bg-gray-200 rounded-lg animate-pulse ${className}`}>
        <div className="flex items-center justify-center h-full text-gray-500">
          Generating QR...
        </div>
      </div>
    );
  }

  return (
    <img 
      src={qrCodeUrl} 
      alt="QR Code for referral link" 
      className={`rounded-lg shadow-md ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default QRCodeGenerator;
