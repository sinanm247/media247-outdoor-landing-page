import "./CTA.scss";
import { FiArrowUpRight } from "react-icons/fi";
import { trackPointer } from "../../../Utils/interactions";
import { usePopupForm } from "../PopupForm/PopupFormContext";

const CTA_CONTENT = {
    tagline: "GET IN TOUCH",
    title: "Put Your Brand Where Dubai Can't Miss It.",
    paragraphs: [
        "Media 247 offers the UAE's most strategic OOH and digital out-of-home advertising locations — from Sheikh Zayed Road hoardings to Dubai Mall DOOH screens and the city's largest taxi media fleet. Slots fill fast. Secure your outdoor advertising placement today.",
    ],
    buttonText: "Book Your OOH Campaign",
};

export default function CTA() {
    const { tagline, title, paragraphs, buttonText } = CTA_CONTENT;
    const { openPopup } = usePopupForm();

    return (
        <section id="cta-section" className="common-cta-section" onMouseMove={trackPointer}>
            <div className="cta-stripes" aria-hidden="true" />
            <div className="cta-spotlight" aria-hidden="true" />

            <div className="cta-content" data-reveal="zoom">
                <h2 className="section-tagline">{tagline}</h2>
                <h3 className="cta-title">{title}</h3>
                <div className="cta-description">
                    {paragraphs.map((paragraph, index) => (
                        <p key={index} className="cta-paragraph">{paragraph}</p>
                    ))}
                </div>
                <button type="button" className="btn primary-btn" onClick={openPopup}>
                    {buttonText}
                    <FiArrowUpRight className="cta-btn-arrow" aria-hidden="true" />
                </button>
            </div>
        </section>
    );
}
