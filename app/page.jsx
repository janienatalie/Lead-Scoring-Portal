"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
import { saveToken } from "./lib/auth";

const LoginPage = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const translations = {
    en: {
      title: "Login to your Account",
      subtitle: "Enter your email and password to access your account",
      email: "Email",
      emailPlaceholder: "example@gmail.com",
      password: "Password",
      passwordPlaceholder: "Enter password",
      // remember: "Remember me",
      login: "Login",
      invalidLogin: "Invalid email or password",
    },
    id: {
      title: "Masuk ke Akun Anda",
      subtitle: "Masukkan email dan kata sandi Anda untuk mengakses akun",
      email: "Email",
      emailPlaceholder: "contoh@gmail.com",
      password: "Kata Sandi",
      passwordPlaceholder: "Masukkan kata sandi",
      remember: "Ingat saya",
      login: "Masuk",
      invalidLogin: "Email atau kata sandi salah",
    },
  };

  const t = translations[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.user) {
          localStorage.setItem("user_info", JSON.stringify(data.user));
        }

        router.push("/dashboard");
      } else {
        setError(t.invalidLogin);
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server.");
    }
  };

  // --- Definisi Ikon ---
  const EyeIcon = () => (
    <svg
      className="w-5 h-5 text-textGrayLight"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      ></path>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      className="w-5 h-5 text-textGrayLight"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .946-3.013 3.42-5.32 6.364-6.222M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.94 17.94A10.04 10.04 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7-1.631 0-3.17.48-4.5.13M1 1l22 22"
      ></path>
    </svg>
  );

  // --- Definisi Kelas Styling ---
  const cardBgClass = theme === "dark" ? "bg-darkPrimary" : "bg-white";
  const textColorClass =
    theme === "dark" ? "text-darkFontColor" : "text-fontColor";
  const tableBorderColor =
    theme === "dark" ? "border-borderColorDark" : "border-borderColorLight";
  const inputBgColor =
    theme === "dark"
      ? "bg-darkSecondary border-borderColorDark"
      : "bg-white border-borderColorLight";
  const inputTextColor =
    theme === "dark" ? "text-darkFontColor" : "text-fontColor";
  const placeholderColor =
    theme === "dark" ? "placeholder-textGrayDark" : "placeholder-textGrayLight";

  return (
    // Container utama (tetap h-screen)
    <main className={`flex h-screen ${textColorClass}`}>
      {/* --- AWAL PERUBAHAN --- */}
      {/* Kolom Kiri: Form Login (Ubah md:w-1/2 menjadi md:w-5/12 dan hapus flex-1) */}
      <div
        className={`w-full md:w-1/2 flex flex-col justify-center items-center py-12 px-4 sm:px-6 ${cardBgClass} transition-colors duration-300`}
      >
        {/* --- AKHIR PERUBAHAN --- */}

        <div className="w-full max-w-md">
          {/* Logo (rata tengah) */}
          <div className="mb-4 flex justify-center">
            <Image
              src={theme === "dark" ? "/Logo-dark.png" : "/Logo-light.png"}
              alt="Lead Score Portal Logo"
              width={140}
              height={40}
              priority
            />
          </div>

          {/* Judul & Subjudul (rata tengah) */}
          <h1 className="text-3xl font-bold mb-2 text-secondary text-center">
            {t.title}
          </h1>
          <p className="text-textGrayLight dark:text-textGrayDark mb-14 text-center ">
            {t.subtitle}
          </p>

          {error && (
            <p className="bg-dangerRedLight text-dangerRedDark p-3 rounded-xl text-center mb-6 text-sm">
              {error}
            </p>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t.email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className={`w-full p-3 rounded-xl border ${inputBgColor} ${tableBorderColor} ${inputTextColor} ${placeholderColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary`}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                {t.password}
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className={`w-full p-3 pr-10 rounded-xl border ${inputBgColor} ${tableBorderColor} ${inputTextColor} ${placeholderColor} text-sm focus:outline-none focus:ring-1 focus:ring-primary`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-secondary border-gray-300 rounded-md"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-textGrayLight dark:text-textGrayDark"
              >
                {t.remember}
              </label>
            </div> */}

            {/* Tombol Login */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-primary to-secondary rounded-xl transition-all duration-200 hover:brightness-110 text-sm font-semibold"
              >
                {t.login}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- AWAL PERUBAHAN --- */}
      <div
        className={`w-1/2 hidden flex-1 md:flex items-center justify-center p-4 ${cardBgClass} transition-colors duration-300`}
      >
        <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-3xl flex items-center justify-center p-12">
          <Image
            src="/login.png" 
            width={800}
            height={800}
            alt="Login Illustration"
            priority
            className="w-full max-w-lg"
          />
        </div>
      </div>
      {/* --- AKHIR PERUBAHAN --- */}
    </main>
  );
};

export default LoginPage;
