import Image from "next/image";

interface Item {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface InventoryItemProps {
  item: Item;
  addToCart: (item: Item) => void;
}

export default function InventoryItem({ item, addToCart }: InventoryItemProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
      <Image src={item.image} alt={item.name} width={200} height={200} className="mb-4 rounded-md" />
      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
      <p className="mb-2">Quantity: {item.quantity}</p>
      <p className="mb-4">Price: {item.price} SOL</p>
      <button
        onClick={() => addToCart(item)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Add to cart
      </button>
    </div>
  );
}