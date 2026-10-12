import { useState, useEffect } from "react";
import "./Portfolio.scss";

const portfolioItems = [
    {
        id: 1,
        name: "Floozie Cookies",
        serviceType: "SEO & Content",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    },
    {
        id: 2,
        name: "Imtiaz Developments",
        serviceType: "PPC & SEM",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    },
    {
        id: 3,
        name: "The Ritz-Carlton Residences",
        serviceType: "Social Media Marketing",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    },
    {
        id: 4,
        name: "Eco Drive",
        serviceType: "Programmatic Ads",
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
    },
    {
        id: 5,
        name: "Urban Eats",
        serviceType: "Media Production",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    },
    {   
        id: 6,  
        name: "IMedia247",     
        serviceType: "Website Development",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    },    
];

function useSliderStep() {
    const [step, setStep] = useState(25);
    const [cardsVisible, setCardsVisible] = useState(4);
    useEffect(() => {
        const update = () => {
            if (window.innerWidth <= 720) {
                setStep(100);
                setCardsVisible(1);
            } else if (window.innerWidth <= 1024) {
                setStep(50);
                setCardsVisible(2);
            } else {
                setStep(25);
                setCardsVisible(4);
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return { step, cardsVisible };
}

export default function Portfolio() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { step, cardsVisible } = useSliderStep();
    const total = portfolioItems.length;
    const maxIndex = Math.max(0, total - cardsVisible);

    const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
    const goNext = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

    return (
        <section id="portfolio" className="portfolio">
            <div className="portfolio-inner">
                <div className="portfolio-header">
                    <h2 className="section-tagline">Our Portfolio</h2>
                    <h1 className="section-title">Work We're Proud Of</h1>
                    <p className="section-description">
                        From social media and content to PPC, programmatic, and media production—here's a snapshot of the results we've delivered for our clients.
                    </p>
                </div>

                <div className="portfolio-slider-wrap">
                    <button
                        type="button"
                        className="portfolio-arrow portfolio-arrow--prev"
                        onClick={goPrev}
                        disabled={currentIndex === 0}
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="portfolio-arrow portfolio-arrow--next"
                        onClick={goNext}
                        disabled={currentIndex >= maxIndex}
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="portfolio-slider">
                        <div
                            className="portfolio-slider-track"
                            style={{
                                transform: `translateX(-${currentIndex * step}%)`,
                            }}
                        >
                            {portfolioItems.map((item) => (
                                <div key={item.id} className="portfolio-card">
                                    <div className="portfolio-card-image">
                                        <img src={item.image} alt={item.name} />
                                        <div className="portfolio-card-overlay">
                                            <span className="portfolio-card-name">{item.name}</span>
                                            <span className="portfolio-card-service">{item.serviceType}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
