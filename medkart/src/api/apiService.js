const BASE_URL = "https://medkart-backend.onrender.com/api";

const getToken = () => {
  return localStorage.getItem("token");
};

export const login = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Login failed");
  }
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Registration failed");
  }
  return data;
};

export const getMedicines = async () => {
  const response = await fetch(`${BASE_URL}/medicines`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to fetch medicines");
  }
  return data;
};

export const getAdminStats = async () => {
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to fetch admin stats");
  }
  return data;
};

export const getAdminUsers = async () => {
  const response = await fetch(`${BASE_URL}/admin/users`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to fetch admin users");
  }
  return data;
};


export const getAdminOrders = async () => {
  const response = await fetch(`${BASE_URL}/admin/orders`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to fetch admin orders");
  }
  return data;
};

export const deleteMedicine = async (id) => {
  const response = await fetch(`${BASE_URL}/seller/medicines/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || 'Failed to delete medicine');
  }
  return data;
};

// Cart endpoints
export const getCart = async () => {
  const response = await fetch(`${BASE_URL}/cart`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to fetch cart");
  }
  return data;
};

export const addToCart = async (item) => {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to add to cart");
  }
  return data;
};

export const removeFromCart = async (id) => {
  const response = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.msg || "Failed to remove from cart");
  }
  return data;
};
