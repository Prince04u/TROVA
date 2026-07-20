"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "./BottomNav";
import WelcomeModal from "./WelcomeModal";
import { isAuthenticated } from "@/lib/auth";

const LATEST_PRODUCTS = [
  { id: 1, name: "【Now】 Series White 18K Gold Pair Ring", price: 38570.0, image: "💍", color: "#e2e8f0" },
  { id: 2, name: "【Cute Pet】 Series Rose 18K Gold Pearl Pendant", price: 2899.0, image: "📿", color: "#fed7aa" },
  { id: 3, name: "18K Gold Diamond Ruby Deer Horn Collar Chain", price: 5420.0, image: "🦌", color: "#fecdd3" },
  { id: 4, name: "Enzo Jewelry 14k Gold Seven Colored Gemstone Butterfly Pendant", price: 12900.0, image: "🦋", color: "#d9f99d" },
];

export default function HomeScreen() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      const hasShown = sessionStorage.getItem("hasShownWelcomePopup");
      if (!hasShown) {
        setShowWelcome(true);
      }
    }
  }, []);

  const handleConfirmWelcome = () => {
    sessionStorage.setItem("hasShownWelcomePopup", "true");
    setShowWelcome(false);
  };

  return (
    <main className="club-app" style={{ background: "#f5f5f5", minHeight: "100vh", paddingBottom: "90px", color: "#333" }}>
      {/* Brand Header */}
      <div
        style={{
          background: "#f81a2e",
          color: "#ffffff",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "1px" }}>
          OMNEA
        </div>
        <Link href="/support" style={{ color: "#ffffff", display: "flex", alignItems: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </Link>
      </div>

      {/* Hero Welcome Banner */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #ffe3e3",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: 1, zIndex: 2 }}>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#f81a2e", marginBottom: "4px" }}>
              Welcome Back
            </div>
            <div style={{ fontSize: "12px", color: "#777", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
              Quality Guarantee
            </div>
            <div style={{ fontSize: "11px", color: "#999", marginTop: "8px", lineHeight: "1.4" }}>
              Explore our exquisite collection of premium gold jewelry & color prediction games.
            </div>
            <Link
              href="/wingo/1m"
              style={{
                display: "inline-block",
                background: "#f81a2e",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "8px 16px",
                borderRadius: "20px",
                textDecoration: "none",
                marginTop: "14px",
                boxShadow: "0 2px 6px rgba(248, 26, 46, 0.2)",
              }}
            >
              Play Win Go
            </Link>
          </div>
          <div style={{ fontSize: "64px", zIndex: 1, opacity: 0.95, marginLeft: "12px" }}>
            ✨
          </div>
        </div>
      </div>

      {/* VIP Gaming Lobby */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ padding: "16px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#333", marginBottom: "12px", borderLeft: "3px solid #f81a2e", paddingLeft: "8px" }}>
            VIP ENTERTAINMENT LOBBY
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Link href="/wingo/1m" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff5f5", padding: "10px", borderRadius: "8px", textDecoration: "none", color: "#333", border: "1px solid #ffe3e3" }}>
              <span style={{ fontSize: "20px" }}>🏆</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>Win Go</div>
                <div style={{ fontSize: "10px", color: "#f81a2e" }}>Color Prediction</div>
              </div>
            </Link>
            <Link href="/mines" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", padding: "10px", borderRadius: "8px", textDecoration: "none", color: "#333", border: "1px solid #dcfce7" }}>
              <span style={{ fontSize: "20px" }}>💣</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>Mines</div>
                <div style={{ fontSize: "10px", color: "#16a34a" }}>Mine Sweeper</div>
              </div>
            </Link>
            <Link href="/limbo" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#eff6ff", padding: "10px", borderRadius: "8px", textDecoration: "none", color: "#333", border: "1px solid #dbeafe" }}>
              <span style={{ fontSize: "20px" }}>🚀</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>Limbo</div>
                <div style={{ fontSize: "10px", color: "#2563eb" }}>Multiplier Game</div>
              </div>
            </Link>
            <Link href="/dice" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fffbeb", padding: "10px", borderRadius: "8px", textDecoration: "none", color: "#333", border: "1px solid #fef3c7" }}>
              <span style={{ fontSize: "20px" }}>🎲</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>Dice</div>
                <div style={{ fontSize: "10px", color: "#d97706" }}>Roll Dice</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Collection Grid */}
      <div style={{ padding: "20px 16px 12px 16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "800", color: "#333", marginBottom: "12px", borderLeft: "3px solid #f81a2e", paddingLeft: "8px" }}>
          EXQUISITE GOODS
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {LATEST_PRODUCTS.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "130px",
                  background: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "44px",
                }}
              >
                {p.image}
              </div>
              <div style={{ padding: "10px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#333",
                    lineHeight: "1.4",
                    marginBottom: "6px",
                    height: "30px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#f81a2e" }}>
                  ₹ {p.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Slot Machine Button */}
      <Link
        href="/wingo/1m"
        style={{
          position: "fixed",
          right: "12px",
          top: "40%",
          zIndex: 999,
          width: "70px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #f81a2e",
            borderRadius: "10px",
            padding: "6px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "10px",
            color: "#f81a2e",
          }}
        >
          <span style={{ fontSize: "20px", display: "block" }}>🎰</span>
          777
          <div style={{ background: "#f81a2e", color: "#ffffff", borderRadius: "4px", padding: "2px 4px", marginTop: "4px", fontSize: "9px" }}>Start</div>
        </div>
      </Link>

      {/* Floating Customer Service Button */}
      <Link
        href="/support"
        style={{
          position: "fixed",
          right: "16px",
          bottom: "74px",
          zIndex: 99,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "#f81a2e",
          border: "2px solid #ffffff",
          boxShadow: "0 4px 12px rgba(248, 26, 46, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          cursor: "pointer",
        }}
        aria-label="Customer Service"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      </Link>

      <WelcomeModal isOpen={showWelcome} onClose={handleConfirmWelcome} />
      <BottomNav />
    </main>
  );
}