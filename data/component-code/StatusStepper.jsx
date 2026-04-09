import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Waffy Design System — StatusStepper
// Contract status timeline with 3–4 steps, bilingual (EN/AR), RTL-aware.
//
// Required CSS class: statusStepper.module.scss  (or paste the block below)
// ─────────────────────────────────────────────────────────────────────────────
//
// /* Paste into your stylesheet if not using the module */
// .stepper-container { width:100%; min-height:105px; border-bottom:1px solid #F3F4F5; padding:21px 42px; }
// .time-line         { display:flex; align-items:flex-start; justify-content:center; }
// .line              { flex-grow:1; height:2px; background:#F3F3F3; margin-top:11.98px; transition:background .3s; }
// .line--done        { background:#44C16E; opacity:.3; }
// .step              { margin:0 5px; display:flex; align-items:center; flex-direction:column; }
// .step--last        { margin-inline-start:-10px; }
// .numbering         { display:flex; justify-content:center; align-items:center; background:#F8F9F9; width:23.63px; height:23.63px; border-radius:50%; flex-shrink:0; }
// .numbering__text   { font-family:'Rubik',sans-serif; font-weight:700; font-size:.75rem; color:#9FA6AB; }
// .numbering--active    { background:#283743; }
// .numbering--done      { background:#44C16E; }
// .numbering--escalated { background:#D18B49; }
// .numbering--active .numbering__text,
// .numbering--done .numbering__text,
// .numbering--escalated .numbering__text { color:#fff; }
// .status            { font-family:'Rubik',sans-serif; font-weight:400; font-size:.75rem; color:#9FA6AB; margin:9px 0 0; white-space:nowrap; text-align:center; }
// .status--active    { color:#283743; font-weight:600; font-size:14px; line-height:21px; }
// .status--done      { color:#44C16E; font-weight:400; font-size:.875rem; }
// .status--escalated { color:#283743; font-weight:600; font-size:14px; }
// .status--skipped   { text-decoration:line-through; color:#9FA6AB; }
// .step-label        { font-family:'Rubik',sans-serif; font-size:10px; font-weight:400; line-height:15px; color:#D18B49; margin-top:3px; white-space:nowrap; text-align:center; }
// ─────────────────────────────────────────────────────────────────────────────

// ── Design tokens ──────────────────────────────────────────────────────────
const COLORS = {
  pending:   { bg: "#F8F9F9", num: "#9FA6AB", label: "#9FA6AB" },
  active:    { bg: "#283743", num: "#ffffff", label: "#283743" },
  done:      { bg: "#44C16E", num: "#ffffff", label: "#44C16E" },
  escalated: { bg: "#D18B49", num: "#ffffff", label: "#283743" },
  connector: "#F3F3F3",
  connectorDone: "#44C16E",
};

// ── Step state resolver ────────────────────────────────────────────────────
function getStepState(stepIndex, { activeStep, escalation = {} }) {
  if (stepIndex === 2) {
    if (escalation.delivery && !escalation.resolved) return "escalated";
    if (escalation.delivery &&  escalation.resolved) return "escalated-resolved";
  }
  if (stepIndex === 3) {
    if (escalation.skipped)                                   return "skipped";
    if (escalation.inspection && !escalation.resolved)        return "escalated";
    if (escalation.inspection &&  escalation.resolved)        return "escalated-resolved";
  }
  if (activeStep > stepIndex) return "done";
  if (activeStep === stepIndex) return "active";
  return "pending";
}

// ── Sub-components ─────────────────────────────────────────────────────────
function Connector({ done }) {
  return (
    <div
      className={`line${done ? " line--done" : ""}`}
      style={{
        flexGrow: 1, height: 2,
        background: done ? COLORS.connectorDone : COLORS.connector,
        opacity: done ? 0.3 : 1,
        marginTop: "11.98px",
        transition: "background 0.3s",
      }}
    />
  );
}

function Step({ number, label, state, subLabel, isLast }) {
  const circleClass = {
    active:              "numbering--active",
    done:                "numbering--done",
    escalated:           "numbering--escalated",
    "escalated-resolved":"numbering--escalated",
    skipped:             "numbering--escalated",
  }[state] || "";

  const labelClass = {
    active:              "status--active",
    done:                "status--done",
    escalated:           "status--escalated",
    "escalated-resolved":"status--escalated",
    skipped:             "status--skipped",
  }[state] || "";

  return (
    <div className={`step${isLast ? " step--last" : ""}`}>
      <div className={`numbering ${circleClass}`.trim()}>
        <p className="numbering__text">{number}</p>
      </div>
      <p className={`status ${labelClass}`.trim()}>{label}</p>
      {subLabel && <p className="step-label">{subLabel}</p>}
    </div>
  );
}

