import "./FeaturedAssets.scss";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { featuredCampaigns } from "../../../Datasets/featuredCampaigns";

const pad = (n) => String(n).padStart(2, "0");

export default function FeaturedAssets() {
    const projects = featuredCampaigns.map((item) => ({
        id: item.id,
        image: item.featuredImage,
        title: item.title,
        brand: item.brand,
        format: item.format,
        location: item.location,
        slug: item.slug,
    }));

    const [active, setActive] = useState(0);
    const itemRefs = useRef([]);

    // Whichever row crosses the middle band of the viewport becomes active
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
                });
            },
            { rootMargin: "-45% 0px -45% 0px" }
        );
        itemRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section id="featured-campaigns" className="featured-section">
            <div className="featured-header" data-reveal>
                <div className="featured-header-left">
                    <span className="featured-label">FEATURED CAMPAIGNS</span>
                    <h1 className="featured-headline">Brands That Trust Media 247</h1>
                </div>
                <p className="featured-subheadline">
                    From global luxury houses to fast-growing regional names, see how leading brands use our OOH network to drive visibility across the UAE.
                </p>
            </div>

            <div className="featured-layout">
                <div className="featured-preview" aria-hidden="true">
                    <div className="featured-frame">
                        {projects.map((p, index) => (
                            <img
                                key={p.id}
                                src={p.image}
                                alt=""
                                className={`featured-frame-image ${index === active ? "is-active" : ""}`}
                            />
                        ))}
                        <span className="featured-frame-corner featured-frame-corner--tl" />
                        <span className="featured-frame-corner featured-frame-corner--br" />
                        <div className="featured-frame-caption">
                            <span className="featured-frame-count">
                                {pad(active + 1)} <em>/ {pad(projects.length)}</em>
                            </span>
                            <span className="featured-frame-brand">{projects[active].brand}</span>
                        </div>
                    </div>
                </div>

                <ol className="featured-list">
                    {projects.map((p, index) => (
                        <li
                            key={p.id}
                            ref={(el) => (itemRefs.current[index] = el)}
                            data-index={index}
                            className={`featured-item ${index === active ? "is-active" : ""}`}
                            onMouseEnter={() => setActive(index)}
                        >
                            <div className="featured-item-media">
                                <img src={p.image} alt={p.title} loading="lazy" />
                            </div>
                            <span className="featured-item-num">{pad(index + 1)}</span>
                            <div className="featured-item-body">
                                <h3 className="featured-item-title">{p.title}</h3>
                                <p className="featured-item-meta">
                                    Brand: {p.brand} | Format: {p.format}
                                </p>
                                <p className="featured-item-location">{p.location}</p>
                                <a href="/#contact-us" className="btn primary-btn featured-item-btn">
                                    Get A Quote
                                    <FiArrowUpRight aria-hidden="true" />
                                </a>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
