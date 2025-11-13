"use client";
import { useState, useEffect } from "react";
import { loginUser, isAuthenticated, logoutUser } from "./lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    logoutUser();
  }, []);

  useEffect(() => {
    if (isClient && isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [isClient, router]);

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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Logo dan Form */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            {/* Logo di atas Login Header */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="Lead Score Logo"
                  width={60}
                  height={60}
                  className="w-15 h-15"
                />
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    LEAD SCORE
                  </h1>
                  <p className="text-xl font-semibold text-green-600">SIGNS</p>
                </div>
              </div>
            </div>

            {/* Login Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                Login to your Account
              </h2>
              <p className="text-gray-600 text-lg">
                Enter your email and password to access your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Field */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
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
                  className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <label className="ml-3 text-lg font-medium text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-5 px-4 rounded-xl font-semibold text-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Green Background dengan Illustration */}
      <div className="hidden md:block md:w-1/2 bg-green-600 relative">
        {/* Illustration di Tengah */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <Image
            src="/plugin.svg"
            alt="Mobile App Illustration"
            width={500}
            height={500}
            className="w-full h-auto max-w-lg"
            priority
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
