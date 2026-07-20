"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/home/BottomNav";

const PRODUCTS = [
  {
    id: 1,
    name: "【Now】 Series White 18K Gold Pair Ring",
    price: 38570.0,
    image: "💍",
    color: "#e2e8f0",
  },
  {
    id: 2,
    name: "【Cute Pet】 Series Rose 18K Gold Pearl Pendant",
    price: 2899.0,
    image: "📿",
    color: "#fed7aa",
  },
  {
    id: 3,
    name: "18K Gold Diamond Ruby Deer Horn Collar Chain",
    price: 5420.0,
    image: "🦌",
    color: "#fecdd3",
  },
  {
    id: 4,
    name: "Enzo Jewelry 14k Gold Seven Colored Gemstone",
    price: 12900.0,
    image: "🦋",
    color: "#d9f99d",
  },
  {
    id: 5,
    name: "Luxury Princess Cut Emerald Ring",
    price: 18500.0,
    image: "💚",
    color: "#a7f3d0",
  },
  {
    id: 6,
    name: "Classic Gold Hoops Earring Pair",
    price: 4500.0,
    image: "🟡",
    color: "#fef08a",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="club-app" style={{ background: "#f5f5f5", minHeight: "100vh", paddingBottom: "80px", color: "#333" }}>
      {/* Top Search Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#ffffff",
          padding: "12px 16px",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f1f5f9",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: "16px", height: "16px", color: "#94a3b8", marginRight: "8px" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
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

      {/* Grid List */}
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
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Image Box */}
            <div
              style={{
                height: "140px",
                background: p.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
              }}
            >
              {p.image}
            </div>

            {/* Content Box */}
            <div style={{ padding: "12px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#333",
                  lineHeight: "1.4",
                  marginBottom: "8px",
                  height: "34px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {p.name}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#f81a2e" }}>
                ₹ {p.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          No goods found
        </div>
      )}

      {/* Navigation */}
      <BottomNav />
    </main>
  );
}
