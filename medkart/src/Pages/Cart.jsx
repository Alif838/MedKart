import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  const removeItem = async (id) => {
    setRemovingId(id);

    // Optimistically remove from local state for better UX
    setCart(prevCart => prevCart.filter(item => item.id !== id));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to remove item");
      // Backend returns updated cart, but we already updated locally
      // Could fetch again if needed, but optimistic update should be fine
    } catch (error) {
      console.error("Error removing item:", error);
      // Revert to server state on error
      await fetchCart();
      alert("Failed to remove item. Please try again.");
    }
    setRemovingId(null);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cart.find(item => item.id === id);
    if (!item) return;

    // Update local state immediately for better UX
    setCart(prevCart => prevCart.map(cartItem =>
      cartItem.id === id ? { ...cartItem, quantity: newQuantity } : cartItem
    ));

    try {
      // Update backend - remove old and add new quantity
      const token = localStorage.getItem("token");
      
      // Delete current item
      await fetch(`http://localhost:5000/api/cart/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      // Re-add with new quantity
      for (let i = 0; i < newQuantity; i++) {
        await fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(item),
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Revert to server state on error
      fetchCart();
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = () => {
    // In a real application, you would send the order details to your backend here.
    // For this example, we'll just simulate success.
    console.log("Order Confirmed!");
    setOrderConfirmed(true);
    setCart([]); // Clear the cart after successful order
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4 text-green-500">🎉</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Thank You for Your Order!</h3>
          <p className="text-gray-600 mb-6">Your order has been placed successfully and will be delivered soon.</p>
          <a
            href="/medicine"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
            onClick={() => setOrderConfirmed(false)} // Reset for future orders
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 md:px-16 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cart.length === 0 ? "Your cart is empty" : `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`}</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some medicines to get started</p>
            <a href="/medicine" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200">
              Browse Medicines
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "https://cdn-icons-png.flaticon.com/512/822/822143.png"}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.category}</p>
                      <p className="text-gray-500 text-sm mt-1">{item.usage}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition duration-200"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-center min-w-[40px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">৳ {item.price * item.quantity}</p>
                      <p className="text-sm text-gray-500">৳ {item.price} each</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={removingId === item.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removingId === item.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>৳ {total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>৳ {Math.round(total * 0.05)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳ {total + Math.round(total * 0.05)}</span>
                  </div>
                </div>
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                </button>
                <div className="mt-4 text-center">
                  <a href="/medicine" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Continue Shopping →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
