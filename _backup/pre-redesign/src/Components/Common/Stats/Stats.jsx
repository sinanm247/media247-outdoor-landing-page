import "./Stats.scss";

const STATS_CONTENT = {
    tagline: "BY THE NUMBERS",
    title: "When brands need outdoor advertising that performs, they choose Media 247.",
    description: "",
    stats: [
        { id: 1, value: "75", suffix: "+", label: "Premium OOH Locations Across the UAE" },
        { id: 2, value: "15", suffix: "+", label: "Years of Outdoor Advertising Expertise" },
        { id: 3, value: "60", suffix: "%", label: "Market Share in Dubai Taxi Transit Media" },
    ],
};

export default function Stats() {
    const { tagline, title, description, stats } = STATS_CONTENT;

    return (
        <section id="stats" className="stats-section">
            {/* Decorative wavy lines (right side) */}
            <div className="stats-waves" aria-hidden="true">
                <svg className="stats-wave" viewBox="0 0 200 100" preserveAspectRatio="none">
                    <path d="M0,50 Q50,20 100,50 T200,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M0,60 Q60,30 120,60 T200,60" fill="none" stroke="currentColor" strokeWidth="0.4" />
                    <path d="M0,40 Q40,10 80,40 T160,40 T200,40" fill="none" stroke="currentColor" strokeWidth="0.3" />
                </svg>
            </div>

            <div className="stats-inner">
                <div className="stats-content">
                    <h2 className="section-tagline">{tagline}</h2>
                    <h3 className="stats-title">{title}</h3>
                    {description ? <p className="stats-description">{description}</p> : null}
                </div>
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-item">
                            <div className="stat-number">
                                {stat.value}
                                <span className="stat-suffix">{stat.suffix}</span>
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
