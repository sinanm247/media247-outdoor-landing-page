import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./ContactForm.scss";
import { sendContactFormEmail, sendToGoogleSheets } from "../../../Utils/emailService";

const BOT_MIN_SECONDS = 3;
const TOTAL_STEPS = 5;

const CAMPAIGN_OBJECTIVES = [
  { value: "Brand Awareness", label: "Brand Awareness" },
  { value: "Product / Service Launch", label: "Product / Service Launch" },
  { value: "Event Promotion", label: "Event Promotion" },
  { value: "Store / Branch Opening", label: "Store / Branch Opening" },
  { value: "Other", label: "Other" },
];

const TARGET_EMIRATES = [
  { value: "Dubai", label: "Dubai" },
  { value: "Abu Dhabi", label: "Abu Dhabi" },
  { value: "Sharjah", label: "Sharjah" },
  { value: "Multiple Emirates", label: "Multiple Emirates" },
  { value: "Nationwide", label: "Nationwide" },
];

const FORMAT_OPTIONS = [
  { value: "Billboards (Static)", label: "Billboards (Static)" },
  { value: "Digital / LED Screens", label: "Digital / LED Screens" },
  { value: "Unipoles", label: "Unipoles" },
  { value: "Bridge Banners", label: "Bridge Banners" },
  { value: "Bus Shelters", label: "Bus Shelters" },
  { value: "Mall Facades / Building Wraps", label: "Mall Facades / Building Wraps" },
  { value: "Taxi Media", label: "Taxi Media (250k+ budget)" },
  { value: "Hoardings / Construction Wraps", label: "Hoardings / Construction Wraps (250k+ budget)" },
];

const BUDGET_OPTIONS = [
  { value: "AED 100,000 – 250,000", label: "AED 100,000 – 250,000" },
  { value: "AED 250,000 – 500,000", label: "AED 250,000 – 500,000" },
  { value: "AED 500,000 – 1,000,000", label: "AED 500,000 – 1,000,000" },
  { value: "AED 1,000,000+", label: "AED 1,000,000+" },
];

const GO_LIVE_OPTIONS = [
  { value: "Within 2 weeks", label: "Within 2 weeks" },
  { value: "Within 1 month", label: "Within 1 month" },
  { value: "1–3 months from now", label: "1–3 months from now" },
  { value: "Just planning ahead", label: "Just planning ahead" },
];

const DURATION_OPTIONS = [
  { value: "2 weeks", label: "2 weeks" },
  { value: "1 month", label: "1 month" },
  { value: "3 months", label: "3 months" },
  { value: "6 months", label: "6 months" },
  { value: "12 months", label: "12 months" },
];

