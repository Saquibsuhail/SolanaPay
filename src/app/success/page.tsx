"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Success() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    setOrderNumber(Math.floor(Math.random() * 1000) + 1);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Thank You!</h1>
      <h2 className="text-2xl">Your order has been confirmed</h2>
      {orderNumber && (
        <p className="text-xl">
          Order number: <span className="font-semibold">{orderNumber}</span>
        </p>
      )}
      <p className="text-lg text-center max-w-md">
        Your delicious coffee will be ready soon. Please pick it up at the counter.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
        onClick={() => router.push("/")}
      >
        Return to Menu
      </button>
    </div>
  );
}