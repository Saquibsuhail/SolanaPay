//Transaction Modal

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TransactionModalProps {
  transactionUrl: string;
  onClose: () => void;
}

export default function TransactionModal({ transactionUrl, onClose }: TransactionModalProps) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed">("pending");
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/pay?reference=${transactionUrl.split('reference=')[1]}`);
        const data = await response.json();
        if (data.status === "success") {
          setStatus("confirmed");
          setTimeout(() => {
            router.push("/success");
          }, 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
        setStatus("failed");
      }
    };

    const intervalId = setInterval(checkStatus, 3000);

    return () => clearInterval(intervalId);
  }, [transactionUrl, router]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Transaction Status</h2>
        {status === "pending" && <p>Processing your transaction...</p>}
        {status === "confirmed" && <p>Transaction confirmed! Redirecting...</p>}
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