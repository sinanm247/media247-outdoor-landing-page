import "./CTA.scss";

const CTA_CONTENT = {
    tagline: "GET IN TOUCH",
    title: "Put Your Brand Where Dubai Can't Miss It.",
    paragraphs: [
        "Media 247 offers the UAE's most strategic OOH and digital out-of-home advertising locations — from Sheikh Zayed Road hoardings to Dubai Mall DOOH screens and the city's largest taxi media fleet. Slots fill fast. Secure your outdoor advertising placement today.",
    ],
    buttonText: "Book Your OOH Campaign",
    buttonLink: "#contact-us",
};

export default function CTA() {
    const { tagline, title, paragraphs, buttonText, buttonLink } = CTA_CONTENT;

    return (
        <section id="cta-section" className="common-cta-section">
            {/* Decorative wavy lines */}
            <div className="cta-waves" aria-hidden="true">
                <svg className="cta-wave cta-wave--left" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path d="M0,50 Q50,20 100,50 T200,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M0,60 Q60,30 120,60 T200,60" fill="none" stroke="currentColor" strokeWidth="0.4" />
                    <path d="M0,40 Q40,10 80,40 T160,40 T200,40" fill="none" stroke="currentColor" strokeWidth="0.3" />
                </svg>
                <svg className="cta-wave cta-wave--right" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path d="M0,50 Q50,80 100,50 T200,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M0,60 Q60,90 120,60 T200,60" fill="none" stroke="currentColor" strokeWidth="0.4" />
                    <path d="M0,40 Q40,70 80,40 T160,40 T200,40" fill="none" stroke="currentColor" strokeWidth="0.3" />
                </svg>
            </div>

            {/* Accent triangles */}
            <div className="cta-triangle cta-triangle--tl" aria-hidden="true" />
            <div className="cta-triangle cta-triangle--tr" aria-hidden="true" />
            <div className="cta-triangle cta-triangle--bottom" aria-hidden="true" />

            <div className="cta-content">
                <h2 className="section-tagline">{tagline}</h2>
                <h3 className="cta-title">{title}</h3>
                <div className="cta-description">
                    {paragraphs.map((paragraph, index) => (
                        <p key={index} className="cta-paragraph">{paragraph}</p>
                    ))}
                </div>
                <a href={buttonLink} className="btn primary-btn">
                    {buttonText}
                    {/* <span className="cta-btn-arrow" aria-hidden="true">→</span> */}
                </a>
            </div>
        </section>
    );
}
