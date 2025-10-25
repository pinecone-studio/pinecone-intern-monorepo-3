'use client';
import { useEffect, useRef } from 'react';

type QrScannerProps = {
  onScan?: (qr: string) => void; // callback prop
};

export const QrScannerComponent = ({ onScan }: QrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          scanQRCode(stream);
        }

        window.addEventListener('beforeunload', () => {
          stream.getTracks().forEach((t) => t.stop());
        });
      } catch (err) {
        console.error('Camera access denied', err);
        alert('Камерын зөвшөөрөл олдсонгүй. Зөвшөөрнө үү.');
      }
    };

    const scanQRCode = (stream: MediaStream) => {
      if (!('BarcodeDetector' in window)) {
        alert('Таны браузер QR код унших боломжгүй байна. Chrome эсвэл Edge ашиглана уу.');
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
      let detected = false;

      const loop = async () => {
        if (videoRef.current?.readyState === 4 && !detected) {
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) {
              detected = true;
              const url = codes[0].rawValue;
              console.log('QR detected:', url);

              if (onScan) onScan(url); // call callback instead of redirect
              return;
            }
          } catch (err) {
            console.error('QR detection failed', err);
          }
        }
        requestAnimationFrame(loop);
      };

      loop();
    };

    startCamera();
  }, [onScan]);

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-3 bg-gray-50">
      <h1 className="text-[#09090B] font-bold text-lg">Ширээний QR код уншуулна уу</h1>
      <video ref={videoRef} className="w-[360px] h-[360px] rounded-3xl object-cover bg-black" autoPlay muted playsInline />
      <a className="underline text-blue-600" href="/">
        Буцах
      </a>
    </div>
  );
};
