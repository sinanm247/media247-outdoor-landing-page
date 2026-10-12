import { Fragment } from "react";
import Helmet from "../General/Helmet";
import HomeHero from "../Components/HomePage/HomeHero/HomeHero";
import ContactForm from "../Components/Common/ContactForm/ContactForm";
import AboutUsSection from "../Components/HomePage/AboutUsSection/AboutUsSection";
import Stats from "../Components/Common/Stats/Stats";
import CTA from "../Components/Common/CTA/CTA";
import Assets from "../Components/Common/Assets/Assets";
import FeaturedAssets from "../Components/HomePage/FeaturedAssets/FeaturedAssets";
import ClientSlider from "../Components/Common/ClientSlider/ClientSlider";
import Testimonials from "../Components/Common/Testimonials/Testimonials";

export default function HomePage() {
  return (
    <Fragment>
        <Helmet title="Media247 Digital | Home" />
        <HomeHero />
        <ClientSlider />
        <ContactForm />
        <Stats />
        <AboutUsSection />
        <Assets />
        {/* <CaseStudy /> */}
        <CTA />
        {/* <Testimonials /> */}
        <FeaturedAssets />
        <ContactForm />
        {/* <Services />
        <Process />
        <Stats />
        <WhyChooseUs />
         */}
    </Fragment>
  );
}