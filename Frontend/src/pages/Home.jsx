
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load account.");
        }

        if (active) setUser(data.user);
      } catch (err) {
        if (active) setError(err.message || "Unable to connect to the server.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/login", { replace: true });
    }
  }

  if (loading) {
    return <main className="min-h-screen grid place-items-center">Loading your account...</main>;
  }

  if (error) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div>
          <p role="alert" className="mb-4 text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-xl bg-violet-700 px-5 py-3 text-white">
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">
          Secure<span className="text-violet-700">Space</span>
        </h1>
        <button
          onClick={handleLogout}
          className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Sign out
        </button>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-700">
            Your personal space
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Welcome, {user.name}
          </h2>
          <p className="mt-3 text-slate-500">
            You are signed in to SecureSpace.
          </p>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email address</p>
            <p className="mt-1 font-medium text-slate-900">{user.email}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
