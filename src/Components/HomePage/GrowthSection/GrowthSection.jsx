import "./GrowthSection.scss";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function GrowthSection() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Scroll to contact form or navigate
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="growth-section section-container">
      <div className="growth-wrapper">
        {/* Header Section */}
        {/* <div className="growth-header">
          <h2 className="section-tagline">Growth</h2>
          <h1 className="section-title">Spark Your Growth</h1>
          <p className="section-description">
            Stuck in a rut? Enter your industry and let our AI generate custom marketing ideas for you in seconds.
          </p>
        </div> */}

        {/* Stats Cards Grid */}
        <div className="stats-cards-grid">
          {/* Left Card - Case Study */}
          <div className="stat-card case-study-card">
            <div className="card-header">
              <button className="case-study-btn">Case Study</button>
              <FaArrowUpRightDots className="arrow-icon" />
            </div>
            <div className="card-content">
              <span className="card-label">INCREASED</span>
              <h2 className="card-value">50%</h2>
              <p className="card-description">Conversion Rate Optimization</p>
              <span className="card-tag">FOR REAL ESTATE</span>
            </div>
            <div className="card-pattern"></div>
          </div>
          <div className="right-side-cards">
            <div className="top-side-cards">
              {/* Middle Card - Red */}
              <div className="stat-card red-card">
                <p className="card-label">Leads Generating</p>
                <h2 className="card-value">23,265</h2>
              </div>

              {/* Right Card - Black */}
              <div className="stat-card black-card">
                <p className="card-label">Real Estate leads closures</p>
                <h2 className="card-value">700+</h2>
              </div>
            </div>
            {/* CTA Card */}
            <div className="cta-card">
              <div className="cta-pattern"></div>
              {/* <FaArrowUpRightDots className="cta-arrow-icon" /> */}
              <div className="cta-content">
                <p className="cta-text">Let's discuss your project over a coffee. Book a meeting today.</p>
                <button className="cta-button" onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

