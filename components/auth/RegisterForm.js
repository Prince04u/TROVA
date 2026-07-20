"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { register as registerRequest } from "@/lib/authApi";
import { sendOtp } from "@/lib/wingoApi";
import { saveAuth } from "@/lib/auth";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    mobile: "",
    verificationCode: "",
    password: "",
    inviteCode: "",
  });

  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const ref = searchParams.get("r_code") || searchParams.get("ref");
    if (ref) {
      setForm((prev) => ({
        ...prev,
        inviteCode: ref.trim().toUpperCase(),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = async () => {
    if (!form.mobile) {
      setError("Please enter mobile number first");
      return;
    }
    setError("");
    setSuccess("");
    setOtpLoading(true);
    try {
      await sendOtp(form.mobile);
      setSuccess("OTP sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.mobile || !form.mobile.trim()) {
      setError("Mobile number is required");
      return;
    }

    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!form.inviteCode || !form.inviteCode.trim()) {
      setError("Invite code is required");
      return;
    }

    if (!agree) {
      setError("Please agree to the Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRequest({
        name: `Player${form.mobile.slice(-4) || "01"}`,
        mobile: form.mobile,
        password: form.password,
        referralCode: form.inviteCode.trim().toUpperCase(),
      });

      saveAuth(response.data);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
        <h1 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Register</h1>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {error && (
          <div style={{ background: "#fee2e2", color: "#ef4444", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#dcfce7", color: "#16a34a", padding: "10px 12px", borderRadius: "6px", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          {/* Verification Code + OTP Field */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <input
                type="text"
                name="verificationCode"
                placeholder="Verification Code"
                value={form.verificationCode}
                onChange={handleChange}
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
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "4px",
                padding: "0 24px",
                fontSize: "14px",
                color: "#333",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {otpLoading ? "..." : "OTP"}
            </button>
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
              marginBottom: "16px",
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
              minLength={6}
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

          {/* Invite Code Field */}
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
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </span>
            <input
              type="text"
              name="inviteCode"
              placeholder="Invite Code"
              value={form.inviteCode}
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

          {/* Checkbox Agreement */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#333", cursor: "pointer", marginBottom: "24px" }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#f81a2e" }}
            />
            <span>
              I agree <span style={{ color: "#f81a2e", fontWeight: "700" }}>Privacy Policy</span>
            </span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#f81a2e",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "14px",
              width: "100%",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(248, 26, 46, 0.2)",
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
