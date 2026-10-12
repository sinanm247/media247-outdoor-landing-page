import logo from "../../../assets/Logo/m247-outdoor-logo.png"
import { useLocation } from "react-router-dom";
import "./Footer.scss"

import { FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri"
import { navLinks } from "../../../Utils/App.util";

export default function Footer() {
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    const handleNavClick = (e, path) => {
        if (path.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(path);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const formatLinkText = (text) => {
        // Convert "ABOUT US" to "About Us", "CONTACT US" to "Contact Us", etc.
        return text.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const services = [
        "Hoardings",
        "Unipoles",
        "Digital OOH Screens",
        "Transit Media (Taxis & Buses)",
        "Lamp Post Banners",
        "Glass Graphics",
        "Wall Backlit"
    ];

    const whyChooseUs = [
        "Prime locations across the UAE",
        "75+ outdoor & digital OOH sites",
        "High-frequency reach on key roads",
        "End-to-end campaign management",
        "Creative, high-impact formats",
        "Transparent reporting & support"
    ];

    return (
        <footer className="footer">
            <div className="footer_row">
                {/* Column 1: Logo and Description */}
                <div className="footer_col contact_us_col">
                    <div className="contact_content">
                        <img src={logo} className="company_logo" alt="Media 247 Outdoor" />
                        <div className="contact_details_group">
                            <p className="description">
                                Media 247 is Dubai&apos;s premier OOH advertising company, offering 75+ strategic outdoor and digital OOH locations across the UAE. From iconic billboard sites on Sheikh Zayed Road to airport-to-city taxi media, we connect your brand to the audiences that matter. Let&apos;s get you seen.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer_col">
                    <h2 className="head">Quick Links</h2>
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    className="footer-link"
                                >
                                    {formatLinkText(link.name)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Our Services */}
                <div className="footer_col">
                    <h2 className="head">Our Services</h2>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}>{service}</li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Why Choose Us */}
                <div className="footer_col">
                    <h2 className="head">Why Choose Us</h2>
                    <ul>
                        {whyChooseUs.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Disclaimer Section */}
            <div className="footer_disclaimer">
                <p>
                    Media 247 specializes in premium out-of-home and digital OOH advertising across the UAE. We help brands own the skyline with impactful hoardings, unipoles, lamp posts, glass graphics, and transit media that drive real-world reach and brand impact.
                </p>
            </div>

            {/* Bottom Footer Section */}
            <div className="bottom_footer">
                <div className="left_section">
                    <a href="#" className="footer-legal-link">Privacy Policy</a>
                    <span className="separator">|</span>
                    <a href="#" className="footer-legal-link">Terms & Conditions</a>
                </div>
                <div className="social_links">
                    <a href="#"><FaFacebook /></a>
                    <a href="#"><RiInstagramFill /></a>
                    <a href="#"><FaYoutube /></a>
                    <a href="#"><FaLinkedin /></a>
                    <a href="#"><FaTiktok /></a>
                </div>
                <div className="right_section">
                    <p>© {currentYear}. All Rights Reserved by Media 247.</p>
                </div>
            </div>
        </footer>
    );
}