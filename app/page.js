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
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex">
      {/* LEFT SIDE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-10">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="flex justify-center mb-10">
            <Image
              src="/Logo-light.png"
              alt="Logo"
              width={110}
              height={110}
              className="w-[110px]"
            />
          </div>

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-700 mb-3">
              Login to your Account
            </h1>
            <p className="text-gray-600">
              Enter your email and password to access your account.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2 font-semibold text-gray-800">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />

                {/* EYE ICON */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Image
                    src={showPassword ? "/mdi_eye-off.png" : "/eye-open.png"}
                    alt="toggle password"
                    width={22}
                    height={22}
                  />
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* REMEMBER */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-green-600"
              />
              <label className="ml-2 text-gray-800">Remember me</label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE — GREEN CURVED */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-l-[70px]"></div>

        <div className="relative z-10 w-full flex items-center justify-center p-10">
          <Image
            src="/login.png"
            alt="illustration"
            width={500}
            height={500}
            className="w-[420px] h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
