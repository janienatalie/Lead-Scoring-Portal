"use client";
import { useState, useEffect } from "react";
import { loginUser, isAuthenticated } from "./lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      if (result.success) {
        setToast({
          message: "Login successful! Redirecting...",
          type: "success",
        });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setToast({ message: result.message || "Login failed!", type: "error" });
      }
    } catch (error) {
      setToast({ message: "An error occurred.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const Toast = ({ message, type, onClose }) => (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold">
          ×
        </button>
      </div>
    </div>
  );

  if (isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">LEAD SCORE</h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-2xl font-semibold text-gray-700">SIGNS</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Login to your Account
            </h2>
            <p className="text-gray-600">
              Enter your email and password to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@leadscore.com"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-gray-50"
              />
            </div>

            <div className="text-center py-6 border-t border-gray-200">
              <p className="text-xl font-medium text-gray-500">Inversion net</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-xl transition-colors"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Lead Score Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
