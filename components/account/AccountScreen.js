"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/home/BottomNav";
import AnnouncementsModal from "@/components/home/AnnouncementsModal";
import AccountSheet from "@/components/account/AccountSheet";
import AccountIcon from "@/components/account/AccountIcon";
import { getStoredAvatar } from "@/lib/userPreferences";
import { getAgentStatus } from "@/lib/agentApi";
import { clearAuth, getToken, getUser, isPartnerUser, setUser } from "@/lib/auth";
import { getBalance } from "@/lib/walletApi";
import { getNotifications, getProfile } from "@/lib/userApi";
import { disconnectSocket, getSocket } from "@/lib/socket";
import { usePlatformStatus } from "@/components/platform/PlatformStatusProvider";
import { getAnnouncements, getVipProgram } from "@/lib/platformApi";
import { Odometer } from "@/components/Odometer";

const QUICK_ACTIONS = [
  { iconId: "wallet", label: "Wallet", href: "/wallet" },
  { iconId: "deposit", label: "Deposit", href: "/wallet/deposit" },
  { iconId: "withdraw", label: "Withdraw", href: "/wallet/withdraw" },
  { iconId: "invite-friends", label: "Invite", href: "/referral" },
];

const HISTORY_ITEMS = [
  { iconId: "game-history", href: "/games/history", title: "Game History", sub: "My game history", color: "blue" },
  { iconId: "transaction", href: "/wallet/transactions", title: "Transaction", sub: "My transaction history", color: "green" },
  { iconId: "deposit-history", href: "/wallet/deposit/history", title: "Deposit", sub: "My deposit history", color: "red" },
  { iconId: "withdraw-history", href: "/wallet/withdraw/history", title: "Withdraw", sub: "My withdraw history", color: "orange" },
];

const KYC_LABELS = {
  pending: "KYC pending",
  verified: "KYC verified",
  rejected: "KYC rejected",
};

const BASE_SETTINGS_ITEMS = [
  { iconId: "edit-profile", label: "Edit profile", href: "/account/profile" },
  { iconId: "security", label: "Security", href: "/account/security" },
  { iconId: "notifications", label: "Notifications", href: "/account/notifications", showUnread: true },
  { iconId: "invite-friends", label: "Invite friends", href: "/referral" },
  { iconId: "gifts", label: "Gifts", href: "/account/gifts" },
  { iconId: "game-stats", label: "Game statistics", href: "/games/history" },
];

const SERVICE_ITEMS = [
  { iconId: "announcement", label: "Announcement", action: "announcement" },
  { iconId: "customer-service", label: "Customer Service", href: "/support" },
  { iconId: "feedback", label: "Feedback", href: "/account/feedback" },
  { iconId: "guide", label: "Beginner's Guide", href: "/account/guide" },
  { iconId: "about", label: "About us", href: "/about" },
];

