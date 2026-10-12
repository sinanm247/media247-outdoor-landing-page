import "./Assets.scss";
import { useRef } from "react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { trackPointer, useHorizontalScroll } from "../../../Utils/interactions";

import hoardingsImg from "../../../assets/Services-Assets/Hoardings.webp";
import unipolesImg from "../../../assets/Services-Assets/Unipoles.webp";
import glassGraphicsImg from "../../../assets/Services-Assets/Glass-Graphics.webp";
import lampPostImg from "../../../assets/Services-Assets/Lamp-Post.webp";
import transitMediaImg from "../../../assets/Services-Assets/Transit-Media.webp";
import digitalOutdoorImg from "../../../assets/Services-Assets/Digital-Outdoor-Media.webp";
import wallBacklitsImg from "../../../assets/Services-Assets/Wall-Backlits.webp";

const assets = [
  {
    id: 1,
    name: "Hoardings",
    description:
      "40+ premium outdoor hoardings across Dubai's most high-traffic corridors, including dominant positions along Sheikh Zayed Road. Large-format hoarding advertising built for impact at scale, putting your brand in front of millions every day.",
    image: hoardingsImg,
  },
  {
    id: 2,
    name: "Unipoles",
    description:
      "Towering unipole structures along major UAE highways and arterial routes. Ideal for brands that need maximum billboard visibility, extensive coverage, and high-speed audience reach across the city's most congested traffic corridors.",
    image: unipolesImg,
  },
  {
    id: 3,
    name: "Glass Graphics",
    description:
      "Premium glass graphic advertising formats positioned in high-dwell-time environments. These eye-level brand canvases command attention with striking visual impact. Ideal for luxury brands, property launches, and premium product campaigns.",
    image: glassGraphicsImg,
  },
  {
    id: 4,
    name: "Lamp Posts",
    description:
      "A tightly networked lamp post advertising solution spanning Sheikh Zayed Road and Deira. Continuous, repetitive brand exposure along Dubai's most travelled routes ensures your campaign stays top of mind throughout the customer journey.",
    image: lampPostImg,
  },
  {
    id: 5,
    name: "Transit Media (Taxis)",
    description:
      "Dubai's largest taxi advertising fleet commanding 60% market share. With airport-to-city coverage and full visibility across major highways and residential zones, transit media delivers your brand message from touchpoint to touchpoint, 24 hours a day.",
    image: transitMediaImg,
  },
  {
    id: 6,
    name: "Digital OOH (DOOH)",
    description:
      "High-resolution digital outdoor screens in premium, high-footfall UAE locations including the Dubai Mall digital unipole. Dynamic, data-driven digital OOH advertising that enables real-time creative updates, contextual targeting, and unrivalled brand recall.",
    image: digitalOutdoorImg,
  },
  {
    id: 7,
    name: "Wall Backlits",
    description:
      "High-visibility backlit wall formats in prime urban environments, offering bold, always-on brand display that works day and night. A powerful choice for long-term outdoor branding campaigns across the UAE.",
    image: wallBacklitsImg,
  },  
];

const pad = (n) => String(n).padStart(2, "0");

export default function Assets() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const counterRef = useRef(null);

  useHorizontalScroll(sectionRef, trackRef, (progress) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
    if (counterRef.current) {
      counterRef.current.textContent = pad(Math.round(progress * (assets.length - 1)) + 1);
    }
  });

  return (
    <section id="assets" className="assets-section" ref={sectionRef}>
      <div className="assets-sticky">
        <div className="assets-viewport">
          <div className="assets-track" ref={trackRef}>
            <div className="assets-header">
              <h2 className="assets-label">OUR ASSETS</h2>
              <h3 className="assets-intro-headline">
                Every Format. Every Location. Maximum Impact.
              </h3>
              <p className="assets-intro-body">
                From towering outdoor hoardings on Sheikh Zayed Road to precision-targeted digital OOH screens in Dubai's most iconic destinations - Media 247's asset portfolio gives your brand an unmissable presence across the full UAE landscape.
              </p>
              <span className="assets-scroll-hint" aria-hidden="true">
                <FiArrowRight />
              </span>
            </div>

            {assets.map((asset, index) => (
              <article key={asset.id} className="assets-card" onMouseMove={trackPointer}>
                <div className="assets-card-media">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="assets-card-image"
                    loading="lazy"
                  />
                  <span className="assets-card-index" aria-hidden="true">{pad(index + 1)}</span>
                </div>
                <div className="assets-card-info">
                  <h3 className="assets-card-title">
                    {asset.name}
                    <FiArrowUpRight className="assets-card-arrow" aria-hidden="true" />
                  </h3>
                  <p className="assets-card-description">{asset.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="assets-progress" aria-hidden="true">
          <span className="assets-progress-count" ref={counterRef}>01</span>
          <span className="assets-progress-bar">
            <span className="assets-progress-fill" ref={fillRef} />
          </span>
          <span className="assets-progress-total">{pad(assets.length)}</span>
        </div>
      </div>
    </section>
  );
}
