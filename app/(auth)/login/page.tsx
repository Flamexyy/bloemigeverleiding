"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuUser } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import { IoArrowBack } from "react-icons/io5";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      router.push("/account");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to validate email
  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="w-full max-w-[400px] text-text">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-text/70 hover:text-text"
      >
        <IoArrowBack />
        Terug naar de webshop
      </Link>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          <LuUser className="text-2xl text-text" />
        </div>
        <h1 className="text-3xl font-bold">INLOGGEN</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && <div className="rounded-xl bg-red-50 p-3 text-center text-red-400">{error}</div>}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block font-bold text-text"
          >
            E-MAILADRES
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none ${email && isValidEmail(email) ? "valid-input" : ""} `}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block font-bold text-text"
            >
              WACHTWOORD
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-text/70 hover:text-text"
            >
              Wachtwoord vergeten?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-[25px] bg-accent p-3 text-text transition-colors hover:bg-accent/70 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Even geduld..." : "Inloggen"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text/70">Nog geen account?</p>
        <Link
          href="/register"
          className="font-bold text-text transition-opacity hover:opacity-70"
        >
          Account aanmaken
        </Link>
      </div>
    </div>
  );
}
