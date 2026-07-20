"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAgentStatus } from "@/lib/agentApi";
import { getToken, getUser, isPartnerUser } from "@/lib/auth";
import { getNavIcon } from "@/lib/designAssets";
import NavIcon from "./NavIcon";

const SIDE_NAV = [
  { href: "/", label: "Home", iconId: "home", match: "exact" },
  { href: "/search", label: "Search", iconId: "search", match: "search" },
  { href: "/wingo/1m", label: "Win", iconId: "win", match: "wingo" },
  { href: "/account", label: "My", iconId: "account", match: "account" },
];

const isActive = (pathname, match, href) => {
  if (match === "exact") return pathname === "/";
  if (match === "search") return pathname.startsWith("/search");
  if (match === "wingo") return pathname.startsWith("/wingo");
  if (match === "account") return pathname.startsWith("/account");
  return pathname.startsWith(href);
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="club-bottom-nav" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
      {SIDE_NAV.map((item) => {
        const active = isActive(pathname, item.match, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`club-nav-item ${active ? "active" : ""}`}
          >
            <span className="club-nav-icon">
              <NavIcon id={item.iconId} />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
