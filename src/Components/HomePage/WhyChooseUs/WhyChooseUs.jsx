import "./WhyChooseUs.scss";

const WhyChooseUs = () => {
    return (
        <section id="why-choose-us" className="why-choose-us-section section-container">
            <div className="why-choose-us-wrapper">
                <h2 className="section-tagline">Why Choose Us</h2>
                <h1 className="section-title">
                    Our Commitment to You
                </h1>

                <div className="vision-mission-section">
                    <div className="vision-mission-item">
                        <h3 className="subsection-title">Our Vision</h3>
                        <p className="subsection-description">
                            Developing collaborative partnerships centered around our clients' needs, providing tailored solutions that ensure satisfaction and effectively address all challenges.
                        </p>
                    </div>

                    <div className="vision-mission-item">
                        <h3 className="subsection-title">Our Mission</h3>
                        <p className="subsection-description">
                            Offering personalized mortgage solutions with exceptional service and support at every stage, ensuring a stress-free experience through clear communication and expert guidance.
                        </p>
                    </div>
                </div>

                <div className="values-section">
                    <h3 className="subsection-title">Our Values</h3>
                    <ul className="values-list">
                        <li className="value-item">
                            <strong>Transparency:</strong> Building trust through honesty and integrity in all our relationships.
                        </li>
                        <li className="value-item">
                            <strong>Personalised Approach:</strong> Delivering tailored service that exceeds expectations.
                        </li>
                        <li className="value-item">
                            <strong>Professionalism:</strong> Upholding the highest standards with expert mortgage solutions.
                        </li>
                        <li className="value-item">
                            <strong>Commitment to Excellence:</strong> Continuously improving to better serve our clients.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

