import "./AboutUsSection.scss";
import img1 from "../../../assets/Services-Assets/Digital-Outdoor-Media.webp";
import { trackTilt, resetTilt } from "../../../Utils/interactions";

const AboutUsSection = () => {
    return (
        <section id="about-us" className="about-us-section section-container">
            <div className="about-us-wrapper">
                {/* Image - Left Side */}
                <div className="about-image" data-reveal="left">
                    <div
                        className="billboard"
                        onMouseMove={(e) => trackTilt(e, 5)}
                        onMouseLeave={resetTilt}
                    >
                        <span className="billboard-lamp billboard-lamp--left" aria-hidden="true" />
                        <span className="billboard-lamp billboard-lamp--right" aria-hidden="true" />
                        <div className="billboard-panel">
                            <img src={img1} alt="Media247 Digital" />
                        </div>
                        <span className="billboard-pole" aria-hidden="true" />
                    </div>
                </div>

                {/* Content - Right Side */}
                <div className="about-content" data-reveal="right">
                    <h2 className="section-tagline">WHY MEDIA 247</h2>
                    <h1 className="section-title">
                        15+ Years of Making Brands Impossible to Ignore
                    </h1>
                    <div className="content-wrapper">
                        <p className="section-description">
                            Media 247 is a leading outdoor advertising company in the United Arab Emirates, operating one of the most premium OOH media networks in the region. With over 75 strategic outdoor and digital sites - spanning hoardings, unipoles, glass graphics, wall backlits, lamp posts, DOOH screens, and transit taxi media - we offer brands the coverage, visibility, and scale they need to win in one of the world's most competitive markets.
                        </p>
                        <p className="section-description">
                            Backed by 15+ years of OOH expertise, we work with global brands, regional leaders, and ambitious challengers alike - delivering end-to-end campaign management from strategic site selection to flawless print production and installation. Our media network is purposefully built around Dubai's highest-footfall corridors, including Sheikh Zayed Road, City Walk, Dubai Mall, and key arterials across the Emirates.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
