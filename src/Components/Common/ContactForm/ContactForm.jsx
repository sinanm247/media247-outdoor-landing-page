import { useState, useRef, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./ContactForm.scss";
import { sendContactFormEmail, sendToGoogleSheets } from "../../../Utils/emailService";

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

  const pick = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        <span className="req">*</span>
      </label>
      <div className={`input-wrap custom-select ${open ? "open" : ""}`} ref={wrapRef}>
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
                onClick={() => pick(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default function ContactForm() {
  const navigate = useNavigate();
  const formOpenTimeRef = useRef(null);
  const formRef = useRef(null);
  // The form renders more than once per page, so ids must be unique per instance
  const uid = useId();
  const fieldId = (field) => `${uid}-${field}`;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    budget: "",
    interest: "",
    message: "",
    website: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    formOpenTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const syncAutofill = () => {
      if (!formRef.current) return;
      const nameEl = formRef.current.querySelector('input[name="name"]');
      const emailEl = formRef.current.querySelector('input[name="email"]');
      const phoneEl = formRef.current.querySelector('input[name="phone"]');
      setFormData((prev) => {
        const next = { ...prev };
        if (nameEl?.value?.trim()) next.name = nameEl.value.trim();
        if (emailEl?.value?.trim()) next.email = emailEl.value.trim();
        if (phoneEl?.value?.trim()) next.phone = phoneEl.value.trim();
        return next;
      });
    };
    const t1 = setTimeout(syncAutofill, 100);
    const t2 = setTimeout(syncAutofill, 500);
    form.addEventListener("change", syncAutofill);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      form.removeEventListener("change", syncAutofill);
    };
  }, []);

  const errors = {};

  const validateUAEPhone = (phone) => {
    if (!phone || String(phone).trim().length === 0) return false;
    const cleanPhone = String(phone).replace(/[\s-]/g, "");
    return /^(\+971|971)[0-9]{9}$/.test(cleanPhone);
  };

  const validateEmail = (email) => {
    if (!email || String(email).trim().length === 0) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const validateErrors = () => {
    if (!formData.name?.trim()) errors.name = "Full name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";
    if (!formData.companyName?.trim()) errors.companyName = "Company is required";
    if (!formData.phone?.trim()) errors.phone = "Phone is required";
    else if (!validateUAEPhone(formData.phone)) errors.phone = "Please enter a valid UAE phone number (+971XXXXXXXXX)";
    if (!formData.budget) errors.budget = "Budget range is required";
    if (!formData.interest) errors.interest = "Interest is required";
    if (!formData.message?.trim()) errors.message = "Message is required";
  };

  const setValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleUpdate = (field) => (event) => setValue(field, event.target.value);

  const handleSendEmail = async (payload) => {
    try {
      setIsLoading(true);
      setResponse("");
      const { website: _honeypot, ...dataToSend } = payload;
      const result = await sendContactFormEmail(dataToSend);
      if (result.success) {
        setResponse("Email sent successfully!");
        setFormData({
          name: "",
          email: "",
          companyName: "",
          phone: "",
          budget: "",
          interest: "",
          message: "",
          website: "",
        });
        setFormErrors({});
        setTimeout(() => {
          navigate("/thank-you", { state: { gtmConversion: { formSource: "contact_form", formValues: dataToSend } } });
        }, 3000);
      } else {
        setResponse("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Email sending error:", error);
      setResponse("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");

    const elapsed = formOpenTimeRef.current ? (Date.now() - formOpenTimeRef.current) / 1000 : 999;
    const isHoneypotBot = formData.website && String(formData.website).trim() !== "";
    const isTimingBot = elapsed < BOT_MIN_SECONDS;

    if (isHoneypotBot || isTimingBot) {
      const botMessageField = isHoneypotBot ? String(formData.website).trim() : "submitted_too_fast";
      await sendToGoogleSheets({
        name: formData.name || "",
        phone: formData.phone || "",
        email: formData.email || "",
        message: formData.message || "",
        service: formData.interest || "",
        company: formData.companyName || "",
        budget: formData.budget || "",
        source: "Contact Form",
        botMessageField,
      });
      setResponse(isHoneypotBot ? "Something went wrong. Please try again." : "Please take a moment to complete the form, then try again.");
      return;
    }

    validateErrors();
    if (Object.keys(errors).length === 0) {
      handleSendEmail({
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email.trim(),
        message: formData.message.trim(),
        service: formData.interest,
        budget: formData.budget,
        company: formData.companyName.trim(),
        website: formData.website,
      });
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <section id="contact-us">
      <div className="contact-form-section">
        <div className="contact-content section-container">
          <div className="contact-info" data-reveal="left">
            <h2 className="section-tagline">CONTACT US</h2>
            <h1 className="main-title">Talk to Our OOH Advertising Experts.</h1>
            <p className="description">
              Share your brief, budget, and target audience — we'll build the right outdoor media plan for you.
            </p>

            <div className="key-points">
              <div className="point">
                <div className="point-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="point-text">
                  <h4>Strategic OOH Planning</h4>
                  <p>Bespoke plans across hoardings, unipoles, DOOH and transit.</p>
                </div>
              </div>

              <div className="point">
                <div className="point-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="point-text">
                  <h4>Maximum Visibility & Reach</h4>
                  <p>Prime locations across Dubai and the wider UAE.</p>
                </div>
              </div>

              <div className="point">
                <div className="point-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="point-text">
                  <h4>End-to-End Execution</h4>
                  <p>Site selection, permits, production, and campaign monitoring.</p>
                </div>
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="contact-form" autoComplete="on" data-reveal="right">
            <input
              type="text"
              name="website"
              className="form-honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              aria-hidden="true"
            />

            <h1 className="title">Get Your Custom Media Proposal</h1>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor={fieldId("name")}>
                  Full Name<span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id={fieldId("name")}
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleUpdate("name")}
                  />
                </div>
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>

              <div className="form-field">
                <label htmlFor={fieldId("email")}>
                  Email<span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id={fieldId("email")}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleUpdate("email")}
                  />
                </div>
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>

              <div className="form-field">
                <label htmlFor={fieldId("company")}>
                  Company<span className="req">*</span>
                </label>
                <div className="input-wrap">
                  <input
                    id={fieldId("company")}
                    type="text"
                    name="companyName"
                    autoComplete="organization"
                    placeholder="Your company or brand"
                    value={formData.companyName}
                    onChange={handleUpdate("companyName")}
                  />
                </div>
                {formErrors.companyName && <div className="error-message">{formErrors.companyName}</div>}
              </div>

              <div className="form-field">
                <label htmlFor={fieldId("phone")}>
                  Phone<span className="req">*</span>
                </label>
                <div className="input-wrap phone-wrap">
                  <PhoneInput
                    country="ae"
                    value={formData.phone}
                    onChange={(phone) => {
                      setFormData((prev) => ({ ...prev, phone }));
                      setFormErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    inputProps={{
                      id: fieldId("phone"),
                      name: "phone",
                      autoComplete: "tel",
                    }}
                    placeholder="+971 0000000000"
                    inputStyle={{
                      width: "100%",
                      height: "52px",
                      borderRadius: "20px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#f9f9f9",
                      color: "#1a1a1a",
                      paddingLeft: "50px",
                      fontSize: "15px",
                    }}
                    buttonStyle={{
                      border: "none",
                      backgroundColor: "#f9f9f9",
                      borderRight: "1px solid #e0e0e0",
                      borderRadius: "20px 0 0 20px",
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                </div>
                {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
              </div>

              <SelectField
                id={fieldId("budget")}
                label="Budget Range"
                placeholder="Select budget"
                options={BUDGET_OPTIONS}
                value={formData.budget}
                error={formErrors.budget}
                onChange={(val) => setValue("budget", val)}
              />

              <SelectField
                id={fieldId("interest")}
                label="Interest"
                placeholder="Select interest"
                options={INTEREST_OPTIONS}
                value={formData.interest}
                error={formErrors.interest}
                onChange={(val) => setValue("interest", val)}
              />

              <div className="form-field form-field-full">
                <label htmlFor={fieldId("message")}>
                  Message<span className="req">*</span>
                </label>
                <textarea
                  id={fieldId("message")}
                  name="message"
                  rows={4}
                  placeholder="Tell us about your campaign"
                  value={formData.message}
                  onChange={handleUpdate("message")}
                />
                {formErrors.message && <div className="error-message">{formErrors.message}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-glass" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send My Brief"}
            </button>

            {response && (
              <div className={`response-message ${response.includes("successfully") ? "success" : "error"}`}>
                {response}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
