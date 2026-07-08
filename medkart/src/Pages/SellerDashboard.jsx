import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [usage, setUsage] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user?.role === "seller") {
      fetchSellerProducts();
    }
  }, [user]);

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    return { msg: text || `Unexpected response type: ${contentType}` };
  };

  const fetchSellerProducts = async () => {
    setLoadingProducts(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/seller/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.msg || "Failed to load seller products.");
      setProducts(data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be logged in as a seller to access this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price) {
      setError("Name, category, and price are required.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/seller/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, category, usage, price: Number(price), image }),
      });

      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.msg || "Failed to add product.");

      setMessage(`Product "${data.name}" added successfully.`);
      setName("");
      setCategory("");
      setUsage("");
      setPrice("");
      setImage("");
      await fetchSellerProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (medicineId) => {
    setDeletingId(medicineId);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/seller/medicines/${medicineId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.msg || "Failed to delete product.");
      setMessage(`Product "${data.name || medicineId}" deleted successfully.`);
      fetchSellerProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Add new products to the medicine section and manage your seller inventory.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_2fr]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-3">Welcome, {user.name}</h2>
              <p className="text-sm opacity-90">
                Use the form to add a new medicine product. Once saved, the item will appear in the medicine catalog for customers.
              </p>
            </div>

            {message && (
              <div className="rounded-3xl bg-green-50 border border-green-200 text-green-800 p-4">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-3xl bg-red-50 border border-red-200 text-red-800 p-4">
                {error}
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-inner border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Your Products</h3>
                  <p className="text-sm text-gray-600">Manage the medicines you added.</p>
                </div>
                {loadingProducts && <span className="text-sm text-gray-500">Loading...</span>}
              </div>

              {products.length === 0 && !loadingProducts ? (
                <p className="text-gray-500">No products yet. Add one using the form.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product._id} className="rounded-3xl border border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">Category: {product.category}</p>
                          <p className="text-sm text-gray-600">Price: ৳ {product.price}</p>
                        </div>
                        <button
                          type="button"
                          disabled={deletingId === product._id}
                          onClick={() => handleDelete(product._id)}
                          className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === product._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 rounded-3xl p-8 shadow-inner">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. Paracetamol"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. Pain Relief"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Usage</label>
              <textarea
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="How to use this product"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="৳ 0"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
