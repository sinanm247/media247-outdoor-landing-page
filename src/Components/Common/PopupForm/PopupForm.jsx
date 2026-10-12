import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IoClose } from "react-icons/io5";
import { sendContactFormEmail, sendToGoogleSheets } from "../../../Utils/emailService";
import "./PopupForm.scss";

const BOT_MIN_SECONDS = 3;

const BUDGET_OPTIONS = [
  { value: "100k-500k AED", label: "100k-500k AED" },
  { value: "500k-1M AED", label: "500k-1M AED" },
  { value: "1M+ AED", label: "1M+ AED" },
];

const INTEREST_OPTIONS = [
  { value: "Hoardings", label: "Hoardings" },
  { value: "Unipoles", label: "Unipoles" },
  { value: "Digital OOH Screens", label: "Digital OOH Screens" },
  { value: "Transit Media (Taxis & Buses)", label: "Transit Media (Taxis & Buses)" },
  { value: "Lamp Post Banners", label: "Lamp Post Banners" },
  { value: "Glass Graphics & Building Wraps", label: "Glass Graphics & Building Wraps" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  companyName: "",
  phone: "",
  budget: "",
  interest: "",
  message: "",
  website: "",
};

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SelectField({ id, label, placeholder, options, value, error, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="popup-field">
      <label htmlFor={id}>
        {label}
        <span className="req">*</span>
      </label>
      <div className={`popup-input custom-select ${open ? "open" : ""}`} ref={wrapRef}>
        <button
          type="button"
          id={id}
          className={`select-trigger ${value ? "" : "is-placeholder"}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="select-value">{value || placeholder}</span>
          <span className="field-icon">
            <ChevronIcon />
          </span>
        </button>
        {open && (
          <ul className="select-menu" role="listbox" aria-labelledby={id}>
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                className={`select-option ${value === opt.value ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="popup-error">{error}</div>}
    </div>
  );
}

export default function PopupForm({ open, onClose }) {
  const navigate = useNavigate();
  const formOpenTimeRef = useRef(null);
  const formRef = useRef(null);
  const uid = useId();
  const fieldId = (field) => `popup-${uid}-${field}`;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    formOpenTimeRef.current = Date.now();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const validateUAEPhone = (phone) => /^(\+971|971)[0-9]{9}$/.test(String(phone || "").replace(/[\s-]/g, ""));
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

  const setValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleUpdate = (field) => (event) => setValue(field, event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponse("");

    const errors = {};
    if (!formData.name?.trim()) errors.name = "Full name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";
    if (!formData.companyName?.trim()) errors.companyName = "Company is required";
    if (!formData.phone?.trim()) errors.phone = "Phone is required";
    else if (!validateUAEPhone(formData.phone)) errors.phone = "Please enter a valid UAE phone number (+971XXXXXXXXX)";
    if (!formData.budget) errors.budget = "Budget range is required";
    if (!formData.interest) errors.interest = "Interest is required";
    if (!formData.message?.trim()) errors.message = "Message is required";

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const elapsed = formOpenTimeRef.current ? (Date.now() - formOpenTimeRef.current) / 1000 : 999;
    const isHoneypotBot = formData.website && String(formData.website).trim() !== "";
    const isTimingBot = elapsed < BOT_MIN_SECONDS;

    if (isHoneypotBot || isTimingBot) {
      await sendToGoogleSheets({
        name: formData.name || "",
        phone: formData.phone || "",
        email: formData.email || "",
        message: formData.message || "",
        service: formData.interest || "",
        company: formData.companyName || "",
        budget: formData.budget || "",
        source: "Popup Form",
        botMessageField: isHoneypotBot ? String(formData.website).trim() : "submitted_too_fast",
      });
      setResponse(isHoneypotBot ? "Something went wrong. Please try again." : "Please take a moment to complete the form, then try again.");
      return;
    }

    const dataToSend = {
      name: formData.name.trim(),
      phone: formData.phone,
      email: formData.email.trim(),
      message: formData.message.trim(),
      service: formData.interest,
      budget: formData.budget,
      company: formData.companyName.trim(),
    };

    try {
      setIsLoading(true);
      const result = await sendContactFormEmail({ ...dataToSend, website: formData.website });
      if (result.success) {
        setResponse("Email sent successfully!");
        setFormData(EMPTY_FORM);
        setFormErrors({});
        setTimeout(() => {
          onClose();
          navigate("/thank-you", { state: { gtmConversion: { formSource: "popup_form", formValues: dataToSend } } });
        }, 1200);
      } else {
        setResponse("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Popup form error:", error);
      setResponse("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="popup-form-overlay" onClick={onClose} role="presentation">
      <div
        className="popup-form-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={fieldId("title")}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="popup-form-close" onClick={onClose} aria-label="Close">
          <IoClose />
        </button>

        <form ref={formRef} className="popup-form" onSubmit={handleSubmit} autoComplete="on">
          <input
            type="text"
            name="website"
            className="popup-honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(event) => setFormData((prev) => ({ ...prev, website: event.target.value }))}
            aria-hidden="true"
          />

          <h2 id={fieldId("title")} className="popup-form-title">Get Your Custom Media Proposal</h2>
          <p className="popup-form-lead">Share your brief and our OOH team will come back with a plan.</p>

          <div className="popup-form-grid">
            <div className="popup-field">
              <label htmlFor={fieldId("name")}>Full Name<span className="req">*</span></label>
              <div className="popup-input">
                <input id={fieldId("name")} type="text" name="name" autoComplete="name" placeholder="Your full name" value={formData.name} onChange={handleUpdate("name")} />
              </div>
              {formErrors.name && <div className="popup-error">{formErrors.name}</div>}
            </div>

            <div className="popup-field">
              <label htmlFor={fieldId("email")}>Email<span className="req">*</span></label>
              <div className="popup-input">
                <input id={fieldId("email")} type="email" name="email" autoComplete="email" placeholder="you@company.com" value={formData.email} onChange={handleUpdate("email")} />
              </div>
              {formErrors.email && <div className="popup-error">{formErrors.email}</div>}
            </div>

            <div className="popup-field">
              <label htmlFor={fieldId("company")}>Company<span className="req">*</span></label>
              <div className="popup-input">
                <input id={fieldId("company")} type="text" name="companyName" autoComplete="organization" placeholder="Your company or brand" value={formData.companyName} onChange={handleUpdate("companyName")} />
              </div>
              {formErrors.companyName && <div className="popup-error">{formErrors.companyName}</div>}
            </div>

            <div className="popup-field">
              <label htmlFor={fieldId("phone")}>Phone<span className="req">*</span></label>
              <div className="popup-input phone-wrap">
                <PhoneInput
                  country="ae"
                  value={formData.phone}
                  onChange={(phone) => setValue("phone", phone)}
                  inputProps={{ id: fieldId("phone"), name: "phone", autoComplete: "tel" }}
                  placeholder="+971 0000000000"
                  inputStyle={{
                    width: "100%",
                    height: "52px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.28)",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    paddingLeft: "52px",
                    fontSize: "15px",
                  }}
                  buttonStyle={{
                    border: "none",
                    backgroundColor: "transparent",
                    borderRight: "1px solid rgba(255, 255, 255, 0.22)",
                    borderRadius: "16px 0 0 16px",
                  }}
                  containerStyle={{ width: "100%" }}
                />
              </div>
              {formErrors.phone && <div className="popup-error">{formErrors.phone}</div>}
            </div>

            <div className="popup-field-pair">
              <SelectField
                id={fieldId("budget")}
                label="Budget Range"
                placeholder="Select budget"
                options={BUDGET_OPTIONS}
                value={formData.budget}
                error={formErrors.budget}
                onChange={(value) => setValue("budget", value)}
              />

              <SelectField
                id={fieldId("interest")}
                label="Interest"
                placeholder="Select interest"
                options={INTEREST_OPTIONS}
                value={formData.interest}
                error={formErrors.interest}
                onChange={(value) => setValue("interest", value)}
              />
            </div>

            <div className="popup-field popup-field-full">
              <label htmlFor={fieldId("message")}>Message<span className="req">*</span></label>
              <input
                id={fieldId("message")}
                type="text"
                name="message"
                placeholder="Tell us about your campaign"
                value={formData.message}
                onChange={handleUpdate("message")}
              />
              {formErrors.message && <div className="popup-error">{formErrors.message}</div>}
            </div>
          </div>

          <button type="submit" className="btn primary-btn popup-form-submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send My Brief"}
          </button>

          {response && (
            <div className={`popup-response ${response.includes("successfully") ? "success" : "error"}`}>
              {response}
            </div>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
