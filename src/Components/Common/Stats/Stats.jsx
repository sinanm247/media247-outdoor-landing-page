import "./Stats.scss";
import CountUp from "react-countup";
import { trackPointer } from "../../../Utils/interactions";

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
            <div className="stats-glow" aria-hidden="true" />

            <div className="stats-inner">
                <div className="stats-content" data-reveal>
                    <h2 className="section-tagline">{tagline}</h2>
                    <h3 className="stats-title">{title}</h3>
                    {description ? <p className="stats-description">{description}</p> : null}
                </div>
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.id}
                            className="stat-item"
                            data-reveal
                            style={{ "--reveal-delay": index * 120 }}
                            onMouseMove={trackPointer}
                        >
                            <span className="stat-index" aria-hidden="true">0{index + 1}</span>
                            <div className="stat-number">
                                <CountUp
                                    end={Number(stat.value)}
                                    duration={2.2}
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
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
