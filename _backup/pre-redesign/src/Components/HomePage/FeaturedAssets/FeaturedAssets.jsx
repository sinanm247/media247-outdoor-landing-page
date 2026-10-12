import "./FeaturedAssets.scss";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { featuredCampaigns } from "../../../Datasets/featuredCampaigns";

const textVariants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } },
};

const childVariants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

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

    return (
        <section id="featured-campaigns">
            <div className="project-section section-container">
                <div className="featured-header">
                    <div className="featured-header-left">
                        <motion.span
                            variants={textVariants}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="featured-label"
                        >
                            FEATURED CAMPAIGNS
                        </motion.span>
                        <motion.h1
                            variants={textVariants}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="featured-headline"
                        >
                            Brands That Trust Media 247
                        </motion.h1>
                    </div>
                    <p className="featured-subheadline">
                        From global luxury houses to fast-growing regional names, see how leading brands use our OOH network to drive visibility across the UAE.
                    </p>
                </div>

                <div className="project-container">
                    <div className="projects-grid">
                        {projects.map((p) => (
                            <div className="project-card" key={p.id}>
                                <div className="card-image">
                                    <img src={p.image} alt={p.title} className="img-desktop" />
                                    <img src={p.image} alt={p.title} className="img-mobile" />
                                    <span className="badge-service">{p.title}</span>
                                    <div className="image-overlay" />
                                    <div className="hover-overlay">
                                        <div className="hover-content">
                                            <span className="hover-badge">{p.title}</span>
                                            <p className="hover-meta">
                                                Brand: {p.brand} | Format: {p.format}
                                            </p>
                                            <p className="hover-description">{p.location}</p>
                                            <a href="/#contact-us">
                                                <div className="btn primary-btn">Get A Quote</div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