export default function AccountScreen() {
  const router = useRouter();
  const { maintenanceMode, message: maintenanceMessage } = usePlatformStatus();
  const [mounted, setMounted] = useState(false);
  const [user, setUserState] = useState(null);
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [avatar, setAvatar] = useState("👤");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState("");
  const [announcementItems, setAnnouncementItems] = useState([]);
  const [announcementMarquee, setAnnouncementMarquee] = useState(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [vipProgram, setVipProgram] = useState(null);

  const loadBalance = useCallback(async () => {
    try {
      const res = await getBalance();
      setBalance(res.data.balance);
      localStorage.setItem("lastBalance", String(res.data.balance));
    } catch {
      setBalance(0);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await getProfile();
      const profile = res.data;
      setUserState(profile);
      const storedUser = getUser();
      if (storedUser) {
        setUser({ ...storedUser, ...profile });
      }
    } catch {
      const storedUser = getUser();
      if (storedUser) setUserState(storedUser);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await getNotifications({ limit: 1 });
      setUnreadCount(res.data?.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  const syncPartnerAccess = useCallback(async () => {
    const storedUser = getUser();
    if (isPartnerUser(storedUser)) {
      setIsPartner(true);
      return;
    }

    try {
      const res = await getAgentStatus();
      const status = res.data;
      if (status?.isAgent) {
        setIsPartner(true);
        if (storedUser) {
          const nextUser = {
            ...storedUser,
            agentProfile: {
              id: status.id,
              status: status.status,
              agentType: status.agentType,
              agentCode: status.agentCode,
            },
          };
          setUser(nextUser);
          setUserState((prev) => ({ ...(prev || storedUser), ...nextUser }));
        }
        return;
      }
    } catch {
      // non-partner
    }

    setIsPartner(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    if (typeof window !== "undefined") {
      const cached = Number(window.localStorage.getItem("lastBalance"));
      if (Number.isFinite(cached)) {
        setBalance(cached);
      }
    }

    setAvatar(getStoredAvatar());
    loadBalance();
    loadProfile();
    loadUnreadCount();
    syncPartnerAccess();

    let activeSocket = null;
    let cancelled = false;

    const onWalletUpdated = (data) => {
      if (typeof data?.balance === "number") {
        setBalance(data.balance);
      }
    };

    getSocket().then((socket) => {
      if (!socket || cancelled) return;
      activeSocket = socket;
      socket.emit("join:user");
      socket.on("wallet:updated", onWalletUpdated);
    });

    return () => {
      cancelled = true;
      if (activeSocket) {
        activeSocket.off("wallet:updated", onWalletUpdated);
      }
    };
  }, [router, loadBalance, loadProfile, loadUnreadCount, syncPartnerAccess]);

  useEffect(() => {
    let cancelled = false;
    getAnnouncements()
      .then((res) => {
        if (cancelled) return;
        const items = res?.data?.items;
        if (Array.isArray(items)) {
          setAnnouncementItems(items);
        }
        const nextMarquee = res?.data?.marquee;
        if (nextMarquee?.text) {
          setAnnouncementMarquee(nextMarquee);
        } else if (nextMarquee === null) {
          setAnnouncementMarquee(null);
        }
      })
      .catch(() => {
        /* keep empty — AccountSheet shows fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getVipProgram()
      .then((res) => {
        if (!cancelled) setVipProgram(res?.data || { enabled: false });
      })
      .catch(() => {
        if (!cancelled) setVipProgram({ enabled: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showVipUi = Boolean(vipProgram?.enabled);
  const showVipBadge = showVipUi && vipProgram?.showBadge !== false;
  const showVipQuickAction = showVipUi && vipProgram?.showQuickAction !== false;
  const vipLevelLabel = vipProgram?.defaultLevel || "VIP0";

  const quickActions = useMemo(
    () => QUICK_ACTIONS.filter((action) => !action.vipAction || showVipQuickAction),
    [showVipQuickAction]
  );

  const settingsItems = useMemo(() => {
    const base = [...BASE_SETTINGS_ITEMS];
    if (isPartner) {
      return [{ iconId: "partner", label: "Partner portal", href: "/agent" }, ...base];
    }
    return base;
  }, [isPartner]);

  const handleSettingsAction = (item) => {
    if (item.action === "coming-soon") {
      setSheet({ type: "coming-soon", text: item.comingSoonText });
      return;
    }
    if (item.action === "announcement") {
      setAnnouncementModalOpen(true);
    }
  };

  const handleServiceAction = (item) => {
    if (item.href) return;
    handleSettingsAction(item);
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadBalance(), loadProfile(), loadUnreadCount()]);
    setRefreshing(false);
  };

  const handleLogout = () => {
    disconnectSocket();
    clearAuth();
    router.replace("/login");
  };

  const copyUid = () => {
    const numericUid = user?.uid || user?.id || "";
    if (numericUid) {
      navigator.clipboard.writeText(String(numericUid));
      setToast("UID copied");
    }
  };

  if (!mounted) {
    return (
      <main className="account-page">
        <div className="account-loading">Loading...</div>
      </main>
    );
  }

  const displayName = user?.name || "Member";
  const uid = user?.uid ? String(user.uid) : user?.id ? String(user.id).slice(-7) : "0000000";
  const lastLogin = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : user?.createdAt
      ? new Date(user.createdAt).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "—";
  const displayAvatar = avatar === "👤" ? "😎" : avatar;
  const kycStatus = user?.kycStatus || "pending";

  const displayPhone = user?.phone || "916359736842";

  return (
    <main className="account-page" style={{ background: "#f8f8fa", minHeight: "100vh", paddingBottom: "90px", color: "#333", fontFamily: "sans-serif" }}>
      {/* Red Header & Balance Card Section */}
      <section
        style={{
          background: "#f81a2e",
          color: "#ffffff",
          padding: "24px 16px 20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* User profile row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Circular Avatar (Light Green) */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#c0ca33",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {avatar || "9"}
            </div>
            {/* User Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>
                User: {displayPhone}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.9 }}>
                ID: {uid}
              </div>
            </div>
          </div>

          {/* Notifications Bell Circle Button */}
          <Link
            href="/account/notifications"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              textDecoration: "none",
              position: "relative",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px" }}>
              <path d="M12 22a2.01 2.01 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "#f81a2e",
                  color: "#ffffff",
                  fontSize: "9px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "14px",
                  height: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* 3-Column Balance Subheader */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", paddingTop: "6px" }}>
          {/* Balance */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ fontSize: "16px", fontWeight: "700" }}>₹ {balance.toFixed(2)}</div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>Balance</div>
            <Link
              href="/wallet/deposit"
              style={{
                background: "#00a2ff",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "4px 12px",
                borderRadius: "2px",
                textDecoration: "none",
                marginTop: "2px",
              }}
            >
              Recharge
            </Link>
          </div>

          {/* Commission */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ fontSize: "15px", fontWeight: "700" }}>₹ 0</div>
            <div style={{ fontSize: "11px", opacity: 0.9 }}>Commission</div>
            <Link
              href="/referral"
              style={{
                background: "#00a2ff",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "4px 12px",
                borderRadius: "2px",
                textDecoration: "none",
                marginTop: "2px",
              }}
            >
              See
            </Link>
          </div>

          {/* Interest */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ fontSize: "15px", fontWeight: "700" }}>₹ 0</div>
            <div style={{ fontSize: "11px", opacity: 0.9 }}>Interest</div>
            <button
              onClick={() => setToast("Interest feature is coming soon!")}
              style={{
                background: "#00a2ff",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                padding: "4px 12px",
                borderRadius: "2px",
                border: "none",
                cursor: "pointer",
                marginTop: "2px",
              }}
            >
              See
            </button>
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section style={{ background: "#ffffff", margin: "12px 0 20px 0", borderTop: "1px solid #eaeaea", borderBottom: "1px solid #eaeaea" }}>
        {[
          {
            label: "Sign In",
            href: "/account/gifts",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            )
          },
          {
            label: "Orders",
            href: "/games/history",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="#94a3b8" />
              </svg>
            )
          },
          {
            label: "Promotion",
            href: "/referral",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            )
          },
          {
            label: "Red Envelope",
            href: "/account/gifts",
            customIcon: (
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#00b894", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "11px", fontWeight: "bold" }}>
                ₹
              </div>
            )
          },
          {
            label: "Luck Draw",
            href: "/promo",
            customIcon: (
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#00b894", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "11px", fontWeight: "bold" }}>
                ₹
              </div>
            )
          },
          {
            label: "Wallet",
            href: "/wallet",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            )
          },
          {
            label: "Bank Card",
            href: "/wallet/withdraw",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            )
          },
          {
            label: "Address",
            href: "/account/profile",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="9" y1="22" x2="9" y2="16" />
                <line x1="15" y1="22" x2="15" y2="16" />
                <line x1="9" y1="16" x2="15" y2="16" />
                <path d="M8 6h2M8 10h2M14 6h2M14 10h2" />
              </svg>
            )
          },
          {
            label: "Account Security",
            href: "/account/security",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            )
          },
          {
            label: "App Download",
            href: "/support",
            svg: (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #f1f5f9",
              textDecoration: "none",
              color: "#333",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ display: "flex", alignItems: "center", width: "24px", justifyContent: "center" }}>
                {item.customIcon ? item.customIcon : item.svg}
              </span>
              <span style={{ fontWeight: "500", color: "#333" }}>{item.label}</span>
            </div>
            <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "12px", height: "12px" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </Link>
        ))}
      </section>



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

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}

      {/* Logout Button */}
      <div style={{ padding: "0 16px 20px 16px" }}>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            background: "#f81a2e",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(248, 26, 46, 0.2)",
          }}
        >
          Logout
        </button>
      </div>

      <BottomNav />
    </main>
  );
}





