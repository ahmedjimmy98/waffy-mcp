import React, { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// Waffy Design System — InputField Component
// Pixel-perfect match to Figma designs
// RTL layout, floating labels, all variants
// ─────────────────────────────────────────────

const tokens = {
  colors: {
    primary700: "#0051ff",
    primary500: "#84b8ff",
    primary600: "#639ffb",
    primary400: "#d3e5ff",
    primary300: "#ebf4ff",
    primary200: "#f3f6fc",
    primary100: "#f9fbfd",
    neutral100: "#fbfbfb",
    neutral200: "#f8f9fb",
    neutral300: "#eef0f5",
    neutral400: "#c7cbd7",
    neutral500: "#8e94a3",
    neutral600: "#555b6a",
    neutral700: "#2c333c",
    neutral800: "#181b23",
    neutral900: "#10131d",
    white: "#ffffff",
    black: "#000000",
    accentRed300: "#fff5f5",
    accentRed600: "#fcdfe1",
    accentRed900: "#e32a34",
  },
  radii: { sm: "6px", md: "10px" },
  font: "'Rubik', sans-serif",
};

// ── Inline SVG Icons ──
const ChevronDown = ({ size = 20, color = tokens.colors.neutral400 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CurrencyIcon = () => (
  <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.966 7.77593L8.424 7.45193V2.41193L8.46 2.37593C8.952 1.79993 9.522 1.31993 10.17 0.935927L10.332 0.845927V7.09193L14.4 6.22793L14.526 6.17393V6.31793C14.454 7.00193 14.292 7.61993 14.04 8.17193L14.022 8.22593H13.95L10.332 9.01793V10.5119L14.4 9.64793L14.526 9.62993V9.75593C14.454 10.3919 14.292 11.0159 14.04 11.6279L14.022 11.6819L13.95 11.6999L8.568 12.8159L8.424 12.8699V9.41393L6.966 9.71993V11.5559C6.966 11.7479 6.9 11.9279 6.768 12.0959L5.922 13.3919C5.706 13.7039 5.424 13.9139 5.076 14.0219L4.914 14.0579L0.144 15.0659L0 15.1019L0.018 14.9579C0.09 14.3219 0.252 13.6979 0.504 13.0859L0.54 13.0499H0.576L5.058 12.0959V10.1339L0.936 11.0159L0.792 11.0519L0.81 10.9079C0.846 10.5719 0.9 10.2539 0.972 9.95393L1.116 9.48593C1.152 9.41393 1.182 9.34193 1.206 9.26993C1.242 9.19793 1.272 9.13193 1.296 9.07193L1.332 9.01793L1.368 8.99993L5.058 8.20793V1.56593L5.076 1.54793L5.256 1.31393C5.484 1.07393 5.724 0.851927 5.976 0.647927C6.228 0.431927 6.51 0.251927 6.822 0.107927L6.966 -7.34329e-05V7.77593ZM14.526 13.2119C14.454 13.8479 14.292 14.4659 14.04 15.0659L14.022 15.1199H13.95L8.568 16.2899L8.424 16.3079V16.1639C8.448 15.9959 8.472 15.8339 8.496 15.6779C8.532 15.5219 8.562 15.3659 8.586 15.2099L8.748 14.7419C8.784 14.6819 8.814 14.6099 8.838 14.5259C8.874 14.4419 8.91 14.3699 8.946 14.3099L8.964 14.2559H9.018L14.4 13.0859L14.526 13.0679V13.2119Z" fill="#2C333C"/>
  </svg>
);

// ──────────────────────────────────────
//  TEXT INPUT (Hover / HelpText / Currency)
//  Floating label inside the input box
// ──────────────────────────────────────
function TextInput({
  label = "العنوان هنا",
  helpText,
  errorText,
  currency = false,
  disabled = false,
  value: controlledValue,
  onChange,
  dir = "rtl",
  ...rest
}) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const hasError = !!errorText;
  const isFilled = value.length > 0;
  const isFloating = focused || isFilled;

  const state = hasError ? "error" : focused ? "active" : isFilled ? "filled" : "default";

  const borderColor = {
    default: tokens.colors.neutral300,
    active: tokens.colors.primary500,
    filled: tokens.colors.neutral300,
    error: tokens.colors.accentRed900,
  }[state];

  const handleChange = (e) => {
    const v = currency ? e.target.value.replace(/[^0-9.,٠-٩]/g, "") : e.target.value;
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }} dir={dir}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: "48px",
          borderRadius: tokens.radii.md,
          border: `1.5px solid ${borderColor}`,
          backgroundColor: tokens.colors.white,
          transition: "border-color 0.2s, box-shadow 0.15s",
          boxShadow: state === "active" ? `0 0 0 2px ${tokens.colors.primary300}` : "none",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "text",
          paddingInline: "14px",
        }}
      >
        {currency && (
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0, order: 1, marginInlineStart: "8px", paddingInlineStart: "12px", borderInlineStart: `1px solid ${tokens.colors.neutral300}` }}>
            <CurrencyIcon />
          </div>
        )}

        <div style={{ position: "relative", flex: 1, height: "100%", display: "flex", alignItems: "center" }}>
          <label
            style={{
              position: "absolute",
              top: isFloating ? "6px" : "50%",
              right: 0,
              transform: isFloating ? "none" : "translateY(-50%)",
              fontFamily: tokens.font,
              fontSize: isFloating ? "10px" : "14px",
              fontWeight: 400,
              color: state === "active" ? tokens.colors.primary700 : tokens.colors.neutral500,
              transition: "all 0.15s ease",
              pointerEvents: "none",
              lineHeight: "1",
            }}
          >
            {label}
          </label>

          <input
            {...rest}
            ref={inputRef}
            type="text"
            inputMode={currency ? "decimal" : "text"}
            disabled={disabled}
            value={value}
            dir={dir}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleChange}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: tokens.font,
              fontSize: "14px",
              fontWeight: 500,
              color: tokens.colors.neutral800,
              caretColor: tokens.colors.primary700,
              paddingTop: isFloating ? "14px" : "0",
              textAlign: dir === "rtl" ? "right" : "left",
              direction: dir,
            }}
          />
        </div>
      </div>

      {helpText && !hasError && <span style={{ fontFamily: tokens.font, fontSize: "10px", color: tokens.colors.neutral500, textAlign: "right", paddingTop: "6px", paddingRight: "16px" }}>{helpText}</span>}
      {hasError && <span style={{ fontFamily: tokens.font, fontSize: "10px", color: tokens.colors.accentRed900, textAlign: "right", paddingTop: "6px", paddingRight: "16px" }}>{errorText}</span>}
    </div>
  );
}