export default function ContactForm() {
  const navigate = useNavigate();
  const formOpenTimeRef = useRef(null);
  const formRef = useRef(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    campaignObjective: "",
    targetEmirates: "",
    formats: [],
    budget: "",
    goLive: "",
    campaignDuration: "",
    name: "",
    companyName: "",
    email: "",
    phone: "",
    website: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    formOpenTimeRef.current = Date.now();
  }, []);

  const errors = {};

  const validateUAEPhone = (phone) => {
    if (!phone || String(phone).trim().length === 0) return false;
    const clean = String(phone).replace(/[\s-]/g, "");
    return /^(\+971|971)[0-9]{9}$/.test(clean);
  };

  const validateEmail = (email) => {
    if (!email || String(email).trim().length === 0) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  };

  const validateStep5 = () => {
    if (!formData.name?.trim()) errors.name = "Full name is required";
    if (!formData.companyName?.trim()) errors.companyName = "Company name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";
    if (!formData.phone?.trim()) errors.phone = "Phone number is required";
    else if (!validateUAEPhone(formData.phone)) errors.phone = "Please enter a valid UAE phone number (+971XXXXXXXXX)";
  };

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const selectSingle = (field, value) => {
    update(field, value);
  };

  const toggleMulti = (field, value) => {
    setFormData((prev) => {
      const arr = prev[field] || [];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [field]: next };
    });
  };

  const canProceedStep1 = formData.campaignObjective && formData.targetEmirates;
  const canProceedStep2 = formData.formats && formData.formats.length > 0;
  const canProceedStep3 = !!formData.budget;
  const canProceedStep4 = formData.goLive && formData.campaignDuration;

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const buildSummaryMessage = () => {
    const parts = [
      `Objective: ${formData.campaignObjective || "-"}`,
      `Target: ${formData.targetEmirates || "-"}`,
      `Formats: ${(formData.formats || []).join(", ") || "-"}`,
      `Budget: ${formData.budget || "-"}`,
      `Go live: ${formData.goLive || "-"}`,
      `Duration: ${formData.campaignDuration || "-"}`,
    ];
    return parts.join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    validateStep5();
    if (Object.keys(errors).length > 0) {
      setFormErrors({ ...errors });
      return;
    }

    const elapsed = formOpenTimeRef.current ? (Date.now() - formOpenTimeRef.current) / 1000 : 999;
    const isHoneypotBot = formData.website && String(formData.website).trim() !== "";
    const isTimingBot = elapsed < BOT_MIN_SECONDS;

    if (isHoneypotBot || isTimingBot) {
      const botMessageField = isHoneypotBot ? String(formData.website).trim() : "submitted_too_fast";
      await sendToGoogleSheets({
        name: formData.name || "",
        phone: formData.phone || "",
        email: formData.email || "",
        message: buildSummaryMessage(),
        service: "OOH Campaign Brief",
        source: "Contact Form",
        botMessageField,
      });
      setResponse(isHoneypotBot ? "Something went wrong. Please try again." : "Please take a moment to complete the form, then try again.");
      return;
    }

    const message = buildSummaryMessage();
    const payload = {
      name: formData.name.trim(),
      companyName: formData.companyName.trim(),
      email: formData.email.trim(),
      phone: formData.phone,
      message,
      service: "OOH Campaign Brief",
      configuration: formData.formats?.join("; ") || "",
      website: formData.website,
      remarks: `Company: ${formData.companyName} | Objective: ${formData.campaignObjective} | Emirates: ${formData.targetEmirates} | Budget: ${formData.budget} | Go live: ${formData.goLive} | Duration: ${formData.campaignDuration}`,
    };

    try {
      setIsLoading(true);
      setResponse("");
      const { website: _w, ...dataToSend } = payload;
      const result = await sendContactFormEmail({ ...dataToSend, website: payload.website });
      if (result.success) {
        setResponse("Thank you! We'll be in touch soon.");
        setFormData({
          campaignObjective: "",
          targetEmirates: "",
          formats: [],
          budget: "",
          goLive: "",
          campaignDuration: "",
          name: "",
          companyName: "",
          email: "",
          phone: "",
          website: "",
        });
        setFormErrors({});
        setTimeout(() => {
          navigate("/thank-you", { state: { gtmConversion: { formSource: "contact_form", formValues: dataToSend } } });
        }, 2000);
      } else {
        setResponse("Failed to send. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setResponse("Failed to send. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <section id="contact-us">
      <div className="contact-form-section">
        <div className="contact-content section-container">
          <div className="contact-info">
            <h2 className="section-tagline">CONTACT US</h2>
            <h1 className="main-title">Get Your Custom OOH Proposal</h1>
            <p className="description">
              Whether you're planning a product launch, brand awareness campaign, or looking to rent a prime billboard on Sheikh Zayed Road, our team is ready to help. Answer a few quick questions and we'll build the right outdoor media plan for you.
            </p>
            <div className="key-points">
            <div className="point">
                <div className="point-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="point-text">
                    <h4>Strategic OOH Planning</h4>
                    <p>Bespoke outdoor media plans across hoardings, unipoles, DOOH and transit.</p>
                </div>
            </div>
            <div className="point">
                <div className="point-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <div className="point-text">
                    <h4>End-to-End Execution</h4>
                    <p>Site selection, permits, production, and campaign monitoring.</p>
                </div>
            </div>
            </div>
          </div>

          <div className="qualification-form-wrap">
            <form ref={formRef} onSubmit={handleSubmit} className="qualification-form" autoComplete="on">
              <input
                type="text"
                name="website"
                className="form-honeypot"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => update("website", e.target.value)}
                aria-hidden="true"
              />

              <div className="progress-wrap">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="progress-label">Step {step} of {TOTAL_STEPS}</div>
              </div>

              {/* Step 1 – Campaign Intent */}
              <div className={`step ${step === 1 ? "active" : ""}`}>
                <div className="step-num-label">Step 1 of {TOTAL_STEPS}</div>
                <h2 className="step-title">What is your campaign objective?</h2>
                <p className="step-sub">This helps us tailor the right formats and locations for you.</p>
                <div className="options-grid">
                  {CAMPAIGN_OBJECTIVES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-card ${formData.campaignObjective === opt.value ? "selected" : ""}`}
                      onClick={() => selectSingle("campaignObjective", opt.value)}
                    >
                      <span className="option-title">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <h2 className="step-title step-title-sm">Which emirate(s) are you targeting?</h2>
                <div className="options-grid">
                  {TARGET_EMIRATES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-card ${formData.targetEmirates === opt.value ? "selected" : ""}`}
                      onClick={() => selectSingle("targetEmirates", opt.value)}
                    >
                      <span className="option-title">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="form-nav">
                  <button type="button" className="btn-next" onClick={nextStep} disabled={!canProceedStep1}>
                    Continue →
                  </button>
                </div>
              </div>

              {/* Step 2 – Format Selection */}
              <div className={`step ${step === 2 ? "active" : ""}`}>
                <div className="step-num-label">Step 2 of {TOTAL_STEPS}</div>
                <h2 className="step-title">Which outdoor formats are you interested in?</h2>
                <p className="step-sub">Select all that apply. Taxi Media and Hoardings typically suit budgets of AED 250k+.</p>
                <div className="options-grid options-grid-multi">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-card multi ${(formData.formats || []).includes(opt.value) ? "selected" : ""}`}
                      onClick={() => toggleMulti("formats", opt.value)}
                    >
                      <span className="option-title">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="form-nav">
                  <button type="button" className="btn-back" onClick={prevStep}>← Back</button>
                  <button type="button" className="btn-next" onClick={nextStep} disabled={!canProceedStep2}>
                    Continue →
                  </button>
                </div>
              </div>

              {/* Step 3 – Budget */}
              <div className={`step ${step === 3 ? "active" : ""}`}>
                <div className="step-num-label">Step 3 of {TOTAL_STEPS}</div>
                <h2 className="step-title">What is your estimated campaign budget?</h2>
                <p className="step-sub">This helps us recommend the right mix of formats and locations.</p>
                <div className="options-grid">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-card ${formData.budget === opt.value ? "selected" : ""}`}
                      onClick={() => selectSingle("budget", opt.value)}
                    >
                      <span className="option-title">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="form-nav">
                  <button type="button" className="btn-back" onClick={prevStep}>← Back</button>
                  <button type="button" className="btn-next" onClick={nextStep} disabled={!canProceedStep3}>
                    Continue →
                  </button>
                </div>
              </div>

              {/* Step 4 – Timeline & Creative */}
              <div className={`step ${step === 4 ? "active" : ""}`}>
                <div className="step-num-label">Step 4 of {TOTAL_STEPS}</div>
                <h2 className="step-title">When do you want the campaign to go live?</h2>
                <div className="options-grid">
                  {GO_LIVE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-card ${formData.goLive === opt.value ? "selected" : ""}`}
                      onClick={() => selectSingle("goLive", opt.value)}
                    >
                      <span className="option-title">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <h2 className="step-title step-title-sm">How long is the campaign duration?</h2>
                <div className="options-grid">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option-card ${formData.campaignDuration === opt.value ? "selected" : ""}`}
                      onClick={() => selectSingle("campaignDuration", opt.value)}
                    >
                      <span className="option-title">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="form-nav">
                  <button type="button" className="btn-back" onClick={prevStep}>← Back</button>
                  <button type="button" className="btn-next" onClick={nextStep} disabled={!canProceedStep4}>
                    Continue →
                  </button>
                </div>
              </div>

              {/* Step 5 – Contact Info */}
              <div className={`step ${step === 5 ? "active" : ""}`}>
                <div className="step-num-label">Step 5 of {TOTAL_STEPS}</div>
                <div className="qualifier-tag">Almost there</div>
                <h2 className="step-title">Where shall we send your proposal?</h2>
                <p className="step-sub">We'll review your brief and get back to you within 1 business day.</p>

                <div className="input-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                  />
                  {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                </div>
                <div className="input-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    placeholder="Your company or brand name"
                  />
                  {formErrors.companyName && <span className="field-error">{formErrors.companyName}</span>}
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                    />
                    {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                  </div>
                  <div className="input-group">
                    <label>Phone Number *</label>
                    <PhoneInput
                      country="ae"
                      value={formData.phone}
                      onChange={(phone) => update("phone", phone)}
                      inputProps={{ name: "phone", autoComplete: "tel" }}
                      inputStyle={{
                        width: "100%",
                        height: "48px",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#f9f9f9",
                        color: "#1a1a1a",
                        paddingLeft: "48px",
                        fontSize: "15px",
                      }}
                      buttonStyle={{
                        border: "none",
                        backgroundColor: "#f9f9f9",
                        borderRight: "1px solid #e0e0e0",
                        borderRadius: "12px 0 0 12px",
                      }}
                      containerStyle={{ width: "100%" }}
                    />
                    {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="form-nav">
                  <button type="button" className="btn-back" onClick={prevStep}>← Back</button>
                  <button type="submit" className="btn-next" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Get My Proposal →"}
                  </button>
                </div>
              </div>
            </form>

            {response && (
              <div className={`response-message ${response.includes("Thank you") ? "success" : "error"}`}>
                {response}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