function renderAvatarSvg(id, size = 44) {
  switch (id) {
    case "1":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#FFE082"/>
          <circle cx="50" cy="40" r="22" fill="#4E342E"/>
          <path d="M20 90a30 30 0 0 1 60 0" fill="#5D4037"/>
          <rect x="35" y="35" width="30" height="8" rx="2" fill="#000"/>
          <circle cx="50" cy="45" r="3" fill="#FF8F00"/>
        </svg>
      );
    case "2":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#80CBC4"/>
          <circle cx="50" cy="38" r="20" fill="#D7CCC8"/>
          <path d="M25 90a25 25 0 0 1 50 0" fill="#00796B"/>
          <path d="M40 30c5-5 15-5 20 0" stroke="#37474F" strokeWidth="4" fill="none"/>
        </svg>
      );
    case "3":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#CE93D8"/>
          <circle cx="50" cy="42" r="22" fill="#FFE082"/>
          <path d="M22 88a28 28 0 0 1 56 0" fill="#7B1FA2"/>
          <circle cx="42" cy="42" r="2" fill="#333"/>
          <circle cx="58" cy="42" r="2" fill="#333"/>
          <path d="M45 50q5 4 10 0" stroke="#333" strokeWidth="2" fill="none"/>
        </svg>
      );
    case "4":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#FFCC80"/>
          <rect x="30" y="20" width="40" height="25" rx="10" fill="#E65100"/>
          <circle cx="50" cy="45" r="20" fill="#FFD54F"/>
          <path d="M24 92a26 26 0 0 1 52 0" fill="#BF360C"/>
        </svg>
      );
    case "5":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#90CAF9"/>
          <rect x="32" y="24" width="36" height="30" rx="6" fill="#37474F"/>
          <circle cx="42" cy="38" r="4" fill="#00E676"/>
          <circle cx="58" cy="38" r="4" fill="#00E676"/>
          <rect x="42" y="46" width="16" height="4" fill="#00E676"/>
          <path d="M25 90a25 25 0 0 1 50 0" fill="#1565C0"/>
        </svg>
      );
    case "6":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#F48FB1"/>
          <path d="M30 25c10-10 30-10 40 0 10 10 5 30 5 30H25s-5-20 5-30z" fill="#AD1457"/>
          <circle cx="50" cy="44" r="18" fill="#FFD54F"/>
          <path d="M26 88a24 24 0 0 1 48 0" fill="#C2185B"/>
        </svg>
      );
    case "7":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#A5D6A7"/>
          <circle cx="50" cy="36" r="18" fill="#F5CBA7"/>
          <path d="M36 44c0 10 8 16 14 16s14-6 14-16" fill="#5D4037"/>
          <path d="M26 90a24 24 0 0 1 48 0" fill="#2E7D32"/>
        </svg>
      );
    case "8":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <circle cx="50" cy="50" r="50" fill="#B0BEC5"/>
          <circle cx="50" cy="44" r="20" fill="#FFE082"/>
          <path d="M35 24l5 8 10-8 10 8 5-8v12H35V24z" fill="#FFD54F"/>
          <path d="M24 90a26 26 0 0 1 52 0" fill="#37474F"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" style={{ color: "rgba(255,255,255,0.4)" }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
}
