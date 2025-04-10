"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LuUser } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptsMarketing: false, // Removed extra comma here
    acceptsTerms: false, // New state for terms acceptance
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate terms acceptance
    if (!formData.acceptsTerms) {
      setError("U moet akkoord gaan met de algemene voorwaarden");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          acceptsMarketing: formData.acceptsMarketing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registratie mislukt");
      }

      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registratie mislukt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add this function to check if passwords match
  const passwordsMatch = () => {
    return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  };

  const passwordsMismatch = () => {
    return formData.confirmPassword && formData.password !== formData.confirmPassword;
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
        <h1 className="text-3xl font-bold">ACCOUNT AANMAKEN</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && <div className="rounded-xl bg-red-50 p-3 text-center text-red-400">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block font-bold text-text"
            >
              VOORNAAM
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block font-bold text-text"
            >
              ACHTERNAAM
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none"
              required
            />
          </div>
        </div>

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
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block font-bold text-text"
          >
            WACHTWOORD
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none ${passwordsMatch() ? "password-match" : ""} `}
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block font-bold text-text"
          >
            BEVESTIG WACHTWOORD
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full rounded-xl border border-text/20 p-3 text-text focus:border-text focus:outline-none ${passwordsMatch() ? "password-match" : ""} ${passwordsMismatch() ? "password-mismatch" : ""} `}
            required
          />
          {passwordsMismatch() && <p className="mt-1 text-sm text-red-500">Wachtwoorden komen niet overeen</p>}
        </div>

        {/* Terms and Conditions checkbox */}
        <div className="mb-4 flex items-start">
          <div className="flex h-5 items-center">
            <input
              type="checkbox"
              id="acceptsTerms"
              name="acceptsTerms"
              checked={formData.acceptsTerms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-text/20 text-accent focus:ring-accent"
              required
            />
          </div>
          <label
            htmlFor="acceptsTerms"
            className="ml-2 text-sm text-text"
          >
            Ik ga akkoord met de{" "}
            <Link
              href="/terms-of-service"
              className="text-accent underline hover:opacity-80"
            >
              algemene voorwaarden
            </Link>
          </label>
        </div>

        {/* Marketing checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="acceptsMarketing"
            name="acceptsMarketing"
            checked={formData.acceptsMarketing}
            onChange={handleChange}
            className="h-4 w-4 rounded border-text/20 text-accent focus:ring-accent"
          />
          <label
            htmlFor="acceptsMarketing"
            className="ml-2 block text-sm text-text"
          >
            Schrijf me in voor de nieuwsbrief
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-[25px] bg-accent p-3 text-text transition-colors hover:bg-accent/70 ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Account aanmaken..." : "Account aanmaken"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text/70">Heb je al een account?</p>
        <Link
          href="/login"
          className="font-bold text-text transition-opacity hover:opacity-70"
        >
          Inloggen
        </Link>
      </div>
    </div>
  );
}
