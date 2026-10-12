import "./Services.scss";

const Services = () => {
    const services = [
        {
            id: 1,
            title: "Primary Sale",
            description: "Properties that are sold by the developer directly for the first time are referred to as the Primary Sale, sometimes called the First Sale. This tag makes it easier for anyone looking to acquire real estate to find chances to buy brand-new, undeveloped properties directly from the source."
        },
        {
            id: 2,
            title: "Off-Plan Properties",
            description: "These mortgages are specifically intended for clients who have unfinished properties; they can assist people who are building their own villas or own properties in buildings that are still under construction, sometimes known as off-plan properties."
        },
        {
            id: 3,
            title: "Under Construction Properties",
            description: "Our under construction mortgages are intended especially for clients who are investing in still-developing homes or who are constructing their own villas. These mortgages offer the required financial assistance to guarantee that your project proceeds without hiccups from beginning to end."
        },
        {
            id: 4,
            title: "Resale",
            description: "With our low-documentation unique mortgage offerings, we can help if you're wanting to buy in Dubai, Abu Dhabi, or anyplace else in the United Arab Emirates."
        },
        {
            id: 5,
            title: "Refinance / Equity",
            description: "If you presently owe too much on your mortgage, we can help you refinance it or release equity from a home you already own."
        },
        {
            id: 6,
            title: "Buyout",
            description: "Purchase mortgages are intended for clients wishing to move their current home loan from one bank to another. With this choice, homeowners can take advantage of better loan amounts or cheaper interest rates from various financial organizations."
        }
    ];

    return (
        <section id="services" className="services-section section-container">
            <div className="services-wrapper">
                <h2 className="section-tagline">Our Services</h2>
                <h1 className="section-title">
                    We Provide the Best Mortgage Services
                </h1>
                
                <p className="section-description">
                    Take benefit from a variety of attractive mortgage rates, including low down payments, high mortgage amounts, cheap fees, and fixed and variable rate options. You'll receive fantastic advantages and our mortgage specialists will be there for you at every turn, offering advice on the right mortgage for you.
                </p>

                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-number">{String(service.id).padStart(2, '0')}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                        </div>
                    ))}
                </div>

                <div className="islamic-note">
                    <div className="note-icon">🕌</div>
                    <p className="note-text">
                        Rest assured, our offerings adhere to Islamic financial principles. In addition to conventional financing, we provide Shariah-compliant options across all our services.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Services;