// ──────────────────────────────────────
//  PARAGRAPH INPUT
// ──────────────────────────────────────
function ParagraphInput({
  placeholder = "وصف المعاملة ..",
  maxLength = 500,
  disabled = false,
  value: controlledValue,
  onChange,
  rows = 4,
  dir = "rtl",
  ...rest
}) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isFilled = value.length > 0;

  const state = focused ? "active" : isFilled ? "filled" : "empty";

  const borderColor = {
    empty: tokens.colors.neutral300,
    active: tokens.colors.primary500,
    filled: tokens.colors.neutral300,
  }[state];

  const handleChange = (e) => {
    const v = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }} dir={dir}>
      <div
        onClick={() => textareaRef.current?.focus()}
        style={{
          borderRadius: tokens.radii.md,
          border: `1.5px solid ${borderColor}`,
          backgroundColor: tokens.colors.white,
          transition: "border-color 0.2s, box-shadow 0.15s",
          boxShadow: state === "active" ? `0 0 0 2px ${tokens.colors.primary300}` : "none",
          padding: "12px 14px",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <textarea
          {...rest}
          ref={textareaRef}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          rows={rows}
          dir={dir}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: tokens.font,
            fontSize: "14px",
            fontWeight: 400,
            color: tokens.colors.neutral800,
            resize: "none",
            minHeight: "80px",
            caretColor: tokens.colors.primary700,
            textAlign: dir === "rtl" ? "right" : "left",
            direction: dir,
          }}
        />
      </div>

      {maxLength != null && (
        <span style={{ fontFamily: tokens.font, fontSize: "10px", color: tokens.colors.neutral500, textAlign: "right" }}>
          {maxLength} / {value.length}
        </span>
      )}
    </div>
  );
}

