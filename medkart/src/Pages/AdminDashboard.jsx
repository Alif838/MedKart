import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMedicines, getAdminStats, getAdminUsers, getAdminOrders } from "../api/apiService.js";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, medicines: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editData, setEditData] = useState({});
  const [settings, setSettings] = useState({ pharmacyName: '', contactEmail: '', phoneNumber: '' });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchMedicines(); // New function to fetch medicines
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchRecentOrders();
    }
  }, [users]);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const data = await getAdminOrders();
      // Transform cart items to order format
      const orders = data.slice(0, 5).map((item, index) => ({
        id: index + 1,
        customer: users[index % users.length]?.name || 'Customer',
        amount: item.price * item.quantity,
        status: 'Completed' // Placeholder status
      }));
      setRecentOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setSuccess('User deleted successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  // Delete medicine handler
  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/seller/medicines/${medicineId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete medicine');
      setSuccess('Medicine deleted successfully');
      fetchMedicines();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error deleting medicine');
    } finally {
      setLoading(false);
    }
  };

  // Edit user handler
  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit._id);
    setEditData({ name: userToEdit.name, email: userToEdit.email });
  };

  // Edit medicine handler
  const handleEditMedicine = (medToEdit) => {
    setEditingMedicine(medToEdit._id || medToEdit.id);
    setEditData({ name: medToEdit.name, category: medToEdit.category, price: medToEdit.price });
  };

  // Save edited user
  const handleSaveUser = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (!response.ok) throw new Error('Failed to update user');
      setSuccess('User updated successfully');
      setEditingUser(null);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error updating user');
    } finally {
      setLoading(false);
    }
  };

  // Save edited medicine
  const handleSaveMedicine = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/seller/medicines/${editingMedicine}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      if (!response.ok) throw new Error('Failed to update medicine');
      setSuccess('Medicine updated successfully');
      setEditingMedicine(null);
      fetchMedicines();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error updating medicine');
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Save settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg);
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  // Load settings when settings section is opened
  useEffect(() => {
    if (activeSection === 'settings') {
      fetchSettings();
    }
  }, [activeSection]);

  if (!user || user.role !== 'admin') {
    return <div className="p-10">Access Denied. Admin only.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error/Success Messages */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {success}
        </div>
      )}
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-2xl font-bold text-gray-800">MEDKART</span>
          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">Admin</span>
        </div>

        {/* Admin Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium hidden md:block">{user.name}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-linear-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-2xl font-semibold shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl min-h-screen border-r border-gray-200">
          <nav className="mt-8">
            <div className="px-4">
              <div className="space-y-2">
                <div
                  onClick={() => setActiveSection('dashboard')}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer transition duration-200 ${
                    activeSection === 'dashboard'
                      ? 'text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">📊</span> Dashboard
                </div>
                <div
                  onClick={() => setActiveSection('users')}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer transition duration-200 ${
                    activeSection === 'users'
                      ? 'text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">👥</span> Manage Users
                </div>
                <div
                  onClick={() => setActiveSection('sellers')}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer transition duration-200 ${
                    activeSection === 'sellers'
                      ? 'text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">🏪</span> Manage Sellers
                </div>
                <div
                  onClick={() => setActiveSection('medicines')}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer transition duration-200 ${
                    activeSection === 'medicines'
                      ? 'text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">💊</span> Manage Medicines
                </div>
                <div
                  onClick={() => setActiveSection('orders')}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer transition duration-200 ${
                    activeSection === 'orders'
                      ? 'text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">📦</span> Orders
                </div>
                <div
                  onClick={() => setActiveSection('settings')}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium cursor-pointer transition duration-200 ${
                    activeSection === 'settings'
                      ? 'text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">⚙️</span> Settings
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-50">
          {activeSection === 'dashboard' && (
            <>
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                  <p className="text-gray-600">Monitor your pharmacy management system</p>
                </div>
                <button
                  onClick={() => {
                    fetchStats();
                    fetchUsers();
                    fetchRecentOrders();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
                >
                  🔄 Refresh Data
                </button>
              </div>

              {/* Dashboard Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Users</h3>
                      <p className="text-3xl font-bold text-blue-600 mt-1">{stats.users}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Medicines</h3>
                      <p className="text-3xl font-bold text-green-600 mt-1">{stats.medicines}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💊</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Orders</h3>
                      <p className="text-3xl font-bold text-purple-600 mt-1">{stats.orders}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeSection === 'users' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h2>
              <p className="text-gray-600 mb-8">View and manage all registered users</p>
              
              {/* Edit User Modal */}
              {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
                  <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <h3 className="text-2xl font-bold mb-4">Edit User</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveUser}
                          disabled={loading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          disabled={loading}
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  {users.length === 0 && !initialLoading ? (
                    <div className="p-8 text-center text-gray-500">No users found</div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {initialLoading ? (
                          [...Array(3)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-40"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                            </tr>
                          ))
                        ) : (
                          users.map(userItem => (
                            <tr key={userItem._id} className="hover:bg-gray-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{userItem.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.role}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <button
                                  onClick={() => handleEditUser(userItem)}
                                  disabled={loading}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg mr-2 text-xs font-medium transition duration-200 disabled:opacity-50"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(userItem._id)}
                                  disabled={loading}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition duration-200 disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sellers' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Sellers</h2>
              <p className="text-gray-600 mb-8">View and manage all seller accounts</p>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  {users.filter(userItem => userItem.role === 'seller').length === 0 && !initialLoading ? (
                    <div className="p-8 text-center text-gray-500">No sellers found</div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {initialLoading ? (
                          [...Array(3)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-40"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                            </tr>
                          ))
                        ) : (
                          users.filter(userItem => userItem.role === 'seller').map(seller => (
                            <tr key={seller._id} className="hover:bg-gray-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{seller.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{seller.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{seller.role}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg mr-2 text-xs font-medium transition duration-200">View</button>
                                <button
                                  onClick={() => handleDeleteUser(seller._id)}
                                  disabled={loading}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition duration-200 disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'medicines' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Medicines</h2>
              <p className="text-gray-600 mb-8">View and manage all medicines</p>
              
              {/* Edit Medicine Modal */}
              {editingMedicine && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
                  <div className="bg-white rounded-lg p-8 max-w-md w-full">
                    <h3 className="text-2xl font-bold mb-4">Edit Medicine</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                          type="text"
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="number"
                          value={editData.price}
                          onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveMedicine}
                          disabled={loading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingMedicine(null)}
                          disabled={loading}
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  {medicines.length === 0 && !initialLoading ? (
                    <div className="p-8 text-center text-gray-500">No medicines found</div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {initialLoading ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="animate-pulse">
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-8"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-24"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-16"></div></td>
                              <td className="px-6 py-4"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                            </tr>
                          ))
                        ) : (
                          medicines.map(med => (
                            <tr key={med._id || med.id} className="hover:bg-gray-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${med.price}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <button
                                  onClick={() => handleEditMedicine(med)}
                                  disabled={loading}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg mr-2 text-xs font-medium transition duration-200 disabled:opacity-50"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMedicine(med._id || med.id)}
                                  disabled={loading}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition duration-200 disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Orders</h2>
              <p className="text-gray-600 mb-8">View all orders in the system</p>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600 mb-8">Configure your pharmacy settings</p>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy Name</label>
                    <input
                      type="text"
                      value={settings.pharmacyName}
                      onChange={(e) => setSettings({ ...settings, pharmacyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="MedKart"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="admin@medkart.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="+1 234 567 890"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
