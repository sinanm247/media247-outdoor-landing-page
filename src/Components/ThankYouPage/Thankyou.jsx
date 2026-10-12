import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ThankYou.css";
import { pushThankYouConversion, pushThankYouPageView } from "../../Utils/gtm";
import Helmet from "../../General/Helmet";
import banner1 from "../../assets/Banners/Banner-2.webp";

export default function Thankyou() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fire GTM on thank-you page (SPA: no full reload, so push events here after URL is /thank-you)
    useEffect(() => {
        pushThankYouPageView();
        const gtm = location.state?.gtmConversion;
        if (gtm?.formSource && gtm?.formValues) {
            pushThankYouConversion(gtm.formSource, gtm.formValues);
        }
    }, [location.state]);

    return (
        <>
            <Helmet title="Media247 Digital | Thank You" />
            <div className="thankyou-hero">
                <div className="overlay"></div>
                <div className="banner-container">
                    <img
                        className="banner-image active"
                        src={banner1}
                        alt="Thank You Banner"
                    />
                </div>
                
                {/* Content Text - Left Bottom */}
                <div className="hero-content-left">
                    <h1 className="content-title">THANK YOU</h1>
                    <p className="content-description">We'll get back to you soon</p>
                    <a href="/">
                        <button className="btn btn-glass content-button">
                            Back To Home
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
} 