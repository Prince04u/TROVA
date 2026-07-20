"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/home/BottomNav";

const PRODUCTS = [
  {
    id: 1,
    name: "【 Now 】 Series White 18K Gold Pair Ring",
    price: 38570.0,
    svg: (
      <svg viewBox="0 0 100 100" width="80" height="80">
        <circle cx="42" cy="50" r="22" stroke="#d4af37" strokeWidth="4.5" fill="none" />
        <circle cx="58" cy="50" r="22" stroke="#e5e5e5" strokeWidth="4.5" fill="none" />
        <circle cx="42" cy="30" r="3.5" fill="#3b82f6" />
        <circle cx="58" cy="30" r="3.5" fill="#3b82f6" />
        <circle cx="50" cy="27" r="2" fill="#3b82f6" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "【Cute Pet】 Series Rose 18K Gold Pearl Pendant",
    price: 2899.0,
    svg: (
      <svg viewBox="0 0 100 100" width="80" height="80">
        <line x1="50" y1="0" x2="50" y2="40" stroke="#d4af37" strokeWidth="2.5" />
        <path d="M50 40 C40 45, 40 55, 50 60 C60 55, 60 45, 50 40 Z" fill="#e6c46e" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="50" cy="65" r="14" fill="#fcfcfc" stroke="#e5e5e5" strokeWidth="2" />
        <circle cx="50" cy="65" r="3" fill="#fff" opacity="0.8" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "18K Gold Diamond Ruby Deer Horn Collar Chain",
    price: 5420.0,
    svg: (
      <svg viewBox="0 0 100 100" width="80" height="80">
        <path d="M20 20 Q50 60 80 20" fill="none" stroke="#d4af37" strokeWidth="2" />
        <path d="M40 50 Q45 60 50 62 Q55 60 60 50" fill="none" stroke="#d4af37" strokeWidth="3" />
        <path d="M35 38 Q30 30 25 35 Q30 40 42 48" fill="none" stroke="#d4af37" strokeWidth="2.5" />
        <path d="M65 38 Q70 30 75 35 Q70 40 58 48" fill="none" stroke="#d4af37" strokeWidth="2.5" />
        <circle cx="50" cy="64" r="5" fill="#f43f5e" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Enzo Jewelry 14k Gold Seven Colored Gemstone Butterfly Pendant",
    price: 12900.0,
    svg: (
      <svg viewBox="0 0 100 100" width="80" height="80">
        <line x1="50" y1="0" x2="50" y2="30" stroke="#d4af37" strokeWidth="2" />
        {/* Left Wing */}
        <path d="M50 48 C25 30 20 55 50 65" fill="#f43f5e" stroke="#d4af37" strokeWidth="2" />
        <path d="M50 65 C30 65 35 80 50 72" fill="#3b82f6" stroke="#d4af37" strokeWidth="1.5" />
        {/* Right Wing */}
        <path d="M50 48 C75 30 80 55 50 65" fill="#10b981" stroke="#d4af37" strokeWidth="2" />
        <path d="M50 65 C70 65 65 80 50 72" fill="#eab308" stroke="#d4af37" strokeWidth="1.5" />
        {/* Center body */}
        <ellipse cx="50" cy="58" rx="3" ry="12" fill="#6366f1" />
      </svg>
    ),
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="club-app" style={{ background: "#f8f8fa", minHeight: "100vh", paddingBottom: "80px", color: "#333", fontFamily: "sans-serif" }}>
      {/* Search Bar Header */}
      <div
        style={{
          background: "#ffffff",
          padding: "16px",
          borderBottom: "1px solid #eaeaea",
          boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            borderRadius: "4px",
            padding: "10px 14px",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <input
            type="text"
            placeholder="Search for goods"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              width: "100%",
              color: "#333",
            }}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "16px",
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#ffffff",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            {/* White Background Image Frame */}
            <div
              style={{
                height: "150px",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {p.svg}
            </div>

            {/* Description Frame */}
            <div style={{ padding: "12px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#222",
                  fontWeight: "500",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                  height: "36px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {p.name}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#e08d3c" }}>
                ₹ {p.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2px" }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#f81a2e" }}>
              <rect x="3" y="2" width="18" height="20" rx="2" ry="2" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <path d="M21 9h2v4h-2" />
            </svg>
          </div>
          777
          <div style={{ background: "#f81a2e", color: "#ffffff", borderRadius: "4px", padding: "2px 4px", marginTop: "4px", fontSize: "9px" }}>Start</div>
        </div>
      </Link>

      <BottomNav />
    </main>
  );
}
