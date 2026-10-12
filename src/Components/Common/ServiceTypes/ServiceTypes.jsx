import { useState } from "react";
import "./ServiceTypes.scss";

import image1 from "../../../assets/Services/seo-content.webp";
import image2 from "../../../assets/Services/digital-marketing.webp";
import image3 from "../../../assets/Services/programatic-ads.jpeg";
import image4 from "../../../assets/Services/social-media-marketing.webp";
import image5 from "../../../assets/Services/media-production.webp";
import image6 from "../../../assets/Services/website-development.webp";




const serviceTypes = [
    {
        id: 1,
        name: "SEO & Content",
        description: "Boost your search rankings with optimized content and strategic SEO that drives organic traffic.",
        image: image1,
    },
    {
        id: 2,
        name: "PPC & SEM",
        description: "Maximize ROI with targeted paid campaigns on Google and other search platforms.",
        image: image2,
    },
    {
        id: 3,
        name: "Programmatic Ads",
        description: "Reach your audience at scale with automated, data-driven advertising across multiple channels.",
        image: image3,
    },
    {
        id: 4,
        name: "Social Media Marketing",
        description: "Engage and grow your audience with strategic social media campaigns and compelling content.",
        image: image4,
    },
    {
        id: 5,
        name: "Media Production",
        description: "Create stunning visuals, videos, and multimedia content that captivates your audience.",
        image: image5,
    },
    {
        id: 6,
        name: "Website Development",
        description: "Build responsive, high-performing websites that convert visitors into customers.",
        image: image6,
    },
];

export default function ServiceTypes() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="services" className="service-types">
            <div className="service-types-inner">
                <div className="service-types-header">
                <h2 className="section-tagline">Our Services</h2>
                    <h1 className="section-title">What We Do</h1>
                    <p className="section-description">
                        We are a team of creatives excelling in the social media sphere.
                        With 4.8 billion social media users worldwide, the opportunity is immense.
                        Get in touch today to see how we can help you grow.
                    </p>
                </div>

                <div className="service-types-content">
                    <div className="service-types-image-outer">
                        <div className="service-types-image-bg" aria-hidden="true" />
                        <div className="service-types-image-wrap">
                            <div
                                className="service-types-image-strip"
                                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                            >
                                {serviceTypes.map((service) => (
                                    <div key={service.id} className="service-types-image-item">
                                        <img src={service.image} alt={service.name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="service-types-list">
                        {serviceTypes.map((service, index) => (
                            <div
                                key={service.id}
                                className={`service-types-item ${index === activeIndex ? "active" : ""}`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <div className="service-types-item-text">
                                    <h3 className="service-types-item-title">{service.name}</h3>
                                    <p className="service-types-item-desc">{service.description}</p>
                                </div>
                                <div className="service-types-item-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 17L17 7" />
                                        <path d="M7 7h10v10" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
