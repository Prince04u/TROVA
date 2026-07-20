"use client";

export default function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="welcome-modal-overlay" onClick={onClose}>
      <div className="welcome-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div style={{ textAlign: "center", paddingTop: "2rem", paddingBottom: "1rem", position: "relative" }}>
          <div style={{ fontSize: "10px", color: "#64748b", letterSpacing: "4px", fontWeight: "700", marginBottom: "4px" }}>WELCOME TO</div>
          <div style={{ fontSize: "28px", fontWeight: "950", color: "#f81a2e", letterSpacing: "1px" }}>
            TROVA
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
            <div style={{ height: "1.5px", width: "40px", background: "linear-gradient(90deg, transparent, #f81a2e)" }}></div>
            <span style={{ color: "#f81a2e", fontSize: "10px" }}>✦</span>
            <div style={{ height: "1.5px", width: "40px", background: "linear-gradient(270deg, transparent, #f81a2e)" }}></div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "0 1.5rem 1.5rem", color: "#333333", fontSize: "13px", lineHeight: "1.6" }}>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", textAlign: "center" }}>
            A secure and rewarding gaming experience starts here.<br />
            Please make sure you are accessing the official <span style={{ color: "#f81a2e", fontWeight: "700" }}>TROVA</span> website only. Beware of fake platforms, imitation websites, and unauthorized agents claiming to represent <span style={{ color: "#f81a2e", fontWeight: "700" }}>TROVA</span>.
          </p>

          {/* Safety Section */}
          <div style={{ border: "1px solid #fed7aa", borderRadius: "14px", padding: "16px", background: "#fff7ed", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f81a2e", fontWeight: "700", fontSize: "12px", marginBottom: "12px" }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>FOR YOUR SAFETY:</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#333333" }}>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Always verify our official website link
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#333333" }}>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Never share your login details or OTP with anyone
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#333333" }}>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Contact official support for any assistance
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#333333" }}>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> Play responsibly and stay secure
              </li>
            </ul>
          </div>

          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ color: "#f81a2e", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>Thank you for choosing TROVA.</p>
            <p style={{ color: "#64748b", fontSize: "12px" }}>We wish you a safe and enjoyable experience!</p>
          </div>

          {/* Official Link Button */}
          <a 
            href="https://www.trova.site" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="link-btn-glow"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px", 
              background: "#f8fafc", 
              border: "1px solid #e2e8f0", 
              borderRadius: "10px", 
              padding: "10px", 
              color: "#333333", 
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "12px",
              marginBottom: "1.5rem",
              transition: "border-color 0.2s"
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Official URL: <span style={{ color: "#f81a2e", marginLeft: "4px" }}>&gt; CLICK HERE &lt;</span></span>
          </a>

          {/* Confirm Button */}
          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              width: "100%", 
              background: "#f81a2e", 
              color: "#ffffff", 
              border: "none", 
              padding: "12px", 
              borderRadius: "12px", 
              fontSize: "14px", 
              fontWeight: "800", 
              letterSpacing: "1px",
              cursor: "pointer", 
              boxShadow: "0 4px 12px rgba(248, 26, 46, 0.25)"
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>

      <style jsx global>{`
        .welcome-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 1rem;
          box-sizing: border-box;
          animation: fade-in 0.2s ease-out forwards;
        }
        .welcome-modal-card {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border: 1px solid #cbd5e1;
          animation: scale-up 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .link-btn-glow:hover {
          border-color: #f81a2e !important;
        }
      `}</style>
    </div>
  );
}
