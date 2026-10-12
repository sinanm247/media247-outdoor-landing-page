import "./Process.scss";

const Process = () => {
    const steps = [
        {
            id: 1,
            title: "Select Your Sum",
            description: "Start by deciding on the loan amount that best fits your objectives and financial situation. We offer flexible mortgage loans in Dubai to meet your needs."
        },
        {
            id: 2,
            title: "Deliver Your Files",
            description: "Collect the necessary documents for your loan application, such as identification, income verification, and any other relevant paperwork."
        },
        {
            id: 3,
            title: "Apply Review Loan",
            description: "Complete our online application form. Our team will quickly review it to find the best mortgage loans in Dubai for you."
        },
        {
            id: 4,
            title: "Bank Loan Approval",
            description: "We secure approval from our financial network. Upon approval, you'll receive instructions to access your funds. We're here to help."
        }
    ];

    return (
        <section id="process" className="process-section section-container">
            <div className="process-wrapper">
                <h2 className="section-tagline">Our Process</h2>
                <h1 className="section-title">
                    Fast & Easy Loan Process Here
                </h1>
                
                <p className="section-description">
                    At ICB, we recognize that time is of the utmost importance when obtaining financial aid. For your convenience, we have streamlined the loan application procedure to make it as quick and easy as possible.
                </p>

                <div className="process-steps">
                    {steps.map((step) => (
                        <div key={step.id} className="process-step">
                            <div className="step-number-wrapper">
                                <div className="step-number">{step.id}</div>
                            </div>
                            <div className="step-content">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;

