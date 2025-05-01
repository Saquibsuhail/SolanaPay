import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

interface QRModalProps {
  qrCodeUrl: string;
  onClose: () => void;
}

export default function QRModal({ qrCodeUrl, onClose }: QRModalProps) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed">("pending");
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pay?reference=${qrCodeUrl.split('reference=')[1]}`);
        const data = await response.json();
        if (data.status === "success") {
          setStatus("confirmed");
          setTimeout(() => {
            router.push("/success");
          }, 2000);
        } else if (data.status === "invalid") {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
        setStatus("failed");
      }
    };

    const intervalId = setInterval(checkStatus, 3000);

    return () => clearInterval(intervalId);
  }, [qrCodeUrl, router]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Scan to Pay</h2>
        {status === "pending" && (
          <div className="flex flex-col items-center">
            <QRCodeSVG value={qrCodeUrl} size={256} />
            <p className="mt-4">Waiting for payment...</p>
          </div>
        )}
        {status === "confirmed" && (
          <div className="flex flex-col items-center">
            <Image src="/confirmation.gif" alt="Confirmation" width={200} height={200} />
            <p className="mt-4">Payment confirmed! Redirecting...</p>
          </div>
        )}
        {status === "failed" && <p>Transaction failed. Please try again.</p>}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}