// ── Default i18n labels ────────────────────────────────────────────────────
const DEFAULT_LABELS = {
  step1: "Payment",
  step2: "Execution",
  step3: "Approval",
  step4: "Completion",
  step4Haraj: "Money Transfer",
};

const DEFAULT_SUB_LABELS = {
  arbitrationInProgress: "Arbitration in progress",
  arbitrated: "Arbitrated",
  skip: "-",
};

// ── Main component ─────────────────────────────────────────────────────────
/**
 * StatusStepper
 *
 * @param {number}  activeStep   - Current active step index (1–4, 5 = fully done)
 * @param {boolean} showStep3    - Show Inspection/Approval step (false for MILESTONE + !isInspectable)
 * @param {boolean} isHaraj      - Changes Step 4 label to "Money Transfer"
 * @param {object}  escalation   - { delivery, inspection, resolved, skipped } — all boolean
 * @param {object}  labels       - Override step label strings (e.g. for Arabic)
 * @param {object}  subLabels    - Override escalation sub-label strings
 */
export default function StatusStepper({
  activeStep = 1,
  showStep3 = true,
  isHaraj = false,
  escalation = { delivery: false, inspection: false, resolved: false, skipped: false },
  labels = DEFAULT_LABELS,
  subLabels = DEFAULT_SUB_LABELS,
}) {
  const L  = { ...DEFAULT_LABELS,     ...labels };
  const SL = { ...DEFAULT_SUB_LABELS, ...subLabels };
  const cfg = { activeStep, escalation };

  // ── Step 1 ──
  const s1 = getStepState(1, cfg);

  // ── Step 2 ──
  const s2 = getStepState(2, cfg);
  let s2Sub = null;
  if (escalation.delivery && !escalation.resolved) s2Sub = SL.arbitrationInProgress;
  if (escalation.delivery &&  escalation.resolved) s2Sub = SL.arbitrated;

  // ── Step 3 (conditional) ──
  const s3 = showStep3 ? getStepState(3, cfg) : null;
  const s3Num = s3 === "skipped" ? SL.skip : "3";
  let s3Sub = null;
  if (showStep3 && escalation.inspection && !escalation.resolved && !escalation.skipped) s3Sub = SL.arbitrationInProgress;
  if (showStep3 && escalation.inspection &&  escalation.resolved && !escalation.skipped) s3Sub = SL.arbitrated;

  // ── Step 4 ──
  const step4Num = showStep3 ? "4" : "3";
  const s4 = getStepState(4, cfg);
  const step4Label = isHaraj ? L.step4Haraj : L.step4;

  return (
    <div className="stepper-container">
      <div className="time-line">
        <Step number="1" label={L.step1} state={s1} subLabel={null} />
        <Connector done={s1 === "done"} />

        <Step number="2" label={L.step2} state={s2} subLabel={s2Sub} />
        <Connector done={s2 === "done"} />

        {showStep3 && (
          <>
            <Step number={s3Num} label={L.step3} state={s3} subLabel={s3Sub} />
            <Connector done={s3 === "done"} />
          </>
        )}

        <Step number={step4Num} label={step4Label} state={s4} subLabel={null} isLast />
      </div>
    </div>
  );
}

// ── Usage examples ─────────────────────────────────────────────────────────
//
// Step 2 active (default):
//   <StatusStepper activeStep={2} />
//
// Escalation in progress on step 2:
//   <StatusStepper activeStep={2} escalation={{ delivery: true, inspection: false, resolved: false, skipped: false }} />
//
// Milestone contract (no inspection step):
//   <StatusStepper activeStep={2} showStep3={false} />
//
// Arabic RTL (wrap in <div dir="rtl">):
//   <div dir="rtl">
//     <StatusStepper activeStep={3} labels={{ step1:"الدفع", step2:"التنفيذ", step3:"الموافقة", step4:"الإكمال", step4Haraj:"تحويل المبلغ" }} />
//   </div>
//
// Haraj org (Step 4 = "Money Transfer"):
//   <StatusStepper activeStep={4} isHaraj />
