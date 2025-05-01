interface Item {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }
  
  interface CartProps {
    cart: Item[];
    removeFromCart: (index: number) => void;
    onBuy: () => void;
  }
  
  export default function Cart({ cart, removeFromCart, onBuy }: CartProps) {
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <span>{item.price} SOL</span>
                <button
                  onClick={() => removeFromCart(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm transition-colors duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="mt-4">
              <p className="font-bold">Total: {totalPrice.toFixed(7)} SOL</p>
              <button
                onClick={onBuy}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300"
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
    );
  }