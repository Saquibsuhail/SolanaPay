"use client";

import { useState } from "react";
import InventoryItem from "./components/InventoryItem";
import Cart from "./components/cart";
import QRModal from "./components/QRModal";

interface Item {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

const inventory: Item[] = [
  { name: "Cappucino", quantity: 9, price: 0.0005, image: "/coffee.png" },
  { name: "Tea", quantity: 15, price: 0.0002, image: "/tea.png" },
  { name: "Frape", quantity: 7, price: 0.0003, image: "/frape.png" },
];

export default function Home() {
  const [cart, setCart] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const addToCart = (item: Item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleBuy = async () => {
    const totalAmount = cart.reduce((total, item) => total + item.price, 0);
    
    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await response.json();

      if (data.url) {
        setQrCodeUrl(data.url);
        setShowModal(true);
      } else {
        console.error("Error initiating transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <InventoryItem key={item.name} item={item} addToCart={addToCart} />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Cart cart={cart} removeFromCart={removeFromCart} onBuy={handleBuy} />
      </div>
      {showModal && (
        <QRModal
          qrCodeUrl={qrCodeUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}