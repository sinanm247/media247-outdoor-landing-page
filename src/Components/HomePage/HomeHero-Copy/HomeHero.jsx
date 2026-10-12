import "./HomeHero.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiUser, FiBriefcase, FiMail, FiPhone, FiLayers } from "react-icons/fi";
import { sendContactFormEmail, sendToGoogleSheets } from "../../../Utils/emailService";
import bannerImage from "../../../assets/Banners/Banner-2.webp";
import googleIcon from "../../../assets/Common/google-icon.png";

const BOT_MIN_SECONDS = 3;

export default function HomeHero() {
  const navigate = useNavigate();
  const formOpenTimeRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    website: "", // honeypot
  });
  const [consent, setConsent] = useState(false);
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
      const companyEl = formRef.current.querySelector('input[name="company"]');
      setFormData((prev) => {
        const next = { ...prev };
        if (nameEl?.value?.trim()) next.name = nameEl.value.trim();
        if (emailEl?.value?.trim()) next.email = emailEl.value.trim();
        if (phoneEl?.value?.trim()) next.phone = phoneEl.value.trim();
        if (companyEl?.value?.trim()) next.company = companyEl.value.trim();
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

  const validateErrors = () => {
    if (formData?.name?.trim()?.length === 0) errors.name = "Name is required";
    if (formData?.phone?.trim()?.length === 0) errors.phone = "Phone is required";
    if (formData?.email?.trim()?.length === 0) errors.email = "Email is required";
    if (!formData?.service?.trim()) errors.service = "Please select a service";
    if (!consent) errors.consent = "Please agree to the terms";
  };

  const SERVICE_OPTIONS = [
    "SEO & Content",
    "PPC & SEM",
    "Programmatic Ads",
    "Social Media Marketing",
    "Media Production",
    "Website Development",
  ];

  const handleUpdate = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSendEmail = async (payload) => {
    try {
      setIsLoading(true);
      setResponse("");
      const { website: _honeypot, ...rest } = payload;
      const result = await sendContactFormEmail({
        ...rest,
        message: rest.company ? `Company: ${rest.company}` : "",
        service: rest.service || "",
      });
      if (result.success) {
        setResponse("Email sent successfully!");
        setFormData({
          name: "",
          company: "",
          phone: "",
          email: "",
          service: "",
          website: "",
        });
        setConsent(false);
        setFormErrors({});
        setTimeout(() => navigate("/thank-you"), 3000);
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
        message: formData.company ? `Company: ${formData.company}` : "",
        service: formData.service || "",
        source: "Contact Form",
        botMessageField,
      });
      setResponse(
        isHoneypotBot
          ? "Something went wrong. Please try again."
          : "Please take a moment to complete the form, then try again."
      );
      return;
    }

    validateErrors();
    if (Object.keys(errors).length === 0) {
      handleSendEmail(formData);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="home-hero">
      <div className="hero-banner-bg">
        <img src={bannerImage} alt="" className="hero-banner-img" aria-hidden />
        <div className="hero-banner-overlay" aria-hidden />
        <div className="hero-content-wrapper">
          <div className="hero-content-left">
          <div className="hero-heading-box">
            <h1 className="hero-title">
              Media247 Digital
              <br />
              <span className="hero-title-sub">Maximizing Your Online Potential</span>
            </h1>
          </div>
        </div>

        <div className="hero-content-right">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="hero-contact-form"
            autoComplete="on"
          >
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

            <div className="form-field-row">
              <FiUser className="form-icon" aria-hidden />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleUpdate("name")}
                placeholder="Last name / First name *"
                className="form-input-underline"
                autoComplete="name"
                required
              />
            </div>
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}

            <div className="form-field-row">
              <FiBriefcase className="form-icon" aria-hidden />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleUpdate("company")}
                placeholder="Company"
                className="form-input-underline"
                autoComplete="organization"
              />
            </div>

            <div className="form-row-two">
              <div className="form-field-row half">
                <FiMail className="form-icon" aria-hidden />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleUpdate("email")}
                  placeholder="E-mail *"
                  className="form-input-underline"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-field-row half form-phone-wrap">
                <FiPhone className="form-icon" aria-hidden />
                <PhoneInput
                  country={"ae"}
                  value={formData.phone}
                  onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                  inputProps={{
                    name: "phone",
                    autoComplete: "tel",
                    required: true,
                    placeholder: "Phone *",
                  }}
                  inputClass="form-input-underline form-phone-input"
                  containerClass="form-phone-container"
                  buttonClass="form-phone-button"
                />
              </div>
            </div>
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}
            {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}

            <div className="form-field-row">
              <FiLayers className="form-icon" aria-hidden />
              <select
                name="service"
                value={formData.service}
                onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))}
                className="form-input-underline form-select"
                required
              >
                <option value="">Service *</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.service && <div className="error-message">{formErrors.service}</div>}

            <p className="form-required-note">* Required fields</p>

            <label className="form-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="form-consent-checkbox"
              />
              <span className="form-consent-text">
                I agree that the information entered may be used in the context of the contact
                request and the commercial relationship that may result from it.
              </span>
            </label>
            {formErrors.consent && <div className="error-message">{formErrors.consent}</div>}

            <button type="submit" className="hero-form-submit-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>

            {response && (
              <div
                className={`response-message ${
                  response.includes("successfully") ? "success" : "error"
                }`}
              >
                {response}
              </div>
            )}
          </form>
        </div>
        </div>
        <div className="hero-google-review">
          <div className="content">
            <div className="avatars">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="avatar" aria-hidden />
              ))}
            </div>
            <p className="text">Chosen By UAE Business Builders</p>
          </div>
          <div className="divider" aria-hidden />
          <div className="rating">
            <img src={googleIcon} alt="Google" className="logo" aria-label="Google" />
            {/* <svg className="logo" viewBox="0 0 24 24" aria-label="Google">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg> */}
            <div className="score-row">
              <span className="score">5.0</span>
              <span className="stars" aria-hidden>★★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
