import React, { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// Waffy Design System — Phone Input Component
// Pixel-perfect match to Figma design
// Country selector + formatted phone number
// ─────────────────────────────────────────────

const tokens = {
  colors: {
    primary700: "#0051ff",
    primary500: "#84b8ff",
    primary400: "#d3e5ff",
    primary300: "#ebf4ff",
    neutral100: "#fbfbfb",
    neutral200: "#f8f9fb",
    neutral300: "#eef0f5",
    neutral400: "#c7cbd7",
    neutral500: "#8e94a3",
    neutral600: "#555b6a",
    neutral700: "#2c333c",
    neutral800: "#181b23",
    white: "#ffffff",
  },
  radii: { md: "10px", lg: "16px" },
  font: "'Rubik', sans-serif",
};

// Country data with flags and dial codes
const countries = [
  { code: "SA", dialCode: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "EG", dialCode: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳", name: "India" },
  { code: "PK", dialCode: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "TR", dialCode: "+90", flag: "🇹🇷", name: "Turkey" },
];

// Chevron down icon
const ChevronDown = ({ color = tokens.colors.neutral400 }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Format phone number (567 XXX XXX)
const formatPhoneNumber = (value, countryCode) => {
  const digits = value.replace(/\D/g, "");
  
  if (countryCode === "SA") {
    // Saudi format: 567 XXX XXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  
  // Default format
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export default function PhoneInput({
  value = "",
  onChange,
  disabled = false,
  placeholder = "567 XXX XXX",
  defaultCountry = "SA",
  dir = "ltr",
}) {
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.code === defaultCountry) || countries[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input, selectedCountry.code);
    setPhoneNumber(formatted);
    onChange?.(selectedCountry.dialCode + formatted.replace(/\s/g, ""));
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const borderColor = isFocused ? tokens.colors.primary500 : tokens.colors.neutral300;
  const hasValue = phoneNumber.length > 0;

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative" }} dir={dir}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {/* Country Selector Box - Separate */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: tokens.colors.neutral100,
            borderRadius: tokens.radii.lg,
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            flexShrink: 0,
            height: "64px",
          }}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.backgroundColor = tokens.colors.neutral200)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = tokens.colors.neutral100)}
        >
          {/* Flag */}
          <div
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            {selectedCountry.flag}
          </div>
          
          {/* Chevron */}
          <ChevronDown color={tokens.colors.neutral500} />
        </button>

        {/* Phone Number Input Box - Separate */}
        <div
          onClick={() => inputRef.current?.focus()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
            height: "64px",
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.radii.lg,
            border: `2px solid ${borderColor}`,
            padding: "0 20px",
            transition: "border-color 0.2s, box-shadow 0.15s",
            boxShadow: isFocused ? `0 0 0 3px ${tokens.colors.primary300}` : "none",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        >
          {/* Dial Code */}
          <div
            style={{
              fontFamily: tokens.font,
              fontSize: "24px",
              fontWeight: 600,
              color: tokens.colors.neutral700,
              flexShrink: 0,
            }}
          >
            {selectedCountry.dialCode}
          </div>

          {/* Phone Number Input */}
          <input
            ref={inputRef}
            type="tel"
            value={phoneNumber}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: tokens.font,
              fontSize: "24px",
              fontWeight: 500,
              color: hasValue ? tokens.colors.neutral700 : tokens.colors.neutral400,
              caretColor: tokens.colors.primary700,
              padding: 0,
            }}
          />
        </div>
      </div>

      {/* Country Dropdown */}
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "72px",
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: tokens.colors.white,
            border: `1.5px solid ${tokens.colors.neutral300}`,
            borderRadius: tokens.radii.md,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxHeight: "320px",
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          {countries.map((country) => {
            const isSelected = country.code === selectedCountry.code;
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  border: "none",
                  backgroundColor: isSelected ? tokens.colors.primary300 : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                  fontFamily: tokens.font,
                }}
                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = tokens.colors.neutral100)}
                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span style={{ fontSize: "28px", flexShrink: 0 }}>{country.flag}</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: tokens.colors.neutral800 }}>
                    {country.name}
                  </div>
                  <div style={{ fontSize: "12px", color: tokens.colors.neutral500 }}>
                    {country.dialCode}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
