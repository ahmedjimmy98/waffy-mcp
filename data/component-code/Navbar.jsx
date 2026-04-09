import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";

// ─────────────────────────────────────────────────────────────────────────────
// Waffy Design System — Navbar
// Desktop (dark auth / light guest) + Mobile bottom footer nav.
// Bilingual EN/AR with RTL support. All SVG icons must be in an <svg> sprite
// sheet (see Navbar.preview.html for the full sprite definitions).
// ─────────────────────────────────────────────────────────────────────────────
//
// Required CSS (add once, or import from your stylesheet):
//
// .navbar{width:100%;background:#283743;position:relative;z-index:1000;}
// .navbar--light{background:transparent;box-shadow:none;}
// .navContainer{padding:0 5%;margin:0 auto;}
// .toolBar{display:flex;justify-content:space-between;align-items:center;height:4.25rem;max-width:1280px;margin:0 auto;}
// .rightSideContainer{display:flex;align-items:center;gap:1.5rem;}
// .leftSideContainer{display:flex;align-items:center;gap:1rem;}
// .flexContainer{display:flex;align-items:center;gap:8px;}
// .logo-wrap{width:3.75rem;height:2.25rem;display:flex;align-items:center;}
// .logo-svg{width:100%;height:100%;}
// .navButton{display:flex;align-items:center;background:none;border:none;cursor:pointer;padding:4px 6px;}
// .navButton .content{display:flex;flex-direction:column;align-items:center;gap:4px;}
// .navButton .labelContainer{display:flex;align-items:center;gap:8px;}
// .navButton .label{font-family:'Rubik';font-size:14px;font-weight:400;color:rgba(255,255,255,.6);white-space:nowrap;}
// .navButton[data-selected="true"] .label{color:#fff;font-weight:600;}
// .navButton .indicator{height:2px;width:100%;background:transparent;border-radius:2px;transition:background .2s;}
// .navButton[data-selected="true"] .indicator{background:#fff;}
// .nav-icon{width:18px;height:18px;fill:none;}
// .create-contract-btn{display:flex;align-items:center;padding:0 18px;height:40px;background:#0051ff;border:none;border-radius:100px;cursor:pointer;}
// .create-contract-btn p{margin:0;font-family:'Rubik';font-weight:600;font-size:14px;color:#fff;white-space:nowrap;}
// .create-contract-btn:hover{background:#1b4de9;}
// .notification-box{position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:#1c2b37;cursor:pointer;}
// .notification-box svg{width:22px;height:22px;}
// .notification-box.active{background:#2c3f4e;}
// .unseen-dot{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#639ffb;border:2px solid #283743;}
// .profile-box{display:flex;align-items:center;gap:10px;cursor:pointer;}
// .avatar-container{width:40px;height:40px;border-radius:50%;overflow:hidden;flex-shrink:0;}
// .avatar-img{width:100%;height:100%;object-fit:cover;}
// .profile-details{display:flex;flex-direction:column;}
// .profile-name{margin:0;font-family:'Rubik';font-size:14px;font-weight:600;color:#fff;line-height:1.3;}
// .profile-number{margin:0;font-family:'Rubik';font-size:12px;font-weight:400;color:#8e94a3;line-height:1.3;}
// .lang-pill{display:flex;align-items:center;gap:6px;padding:8px 12px;height:40px;border:1px solid #ebf4ff;border-radius:100px;background:#f3f6fc;font-family:'Rubik';font-weight:400;font-size:14px;color:#050915;cursor:pointer;white-space:nowrap;}
// .lang-pill:hover{background:#e8eef8;}
// .contact-btn{display:flex;align-items:center;padding:0 16px;gap:8px;height:40px;background:#eef0f5;border-radius:100px;text-decoration:none;cursor:pointer;border:none;}
// .contact-btn:hover{background:#e3e5eb;}
// .contact-btn p{margin:0;font-family:'Rubik';font-weight:600;font-size:14px;color:#10131d;white-space:nowrap;}
// .notif-panel{position:absolute;top:72px;right:5%;width:360px;background:#fff;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,.14);z-index:2000;overflow:hidden;}
// .notif-panel-header{padding:16px 20px;border-bottom:1px solid #f0f2f5;font-weight:600;font-size:15px;color:#10131D;display:flex;justify-content:space-between;align-items:center;}
// .notif-panel-header .mark-read{font-size:12px;color:#0051ff;cursor:pointer;font-weight:400;}
// .notif-item{display:flex;gap:12px;padding:14px 20px;border-bottom:1px solid #f8f9fb;cursor:pointer;}
// .notif-item.unread{background:#f3f7fd;}
// .notif-dot{width:8px;height:8px;border-radius:50%;background:#639ffb;flex-shrink:0;margin-top:6px;}
// .notif-dot.read{background:transparent;}
// .notif-text{font-size:13px;line-height:1.5;color:#10131D;}
// .notif-time{font-size:11px;color:#8E94A3;margin-top:3px;}
// .footerMenu{display:flex;width:100%;align-items:center;background:#fff;box-shadow:0 -1px 10px rgba(0,0,0,.05);height:88px;position:relative;z-index:100;}
// .footerItems{display:flex;flex:1;justify-content:center;align-items:center;position:relative;cursor:pointer;height:100%;}
// .footerItem{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;}
// .footerItem svg{width:20px;height:20px;}
// .footerItem p{font-family:'Rubik';font-size:.875rem;line-height:normal;margin:0;font-weight:400;}
// .footerItem p.active{color:#0D44AD;}
// .footerItem p.inactive{color:#9FA6AB;}
// .item-selected::before{position:absolute;content:" ";top:-1.1rem;width:60%;height:2px;background:#078de7;}
// .footer-plus{display:flex;align-items:center;justify-content:center;width:44px;height:44px;background:#078DE7;border-radius:50%;box-shadow:0 4px 12px rgba(7,141,231,.4);}
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_LABELS = {
  en: {
    contracts: "Transactions", wallet: "Balance", create: "Start new transaction",
    contact: "Contact us", langSwitch: "العربية", notifications: "Notifications",
    markRead: "Mark all read", home: "Home", footerContracts: "Transactions",
    footerWallet: "Wallet", footerProfile: "Account",
  },
  ar: {
    contracts: "المعاملات", wallet: "الرصيد", create: "بدء معاملة جديدة",
    contact: "تواصل معنا", langSwitch: "English", notifications: "الإشعارات",
    markRead: "تحديد الكل كمقروء", home: "الرئيسية", footerContracts: "المعاملات",
    footerWallet: "الرصيد", footerProfile: "الحساب",
  },
};

