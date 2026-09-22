import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: "#059669",
    warning: "#d97706",
    info: "#0284c7",
    danger: "#dc2626",
  };

  const icons = {
    success: "✅",
    warning: "⚠️",
    info: "ℹ️",
    danger: "🚨",
  };

  const bgColor = bgColors[toast.type] || bgColors.info;
  const icon = icons[toast.type] || "🔔";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        backgroundColor: bgColor,
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9999,
        fontWeight: "500",
        fontSize: "14px",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <span>{icon}</span>
      <span>{toast.msg}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.8)",
          cursor: "pointer",
          marginLeft: "8px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        ✕
      </button>
    </div>
  );
}
