
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";

const API = "http://localhost:3000";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must contain 8–128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reset your password.");
      }

      navigate("/login", {
        replace: true,
        state: { message: "Password reset successful. Please sign in." },
      });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <main className="min-h-screen bg-white lg:flex">
      <BrandPanel />

      <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-slate-900">
            Reset your password
          </h1>
          <p className="mt-3 mb-8 text-sm leading-6 text-slate-500">
            Choose a new password for your SecureSpace account.
          </p>

          {!token && (
            <p role="alert" className="mb-5 text-sm text-red-600">
              This link is invalid. Request a new password reset email.
            </p>
          )}

          {error && (
            <p role="alert" className="mb-5 text-sm text-red-600">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">
                New password
              </label>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="mb-2 block text-sm font-medium text-slate-700">
                Confirm new password
              </label>
              <input
                id="confirm-new-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-xl bg-violet-700 py-3.5 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to="/login" className="font-semibold text-violet-700">
              Back to sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