const FOOTER_ICON_MAP = {
  0: { normal: "#icon-home",      active: "#icon-home-active"      },
  1: { normal: "#icon-contracts", active: "#icon-contracts-active" },
  3: { normal: "#icon-balance",   active: "#icon-balance-active"   },
  4: { normal: "#icon-profile",   active: "#icon-profile-active"   },
};

function formatPhone(p = "") {
  const s = p.replace(/^\+966/, "0");
  return s.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
}

const PLACEHOLDER_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%232C333C'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%238E94A3'/%3E%3Cellipse cx='20' cy='34' rx='12' ry='9' fill='%238E94A3'/%3E%3C/svg%3E`;

// ── Desktop Navbar ─────────────────────────────────────────────────────────
export function DesktopNavbar({
  isAuthenticated = true,
  lang = "en",
  userName = "",
  userPhone = "",
  userAvatarUrl = "",
  notifications = [],
  hasNotifications = true,
  activeNav = 0,
  labels = {},
  onCreateContract,
  onNavSelect,
  onLangToggle,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const [currentNav, setCurrentNav] = useState(activeNav);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const L = { ...DEFAULT_LABELS[lang], ...labels };
  const unreadCount = notifList.filter(n => n.unread).length;
  const displayName = userName.split(" ").slice(0, 2).join(" ");

  useEffect(() => {
    const handleClick = (e) => {
      if (!notifOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  const handleNavSelect = (i) => {
    setCurrentNav(i);
    onNavSelect?.(i);
  };

  const markAllRead = () => {
    setNotifList(notifList.map(n => ({ ...n, unread: false })));
  };

  return (
    <nav className={`navbar ${isAuthenticated ? "navbar--dark" : "navbar--light"}`}>
      <div className="navContainer">
        <div className="toolBar">
          {/* RIGHT: Logo + Nav */}
          <div className="rightSideContainer">
            <div className="logo-wrap">
              <Logo
                lang={lang}
                variant={isAuthenticated ? "white" : "primary"}
                width={lang === "ar" ? 60 : 120}
              />
            </div>
            {isAuthenticated && (
              <div className="flexContainer">
                {["contracts", "wallet"].map((key, i) => (
                  <button
                    key={key}
                    className="navButton"
                    data-selected={currentNav === i ? "true" : "false"}
                    onClick={() => handleNavSelect(i)}
                  >
                    <div className="content">
                      <div className="labelContainer">
                        <svg className="nav-icon">
                          <use href={i === 0 ? "#icon-contracts-nav" : "#icon-wallet-nav"} />
                        </svg>
                        <span className="label">{L[key]}</span>
                      </div>
                      <div className="indicator" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LEFT */}
          <div className="leftSideContainer">
            {isAuthenticated ? (
              <>
                <button className="create-contract-btn" onClick={onCreateContract}>
                  <p>{L.create}</p>
                </button>

                <div
                  ref={btnRef}
                  className={`notification-box${notifOpen ? " active" : ""}`}
                  onClick={() => setNotifOpen(v => !v)}
                >
                  <svg><use href="#icon-notification" /></svg>
                  {hasNotifications && unreadCount > 0 && (
                    <div className="unseen-dot" />
                  )}
                </div>

                {notifOpen && (
                  <div ref={panelRef} className="notif-panel">
                    <div className="notif-panel-header">
                      <span>{L.notifications}</span>
                      <span className="mark-read" onClick={markAllRead}>{L.markRead}</span>
                    </div>
                    <div>
                      {notifList.map((n, i) => (
                        <div key={i} className={`notif-item${n.unread ? " unread" : ""}`}>
                          <div className={`notif-dot${n.unread ? "" : " read"}`} />
                          <div>
                            <div className="notif-text">{n.text}</div>
                            <div className="notif-time">{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="profile-box">
                  <div className="avatar-container">
                    <img className="avatar-img" src={userAvatarUrl || PLACEHOLDER_AVATAR} alt="profile" />
                  </div>
                  <div className="profile-details">
                    <div className="profile-details-wrapper">
                      <p className="profile-name">{displayName}</p>
                      <p className="profile-number">{formatPhone(userPhone)}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button className="lang-pill" onClick={onLangToggle}>
                  <span>{L.langSwitch}</span>
                  <svg style={{ width: 24, height: 24 }}><use href="#icon-language" /></svg>
                </button>
                <a className="contact-btn" href="#" target="_blank" rel="noreferrer">
                  <div className="whatsapp-link" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg style={{ width: 20, height: 20 }}><use href="#icon-whatsapp" /></svg>
                    <p>{L.contact}</p>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Mobile Footer Nav ──────────────────────────────────────────────────────
export function MobileFooterNav({
  lang = "en",
  activeFooter = 1,
  labels = {},
  onFooterSelect,
  onCreateContract,
}) {
  const [active, setActive] = useState(activeFooter);
  const L = { ...DEFAULT_LABELS[lang], ...labels };

  const tabs = [
    { id: 0, labelKey: "home" },
    { id: 1, labelKey: "footerContracts" },
    { id: null }, // plus button
    { id: 3, labelKey: "footerWallet" },
    { id: 4, labelKey: "footerProfile" },
  ];

  const handleSelect = (id) => {
    if (id === null) { onCreateContract?.(); return; }
    setActive(id);
    onFooterSelect?.(id);
  };

  return (
    <div className="footerMenu">
      {tabs.map((tab, i) => (
        <div key={i} className="footerItems" onClick={() => handleSelect(tab.id)}>
          {tab.id === null ? (
            <div className="footerItem">
              <div className="footer-plus">
                <svg viewBox="0 0 22 22" fill="none" style={{ width: 22, height: 22 }}>
                  <path d="M11 4v14M4 11h14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ) : (
            <div className={`footerItem${active === tab.id ? " item-selected" : " item-not-selected"}`}>
              <svg style={{ width: 20, height: 20 }}>
                <use href={active === tab.id ? FOOTER_ICON_MAP[tab.id].active : FOOTER_ICON_MAP[tab.id].normal} />
              </svg>
              <p className={active === tab.id ? "active" : "inactive"}>{L[tab.labelKey]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Default export ─────────────────────────────────────────────────────────
/**
 * Navbar — top-level composition
 *
 * @param {"desktop"|"mobile"} variant  - Layout variant
 * @param {boolean} isAuthenticated     - Auth vs guest mode
 * @param {"en"|"ar"} lang              - Language (controls labels + logo + RTL)
 * @param {string}  userName            - Profile display name
 * @param {string}  userPhone           - Profile phone number (+966 or 05xx)
 * @param {string}  userAvatarUrl       - Avatar image URL (optional)
 * @param {Array}   notifications       - [{ text, time, unread }]
 * @param {boolean} hasNotifications    - Show unseen dot
 * @param {number}  activeNav           - Active desktop nav index (0 or 1)
 * @param {number}  activeFooter        - Active mobile footer tab (0,1,3,4)
 * @param {object}  labels              - Override any label string
 * @param {function} onCreateContract   - CTA click handler
 * @param {function} onNavSelect        - Desktop nav select callback
 * @param {function} onFooterSelect     - Mobile footer select callback
 * @param {function} onLangToggle       - Language toggle callback
 */
export default function Navbar({ variant = "desktop", ...props }) {
  if (variant === "mobile") return <MobileFooterNav {...props} />;
  return <DesktopNavbar {...props} />;
}

// ── Usage examples ─────────────────────────────────────────────────────────
//
// Desktop authenticated (EN):
//   <DesktopNavbar
//     isAuthenticated
//     lang="en"
//     userName="Ahmed Al-Rashidi"
//     userPhone="+966501234567"
//     notifications={[{ text: "Transaction confirmed.", time: "2 min ago", unread: true }]}
//     hasNotifications
//     activeNav={0}
//     onCreateContract={() => console.log('create')}
//   />
//
// Desktop guest (AR, RTL — wrap in <div dir="rtl">):
//   <div dir="rtl">
//     <DesktopNavbar isAuthenticated={false} lang="ar" onLangToggle={() => {}} />
//   </div>
//
// Mobile footer (authenticated):
//   <MobileFooterNav lang="en" activeFooter={1} onFooterSelect={i => console.log(i)} />
