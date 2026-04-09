import React, { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Waffy Design System — InputField Components
// Source: InputFieldDemo_5 — pixel-perfect Figma match
// RTL layout, floating labels, all states & variants
//
// Required CSS (add once in your app or import InputField.css):
//
// .input-wrap{display:flex;flex-direction:column;gap:4px;width:100%;direction:rtl;}
// .input-box{position:relative;display:flex;align-items:center;height:48px;border-radius:10px;border:1.5px solid #eef0f5;background:#fff;padding:0 14px;cursor:text;transition:border-color .15s,box-shadow .15s;}
// .input-box:hover{border-color:#c7cbd7;}
// .input-box.active{border-color:#84b8ff;box-shadow:0 0 0 2px #ebf4ff;}
// .input-box.error{border-color:#e32a34;}
// .input-box .fl{position:absolute;top:50%;right:0;transform:translateY(-50%);font-size:14px;font-weight:400;color:#8e94a3;transition:all .15s ease;pointer-events:none;line-height:1;}
// .input-box.float .fl{top:7px;transform:none;font-size:10px;}
// .input-box.active .fl{color:#0051ff;}
// .input-box input{width:100%;border:none;outline:none;background:transparent;font-family:'Rubik',sans-serif;font-size:14px;font-weight:500;color:#181b23;caret-color:#0051ff;text-align:right;direction:rtl;}
// .input-box.float input{padding-top:14px;}
// .help-text{font-size:10px;color:#8e94a3;text-align:right;padding-top:6px;padding-right:16px;}
// .error-text{font-size:10px;color:#e32a34;text-align:right;padding-top:6px;padding-right:16px;}
// .curr{display:flex;align-items:center;user-select:none;flex-shrink:0;order:1;margin-inline-start:8px;padding-inline-start:12px;border-inline-start:1px solid #eef0f5;}
// .para-box{border-radius:10px;border:1.5px solid #eef0f5;background:#fff;padding:12px 14px;transition:border-color .15s,box-shadow .15s;}
// .para-box:hover{border-color:#c7cbd7;}
// .para-box.active{border-color:#84b8ff;box-shadow:0 0 0 2px #ebf4ff;}
// .para-box textarea{width:100%;border:none;outline:none;background:transparent;font-family:'Rubik',sans-serif;font-size:14px;color:#181b23;resize:none;min-height:80px;caret-color:#0051ff;text-align:right;direction:rtl;}
// .char-count{font-size:10px;color:#8e94a3;text-align:right;}
// .dd-wrap{position:relative;display:flex;flex-direction:column;gap:4px;width:100%;direction:rtl;}
// .dd-btn{position:relative;display:flex;align-items:center;height:48px;border-radius:10px;border:1.5px solid #eef0f5;background:#fff;padding:0 14px;cursor:pointer;width:100%;font-family:'Rubik',sans-serif;text-align:right;transition:all .15s;}
// .dd-btn:hover{border-color:#c7cbd7;}
// .dd-btn.open{border-radius:10px 10px 0 0;border-color:#84b8ff;border-bottom:1px solid #eef0f5;box-shadow:0 0 0 2px #ebf4ff;}
// .dd-btn.sel{border-color:#eef0f5;}
// .dd-btn.error{border-color:#e32a34;}
// .dd-btn .fl{position:absolute;top:50%;right:0;transform:translateY(-50%);font-size:14px;font-weight:400;color:#8e94a3;transition:all .15s ease;pointer-events:none;line-height:1;}
// .dd-btn.float .fl{top:7px;transform:none;font-size:10px;color:#8e94a3;}
// .dd-btn.open .fl{color:#0051ff;}
// .chev{display:flex;align-items:center;margin-inline-start:8px;flex-shrink:0;transition:transform .2s;}
// .chev.open{transform:rotate(180deg);}
// .dd-val{flex:1;font-size:14px;font-weight:500;color:#181b23;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
// .dd-btn.float .dd-val{padding-top:14px;}
// .dd-menu{position:absolute;top:48px;left:0;right:0;z-index:50;background:#fff;border:1.5px solid #eef0f5;border-top:none;border-radius:0 0 10px 10px;box-shadow:0 4px 16px rgba(0,0,0,0.06);max-height:280px;overflow-y:auto;}
// .dd-opt{display:flex;align-items:center;gap:10px;padding:12px 14px;font-size:14px;color:#2c333c;cursor:pointer;transition:background .1s;border-bottom:1px solid #f8f9fb;direction:rtl;}
// .dd-opt:last-child{border-bottom:none;}
// .dd-opt:hover{background:#f3f6fc;}
// .dd-opt.selected{background:#ebf4ff;}
// .dd-search{width:100%;border:none;outline:none;background:transparent;font-family:'Rubik',sans-serif;font-size:14px;font-weight:500;color:#181b23;caret-color:#0051ff;text-align:right;direction:rtl;padding-top:14px;}
// .opt-icon{display:flex;flex-shrink:0;}
// ─────────────────────────────────────────────────────────────

const ChevSvg = ({ active }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke={active ? "#0051ff" : "#c7cbd7"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocSvg = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="2" width="12" height="14" rx="2" stroke="#c7cbd7" strokeWidth="1.2" />
    <path d="M6 6h6M6 9h6M6 12h3" stroke="#c7cbd7" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CurrencySvg = () => (
  <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.966 7.77593L8.424 7.45193V2.41193L8.46 2.37593C8.952 1.79993 9.522 1.31993 10.17 0.935927L10.332 0.845927V7.09193L14.4 6.22793L14.526 6.17393V6.31793C14.454 7.00193 14.292 7.61993 14.04 8.17193L14.022 8.22593H13.95L10.332 9.01793V10.5119L14.4 9.64793L14.526 9.62993V9.75593C14.454 10.3919 14.292 11.0159 14.04 11.6279L14.022 11.6819L13.95 11.6999L8.568 12.8159L8.424 12.8699V9.41393L6.966 9.71993V11.5559C6.966 11.7479 6.9 11.9279 6.768 12.0959L5.922 13.3919C5.706 13.7039 5.424 13.9139 5.076 14.0219L4.914 14.0579L0.144 15.0659L0 15.1019L0.018 14.9579C0.09 14.3219 0.252 13.6979 0.504 13.0859L0.54 13.0499H0.576L5.058 12.0959V10.1339L0.936 11.0159L0.792 11.0519L0.81 10.9079C0.846 10.5719 0.9 10.2539 0.972 9.95393L1.116 9.48593C1.152 9.41393 1.182 9.34193 1.206 9.26993C1.242 9.19793 1.272 9.13193 1.296 9.07193L1.332 9.01793L1.368 8.99993L5.058 8.20793V1.56593L5.076 1.54793L5.256 1.31393C5.484 1.07393 5.724 0.851927 5.976 0.647927C6.228 0.431927 6.51 0.251927 6.822 0.107927L6.966 -7.34329e-05V7.77593ZM14.526 13.2119C14.454 13.8479 14.292 14.4659 14.04 15.0659L14.022 15.1199H13.95L8.568 16.2899L8.424 16.3079V16.1639C8.448 15.9959 8.472 15.8339 8.496 15.6779C8.532 15.5219 8.562 15.3659 8.586 15.2099L8.748 14.7419C8.784 14.6819 8.814 14.6099 8.838 14.5259C8.874 14.4419 8.91 14.3699 8.946 14.3099L8.964 14.2559H9.018L14.4 13.0859L14.526 13.0679V13.2119Z" fill="#2C333C" />
  </svg>
);

// ── TextInput ──────────────────────────────────────────────
export function TextInput({ label = "العنوان هنا", helpText, errorText, currency = false, disabled = false, value: cv, onChange }) {
  const [iv, setIv] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const ctrl = cv !== undefined;
  const val = ctrl ? cv : iv;
  const hasErr = !!errorText;
  const isFilled = val.length > 0;
  const isFloat = focused || isFilled;
  const state = hasErr ? "error" : focused ? "active" : isFilled ? "filled" : "default";

  let cls = "input-box";
  if (state === "active") cls += " active";
  if (state === "error") cls += " error";
  if (isFloat) cls += " float";

  return (
    <div className="input-wrap">
      <div className={cls} onClick={() => ref.current?.focus()}>
        {currency && (
          <span className="curr"><CurrencySvg /></span>
        )}
        <div style={{ position: "relative", flex: 1, height: "100%", display: "flex", alignItems: "center" }}>
          <span className="fl">{label}</span>
          <input
            ref={ref}
            type="text"
            disabled={disabled}
            value={val}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => {
              const v = currency ? e.target.value.replace(/[^0-9.,٠-٩]/g, "") : e.target.value;
              if (!ctrl) setIv(v);
              onChange?.(v);
            }}
          />
        </div>
      </div>
      {helpText && !hasErr && <span className="help-text">{helpText}</span>}
      {hasErr && <span className="error-text">{errorText}</span>}
    </div>
  );
}

// ── ParagraphInput ─────────────────────────────────────────
export function ParagraphInput({ placeholder = "وصف المعاملة ..", maxLength = 500, value: cv, onChange }) {
  const [iv, setIv] = useState("");
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const ctrl = cv !== undefined;
  const val = ctrl ? cv : iv;
  const state = focused ? "active" : val.length > 0 ? "filled" : "empty";

  return (
    <div className="input-wrap">
      <div className={`para-box${state === "active" ? " active" : ""}`} onClick={() => ref.current?.focus()}>
        <textarea
          ref={ref}
          value={val}
          placeholder={placeholder}
          rows={4}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={e => {
            const v = e.target.value.slice(0, maxLength);
            if (!ctrl) setIv(v);
            onChange?.(v);
          }}
        />
      </div>
      <span className="char-count">{maxLength} / {val.length}</span>
    </div>
  );
}

// ── DropdownInput ──────────────────────────────────────────
export function DropdownInput({ label = "العنوان هنا", options = [], searchable = false, withLeftIcon = false, withRightIcon = false, helpText, errorText, value: cv, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [iv, setIv] = useState(null);
  const [hi, setHi] = useState(-1);
  const [sq, setSq] = useState("");
  const cRef = useRef(null);
  const sRef = useRef(null);
  const ctrl = cv !== undefined;
  const selected = ctrl ? cv : iv;
  const norm = options.map(o => typeof o === "string" ? { label: o, value: o } : o);
  const filtered = searchable && sq ? norm.filter(o => o.label.includes(sq)) : norm;
  const selOpt = norm.find(o => o.value === selected);
  const hasErr = !!errorText;
  const isFilled = !!selOpt;
  const isFloat = isOpen || isFilled;

  useEffect(() => {
    const h = e => { if (cRef.current && !cRef.current.contains(e.target)) { setIsOpen(false); setSq(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && sRef.current) sRef.current.focus();
  }, [isOpen, searchable]);

  const pick = v => { if (!ctrl) setIv(v); onChange?.(v); setIsOpen(false); setSq(""); };

  let btnCls = "dd-btn";
  if (isOpen) btnCls += " open float";
  else if (isFilled) btnCls += " sel float";
  if (hasErr && !isOpen && !isFilled) btnCls += " error";

  return (
    <div className="dd-wrap" ref={cRef}>
      <div className={btnCls} onClick={() => { setIsOpen(v => !v); setHi(-1); }}>
        <div style={{ flex: 1, position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
          <span className="fl">{label}</span>
          {searchable && isOpen ? (
            <input ref={sRef} type="text" className="dd-search" value={sq}
              onChange={e => { e.stopPropagation(); setSq(e.target.value); }}
              onClick={e => e.stopPropagation()} />
          ) : (
            <span className="dd-val" style={{ color: isFilled ? "#181b23" : "transparent", paddingTop: isFloat ? "14px" : "0" }}>
              {selOpt?.label || "\u200e"}
            </span>
          )}
        </div>
        <span className={`chev${isOpen ? " open" : ""}`}>
          <ChevSvg active={isOpen} />
        </span>
      </div>

      {isOpen && (
        <div className="dd-menu">
          {filtered.map((opt, i) => (
            <div
              key={opt.value + "-" + i}
              className={`dd-opt${opt.value === selected ? " selected" : ""}`}
              onMouseEnter={() => setHi(i)}
              onMouseLeave={() => setHi(-1)}
              onClick={() => pick(opt.value)}
              style={{ background: opt.value === selected ? "#ebf4ff" : hi === i ? "#f3f6fc" : "transparent" }}
            >
              {withLeftIcon && <span className="opt-icon"><DocSvg /></span>}
              <span style={{ flex: 1, textAlign: "right" }}>{opt.label}</span>
              {withRightIcon && <span className="opt-icon"><DocSvg /></span>}
            </div>
          ))}
        </div>
      )}

      {helpText && !hasErr && <span className="help-text">{helpText}</span>}
      {hasErr && <span className="error-text">{errorText}</span>}
    </div>
  );
}

// ── Default export (unified) ───────────────────────────────
export default function InputField({ type = "text", ...props }) {
  switch (type) {
    case "paragraph": return <ParagraphInput {...props} />;
    case "dropdown":  return <DropdownInput {...props} />;
    default:          return <TextInput {...props} />;
  }
}

InputField.Text      = TextInput;
InputField.Paragraph = ParagraphInput;
InputField.Dropdown  = DropdownInput;
