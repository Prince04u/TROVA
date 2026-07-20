"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login as loginRequest } from "@/lib/authApi";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginRequest(form);
      saveAuth(response.data);
      router.push("/");
    } catch (err) {
      if (!err.response) {
        setError("Couldn't reach the server. Please check your internet connection and try again.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Top Header */}
      <div
        style={{
          background: "#f81a2e",
          color: "#ffffff",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            fontSize: "20px",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Login</h1>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {error && (
          <div style={{ background: "#fee2e2", color: "#ef4444", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {/* Mobile Number Field */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </span>
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required
              style={{
                border: "none",
                outline: "none",
                fontSize: "15px",
                width: "100%",
                marginLeft: "12px",
                color: "#333",
              }}
            />
          </div>

          {/* Password Field */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                border: "none",
                outline: "none",
                fontSize: "15px",
                width: "100%",
                marginLeft: "12px",
                color: "#333",
              }}
            />
          </div>

          {/* Center Login Button */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#f81a2e",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "12px 0",
                width: "180px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(248, 26, 46, 0.2)",
              }}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>

          {/* Sub Actions Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Link
              href="/register"
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                padding: "8px 0",
                width: "100px",
                fontSize: "13px",
                color: "#333",
                fontWeight: "600",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
            <Link
              href="/support"
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                padding: "8px 0",
                width: "150px",
                fontSize: "13px",
                color: "#333",
                fontWeight: "600",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
