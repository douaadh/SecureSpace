
import { useState } from "react";
import { Link } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";

const API = "http://localhost:3000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to process your request."
        );
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white lg:flex">
      <BrandPanel />

      <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="mb-8 inline-flex text-sm text-slate-500 hover:text-violet-700"
          >
            ← Back to sign in
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
              ✉
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Forgot your password?
            </h2>

            <p className="mt-3 leading-6 text-gray-500">
              Enter the email address associated with your account.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {submitted ? (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-800"
            >
              <p className="mb-1 font-semibold">
                Check your email
              </p>

              <p>
                If an account exists with this email, you will
                receive a reset link. Please check your inbox
                and spam folder.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                  setError("");
                }}
                className="mt-4 font-semibold underline"
              >
                Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="recovery-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-violet-700 py-3.5 font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
