import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { login as apiLogin, register as apiRegister } from "../api/apiService.js";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "seller") navigate("/seller/dashboard");
      else navigate("/medicine");
    }
  }, [user, navigate]);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (isRegister) {
      if (!name || !email || !password) { setError("All fields are required"); return; }

      try {
        const data = await apiRegister({ name, email, password });
        // Auto-login after register
        login(data.user, data.token);
        if (data.user.role === "seller") navigate("/seller/dashboard");
        else if (data.user.role === "admin") navigate("/admin/dashboard");
        else navigate("/medicine");
      } catch (err) {
        setError(err.message);
      }
      return;
    }

    try {
      const data = await apiLogin({ email, password });

      login(data.user, data.token);

      if (data.user.role === "seller") navigate("/seller/dashboard");
      else if (data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl flex w-4/5 max-w-4xl overflow-hidden">

        {/* Left Logo Panel */}
        <div className="w-1/2 hidden md:flex bg-gradient-to-b from-blue-600 to-cyan-500 items-center justify-center p-10">
          <div className="text-center">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text 
                bg-gradient-to-r from-white to-gray-200 drop-shadow-xl tracking-wider">
              MEDKART
            </h1>
            <p className="text-white text-lg mt-2 drop-shadow-md">
              Your Trusted Online Pharmacy
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-2">{isRegister ? "Register" : "Login"}</h2>
          <p className="text-gray-500 mb-6">{isRegister ? "Create your account" : "Access your account"}</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full mb-4 rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition shadow-sm"
            />
          )}



          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition shadow-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-6 rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition shadow-sm"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-500">
            {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-cyan-500 font-semibold cursor-pointer hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
