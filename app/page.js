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
      newErrors.email = "Invalid email format";
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
        setToast({ message: "Login successful!", type: "success" });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setToast({ message: result.message || "Login failed", type: "error" });
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
        type === "success" ? "bg-green-600" : "bg-red-500"
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
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* LEFT CARD */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="bg-white w-full max-w-xl rounded-[30px] p-10 shadow-xl">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center">
              <Image
                src="/Logo-light.png"
                alt="Lead Score Logo"
                width={55}
                height={55}
                className="w-14 h-14"
              />
              <div className="ml-3">
                <h1 className="text-3xl font-bold text-gray-900">LEAD SCORE</h1>
                <p className="text-lg font-semibold text-green-600">PORTAL</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-700">
              Login to your Account
            </h2>
            <p className="text-gray-500 mt-2">Enter your email and password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <Image
                  src="/mdi_eye-off.png"
                  alt="toggle"
                  width={24}
                  height={24}
                  className="absolute right-3 top-3 opacity-60"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="ml-2 text-gray-700">Remember me</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:flex md:w-1/2 bg-green-600 items-center justify-center p-10">
        <div className="rounded-[40px] overflow-hidden shadow-2xl">
          <Image
            src="/login.png"
            width={500}
            height={500}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

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
