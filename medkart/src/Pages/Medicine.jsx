import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
const API_URL =
  import.meta.env.VITE_API_URL || "https://medkart-backend.onrender.com/api";


const CATEGORIES = [
  "All", "Pain Relief", "Antibiotic", "Allergy", "Digestive",
  "Cardiac", "Diabetic", "Mental Health", "Hormonal",
  "Anti-inflammatory", "Respiratory", "General"
];

export default function Medicine() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch(`${API_URL}/medicines`);
        if (!response.ok) throw new Error("Failed to fetch medicines");
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error("Error loading medicines:", error);
       setMedicines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const addToCart = async (medicine) => {
    setAddingId(medicine.id); // show Adding...
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(medicine),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      alert(`${medicine.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    }
    setAddingId(null);
  };

  const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }
    const text = await response.text();
    return { msg: text || `Unexpected response type: ${contentType}` };
  };

  const startEdit = (medicine) => {
    setEditingId(medicine._id);
    setEditData({ name: medicine.name, category: medicine.category, usage: medicine.usage, price: medicine.price, image: medicine.image });
    setEditError("");
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (medicineId) => {
    if (!editData.name || !editData.category || !editData.price) {
      setEditError("Name, category, and price are required.");
      return;
    }
    setEditError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/seller/medicines/${medicineId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.msg || "Failed to update product.");
      setMedicines(medicines.map(m => m._id === medicineId ? data : m));
      setEditingId(null);
      alert("Product updated successfully!");
    } catch (err) {
      setEditError(err.message);
    }
  };

  const deleteProduct = async (medicineId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/seller/medicines/${medicineId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseResponse(response);
      if (!response.ok) throw new Error(data.msg || "Failed to delete product.");
      setMedicines(medicines.filter(m => m._id !== medicineId));
      alert("Product deleted successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const matchCategory = activeCategory === "All" || med.category === activeCategory;
    const matchSearch = med.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-blue-50 to-cyan-50">
      <h1 className="text-3xl font-bold mb-6">All Medicines</h1>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-500 text-sm">Search by name</span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border hover:bg-blue-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Medicines Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
        {filteredMedicines.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">No medicines found.</p>
        )}
        {filteredMedicines.map((med) => {
          const isSeller = user?.role === "seller";
          
          if (editingId === med._id && isSeller) {
            return (
              <div key={med._id} className="bg-white rounded-2xl p-4 shadow border-2 border-blue-400">
                <h3 className="font-semibold text-sm mb-3">Edit Product</h3>
                {editError && <p className="text-red-600 text-xs mb-2">{editError}</p>}
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs mb-2"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) => handleEditChange("category", e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs mb-2"
                  placeholder="Category"
                />
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs mb-2"
                  placeholder="Price"
                />
                <input
                  type="text"
                  value={editData.image}
                  onChange={(e) => handleEditChange("image", e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs mb-2"
                  placeholder="Image URL"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(med._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg text-xs font-semibold hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={med._id || med.id} className="bg-white rounded-2xl p-4 shadow hover:shadow-xl transition hover:-translate-y-1">
              <img
                src={med.image || "https://cdn-icons-png.flaticon.com/512/822/822143.png"}
                alt={med.name}
                className="h-32 mx-auto object-contain"
              />
              <h3 className="mt-4 font-semibold text-sm">{med.name}</h3>
              <p className="text-xs text-blue-600 mt-1">{med.category}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3">{med.usage}</p>
              <p className="text-sm font-bold mt-2">৳ {med.price}</p>
              {isSeller ? (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => startEdit(med)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(med._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ) : (
               <button
                   onClick={() => addToCart(med)}
                   disabled={addingId === med.id}
                   className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition  disabled:opacity-50 disabled:cursor-not-allowed">
                    
               {addingId === med.id ? "Adding..." : "Buy Medicine"}
               </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