// ──────────────────────────────────────
//  DROPDOWN
// ──────────────────────────────────────
function DropdownInput({
  label = "العنوان هنا",
  options = [],
  searchable = false,
  withLeftIcon = false,
  withRightIcon = false,
  iconRenderer = null,
  helpText,
  errorText,
  disabled = false,
  value: controlledValue,
  onChange,
  dir = "rtl",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : internalValue;

  const normalizedOptions = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );

  const filteredOptions = searchable && searchQuery
    ? normalizedOptions.filter((o) =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  const selectedOption = normalizedOptions.find((o) => o.value === selected);
  const hasError = !!errorText;
  const isFilled = !!selectedOption;
  const isFloating = isOpen || isFilled;

  const state = hasError ? "error" : isOpen ? "active" : isFilled ? "filled" : "empty";

  const borderColor = {
    empty: tokens.colors.neutral300,
    active: tokens.colors.primary500,
    filled: tokens.colors.neutral300,
    error: tokens.colors.accentRed900,
  }[state];

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (val) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const DefaultIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="2" width="12" height="14" rx="2" stroke={tokens.colors.neutral400} strokeWidth="1.2" />
      <path d="M6 6h6M6 9h6M6 12h3" stroke={tokens.colors.neutral400} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", flexDirection: "column", width: "100%", position: "relative" }}
      dir={dir}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setIsOpen((v) => !v); setHoveredIndex(-1); }}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: "48px",
          borderRadius: isOpen ? `${tokens.radii.md} ${tokens.radii.md} 0 0` : tokens.radii.md,
          border: `1.5px solid ${borderColor}`,
          borderBottom: isOpen ? `1px solid ${tokens.colors.neutral300}` : `1.5px solid ${borderColor}`,
          backgroundColor: tokens.colors.white,
          transition: "border-color 0.2s, box-shadow 0.15s",
          boxShadow: isOpen ? `0 0 0 2px ${tokens.colors.primary300}` : "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: tokens.font,
          textAlign: dir === "rtl" ? "right" : "left",
          width: "100%",
          paddingInline: "14px",
        }}
      >
        <div style={{ flex: 1, position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
          <span
            style={{
              position: "absolute",
              top: isFloating ? "6px" : "50%",
              right: 0,
              transform: isFloating ? "none" : "translateY(-50%)",
              fontFamily: tokens.font,
              fontSize: isFloating ? "10px" : "14px",
              fontWeight: 400,
              color: isOpen ? tokens.colors.primary700 : tokens.colors.neutral500,
              transition: "all 0.15s ease",
              pointerEvents: "none",
              lineHeight: "1",
            }}
          >
            {label}
          </span>

          {searchable && isOpen ? (
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { e.stopPropagation(); setSearchQuery(e.target.value); }}
              onClick={(e) => e.stopPropagation()}
              dir={dir}
              style={{
                width: "100%", border: "none", outline: "none", background: "transparent",
                fontFamily: tokens.font, fontSize: "14px", fontWeight: 500,
                color: tokens.colors.neutral800, caretColor: tokens.colors.primary700,
                paddingTop: "14px", textAlign: dir === "rtl" ? "right" : "left",
              }}
            />
          ) : (
            <span style={{
              fontFamily: tokens.font, fontSize: "14px", fontWeight: isFilled ? 500 : 400,
              color: isFilled ? tokens.colors.neutral800 : "transparent",
              paddingTop: isFloating ? "14px" : "0", width: "100%",
              textAlign: dir === "rtl" ? "right" : "left",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {selectedOption?.label || "\u200e"}
            </span>
          )}
        </div>
        <span style={{ display: "flex", alignItems: "center", marginInlineStart: "8px", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
          <ChevronDown color={isOpen ? tokens.colors.primary700 : tokens.colors.neutral400} />
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "48px", left: 0, right: 0, zIndex: 50,
          backgroundColor: tokens.colors.white, border: `1.5px solid ${tokens.colors.neutral300}`, borderTop: "none",
          borderRadius: `0 0 ${tokens.radii.md} ${tokens.radii.md}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)", maxHeight: "280px", overflowY: "auto",
        }}>
          {filteredOptions.map((opt, i) => {
            const isSelected = opt.value === selected;
            const isHovered = hoveredIndex === i;
            return (
              <div key={opt.value} role="option" aria-selected={isSelected}
                onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(-1)}
                onClick={() => handleSelect(opt.value)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px",
                  fontFamily: tokens.font, fontSize: "14px", fontWeight: 400, color: tokens.colors.neutral700,
                  backgroundColor: isSelected ? tokens.colors.primary300 : isHovered ? tokens.colors.primary200 : "transparent",
                  cursor: "pointer", transition: "background-color 0.1s",
                  borderBottom: i < filteredOptions.length - 1 ? `1px solid ${tokens.colors.neutral200}` : "none",
                  direction: dir,
                }}
              >
                {withLeftIcon && <span style={{ display: "flex", flexShrink: 0 }}>{iconRenderer ? iconRenderer(opt, i) : <DefaultIcon />}</span>}
                <span style={{ flex: 1, textAlign: dir === "rtl" ? "right" : "left" }}>{opt.label}</span>
                {withRightIcon && <span style={{ display: "flex", flexShrink: 0 }}>{iconRenderer ? iconRenderer(opt, i) : <DefaultIcon />}</span>}
              </div>
            );
          })}
        </div>
      )}

      {helpText && !hasError && <span style={{ fontFamily: tokens.font, fontSize: "10px", color: tokens.colors.neutral500, textAlign: "right", paddingTop: "6px", paddingRight: "16px" }}>{helpText}</span>}
      {hasError && <span style={{ fontFamily: tokens.font, fontSize: "10px", color: tokens.colors.accentRed900, textAlign: "right", paddingTop: "6px", paddingRight: "16px" }}>{errorText}</span>}
    </div>
  );
}

// ──────────────────────────────────────
//  MAIN EXPORTED COMPONENT
// ──────────────────────────────────────
export default function InputField({ type = "text", ...props }) {
  switch (type) {
    case "paragraph":
      return <ParagraphInput {...props} />;
    case "dropdown":
      return <DropdownInput {...props} />;
    case "text":
    default:
      return <TextInput {...props} />;
  }
}

InputField.Text = TextInput;
InputField.Paragraph = ParagraphInput;
InputField.Dropdown = DropdownInput;