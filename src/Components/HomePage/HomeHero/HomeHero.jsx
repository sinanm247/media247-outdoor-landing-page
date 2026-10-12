import "./HomeHero.scss";
import { useState, useRef, useEffect } from "react";
import { TextField, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sendContactFormEmail, sendToGoogleSheets } from "../../../Utils/emailService";
import bannerImage from "../../../assets/Banners/Banner.webp"
import bannerVideo from "../../../assets/Banners/Banner-Video.mp4"
import { FiArrowUpRight } from "react-icons/fi";
import { trackPointer } from "../../../Utils/interactions";

const BOT_MIN_SECONDS = 3;

const HERO_FORMATS = [
  "Hoardings",
  "Unipoles",
  "Digital OOH Screens",
  "Transit Media",
  "Lamp Posts",
  "Glass Graphics",
  "Wall Backlits",
];

export default function HomeHero() {
  const navigate = useNavigate();
  const formOpenTimeRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    service: '',
    website: '', // honeypot: leave empty; bots often fill it
  });
  const [formErrors, setFormErrors] = useState({});
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    formOpenTimeRef.current = Date.now();
  }, []);

  // Sync browser autofill into React state so all fields stay filled when user picks a saved profile
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
    form.addEventListener('change', syncAutofill);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      form.removeEventListener('change', syncAutofill);
    };
  }, []);

  const errors = {};

  const validateErrors = () => {
    if (formData?.name?.trim()?.length === 0) errors.name = "Name is Required";
    if (formData?.phone?.trim()?.length === 0) errors.phone = "Phone No is Required";
    if (formData?.email?.trim()?.length === 0) errors.email = "Email is Required";
    if (formData?.message?.trim()?.length === 0) errors.message = "Message is Required";
  };

  const handleUpdate = (field) => (event) => {
    const inputValue = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: inputValue }));
  };

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
          phone: "",
          email: "",
          message: "",
          service: "",
          website: "",
        });
        setFormErrors({});
        setTimeout(() => {
          navigate("/thank-you", { state: { gtmConversion: { formSource: "home_hero", formValues: dataToSend } } });
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

    // Bot: still write to sheet for tracking; show error and do not navigate to thank-you
    if (isHoneypotBot || isTimingBot) {
      const botMessageField = isHoneypotBot ? String(formData.website).trim() : "submitted_too_fast";
      await sendToGoogleSheets({
        name: formData.name || "",
        phone: formData.phone || "",
        email: formData.email || "",
        message: formData.message || "",
        service: formData.service || "",
        source: "Contact Form",
        botMessageField,
      });
      setResponse(isHoneypotBot ? "Something went wrong. Please try again." : "Please take a moment to complete the form, then try again.");
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
    <div className="home-hero" onMouseMove={trackPointer}>
      <div className="banner-container">
        <img
          className="banner-image"
          src={bannerImage}
          alt="Media247 Outdoor"
        />
        <video
          className={`banner-video ${videoReady ? "banner-video--ready" : ""}`}
          src={bannerVideo}
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoReady(true)}
        />
        <div className="overlay" aria-hidden="true"></div>
        <div className="hero-spotlight" aria-hidden="true"></div>
      </div>
      
      <div className="hero-content-wrapper">
        {/* Left Side - Content */}
        <div className="hero-content-left">
          <div className="hero-content">
            <h2 className="hero-subtitle">
              <span className="live-dot" aria-hidden="true"></span>
              UAE's #1 Outdoor Advertising - Hoardings, Unipoles, DOOH & Transit Media.
            </h2>
            <h1 className="hero-title">
              <span className="hero-title-line">Your Brand.</span>{" "}
              <span className="hero-title-line">Every Road.</span>{" "}
              <span className="hero-title-line hero-title-line--accent">Every Eye.</span>
            </h1>
            <p className="hero-description">
              Media 247 is Dubai's premier OOH advertising company, offering 75+ strategic outdoor and digital OOH locations across the UAE. From iconic billboard sites on Sheikh Zayed Road to airport-to-city taxi media, we connect your brand to the audiences that matter. Let's get you seen.
            </p>
            <a href="#contact-us" className="btn primary-btn hero-cta-btn">
              Book Your OOH Campaign
              <FiArrowUpRight className="btn-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <a href="#contact-us" className="hero-scroll-cue" aria-label="Scroll down">
          <span className="hero-scroll-cue-wheel" />
        </a>

        {/* Right Side - Contact Form */}
        {/* <div className="hero-content-right">
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form" autoComplete="on">
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
            <h1 className="title">Start Your Digital<br />Marketing Journey</h1>
            <p className="form-description">Fill out the form below and our digital marketing experts will contact you within 24 hours to discuss how we can maximize your online potential.</p>

            <TextField
              label="Name"
              variant="outlined"
              value={formData.name}
              onChange={handleUpdate('name')}
              fullWidth
              className="form-field"
              required
              inputProps={{ name: "name", autoComplete: "name" }}
            />
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            
            <PhoneInput
              country={"ae"}
              value={formData.phone}
              onChange={(phone) => {
                setFormData((prev) => ({ ...prev, phone }));
              }}
              inputProps={{
                name: "phone",
                autoComplete: "tel",
                required: true,
              }}
              inputStyle={{
                width: "100%",
                height: "56px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "transparent",
                color: "white",
                paddingLeft: "50px",
                fontSize: "16px",
                fontFamily: '"GT-Ultra", sans-serif',
              }}
              buttonStyle={{
                border: "none",
                backgroundColor: "transparent",
                borderRight: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "20px 0 0 20px",
              }}
              containerStyle={{
                width: "100%",
              }}
              dropdownStyle={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              searchStyle={{
                backgroundColor: "black",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            />

            {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}

            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleUpdate('email')}
              fullWidth
              className="form-field"
              required
              inputProps={{ name: "email", autoComplete: "email" }}
            />
            {formErrors.email && <div className="error-message">{formErrors.email}</div>}

            <TextField 
              select 
              label="Service Type" 
              variant="outlined" 
              value={formData.service} 
              onChange={handleUpdate('service')} 
              fullWidth 
              className="form-field"
            >
              <MenuItem value="SEO & Content">SEO & Content</MenuItem>
              <MenuItem value="PPC & SEM">PPC & SEM</MenuItem>
              <MenuItem value="Programmatic Ads">Programmatic Ads</MenuItem>
              <MenuItem value="Social Media Marketing">Social Media Marketing</MenuItem>
              <MenuItem value="Media Production">Media Production</MenuItem>
              <MenuItem value="Website Development">Website Development</MenuItem>
            </TextField>
            {formErrors.service && <div className="error-message">{formErrors.service}</div>}

            <TextField label="Message" variant="outlined" multiline rows={4} value={formData.message} onChange={handleUpdate('message')} fullWidth className="form-field" required />
            {formErrors.message && <div className="error-message">{formErrors.message}</div>}

            <button type="submit" className="btn btn-glass" disabled={isLoading}>
              {isLoading ? "Sending..." : "Submit Inquiry"}
            </button>
            {response && (
              <div className={`response-message ${response.includes("successfully") ? "success" : "error"}`}>
                {response}
              </div>
            )}
          </form>
        </div> */}
      </div>

      <div className="hero-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          {[...HERO_FORMATS, ...HERO_FORMATS].map((format, index) => (
            <span
              className={`hero-ticker-item ${index % 2 ? "hero-ticker-item--outline" : ""}`}
              key={index}
            >
              {format}
              <span className="hero-ticker-sep" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}