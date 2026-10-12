// import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
// import LazyLoad from "react-lazyload"
import { motion } from "framer-motion";

import "./CaseStudy.scss"


import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import neom from "../../../assets/CaseStudy/neom-logo.webp"
// import australian from "../../../assets/CaseStudy/australia-logo.webp"
// import employsure from "../../../assets/CaseStudy/employsure-logo.webp"

import thumbnail1 from "../../../assets/Case-Studies/image-1.jpg"
import thumbnail2 from "../../../assets/Case-Studies/image-2.jpg"
import thumbnail3 from "../../../assets/Case-Studies/image-3.jpg"

import { useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const CaseStudies = [
    {
        id: 1,
        title: "Al Huzaifa",
        service: "Social Media Management",
        description: "Expanded brand reach and boosted audience engagement through strategic social media management.",
        thumbnail: thumbnail1,
        youtube: "https://youtu.be/sp6vU1az9gQ",
        stats: [
            { label: "Reach", value: "+450%" },
            { label: "Engagement", value: "+120%" },
        ],
    },
    {
        id: 2,
        title: "Allegiance",
        service: "Lead Generation",
        description: "Delivered a massive surge in leads, providing a rich dataset to begin the qualification and refinement process.",
        thumbnail: thumbnail2,
        youtube: "https://youtu.be/beYP-UlZod0",
        stats: [
            { label: "Leads Generated", value: "+800%" },
            { label: "Qualified Rate", value: "80%" },
        ],
    },
    {
        id: 3,
        title: "Source of Fate",
        service: "Performance Marketing",
        description: "Our performance ads doubled campaign traffic and boosted conversions while reducing the overall costs.",
        thumbnail: thumbnail3,
        youtube: "https://youtu.be/EOHS_nXdBZ0",
        stats: [
            { label: "Clicks", value: "+100%" },
            { label: "Click-Through Rate (CTR)", value: "+200%" },
        ],
    },
]


export default function CaseStudy() {
    const [playingVideo, setPlayingVideo] = useState(null); // To track the currently playing video

    const handleVideoPlaying = (videoUrl) => {
        setPlayingVideo(videoUrl);
    };

    const closeVideo = () => {
        setPlayingVideo(null);
    };

    const textVarient = {
        initial: {
            y: 100,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeOut",
                staggerChildren: 0.3, // Stagger the children by 0.3s
            },
        },
      };
    
      const childVariants = {
          initial: { y: 50, opacity: 0 },
          animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
      };

    return (
        <section id="case-study" className="caseStudy section-container">
            <div className="case-study-header">
                <h2 className="section-tagline">Case Studies</h2>
                <h1 className="section-title">See How We Help Our Clients Grow</h1>
                <p className="section-description">
                    Our case studies showcase how we have helped our clients achieve their goals through our digital marketing services.
                </p>
            </div>
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={1}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 50,
                modifier: 1,
                slideShadows: false, 
              }}
              pagination={{ el: '.swiper-pagination', clickable: true }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                clickable: true,
              }}
              modules={[EffectCoverflow, Pagination, Navigation]}
              className="swiper_container"
            >
                {CaseStudies.map((ele) => {
                    return (
                        <SwiperSlide key={ele.id}>
                            <div className='flexSB'>
                                <div className='left'>
                                    <div className="image-container">
                                        <img
                                            src={ele.thumbnail}
                                            alt={ele.title}
                                            onClick={() => handleVideoPlaying(ele.youtube)}
                                            className="thumbnail-image"
                                        />
                                    </div>
                                </div>
                                <motion.div className='right'>
                                    <motion.div className="aboutHeading" initial="initial" whileInView="animate" variants={textVarient}>
                                        <motion.div variants={childVariants} className="top">
                                            {/* <img src={ele.logo} alt="2D Animation Company in Dubai" /> */}
                                            <h2>{ele.title}</h2>
                                        </motion.div>
                                        <motion.p variants={childVariants} className="service-type">{ele.service}</motion.p>
                                        <motion.p variants={childVariants}>{ele.description}</motion.p>
                                        {/* {ele.stats && (
                                            <motion.div variants={childVariants} className="case-stats">
                                                {ele.stats.map((stat, index) => (
                                                    <div key={index} className="stat-item">
                                                        <div className="stat-value">{stat.value}</div>
                                                        <div className="stat-label">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )} */}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </SwiperSlide>
                    )
                })}
                <div className="slider-controler">
                <div className="swiper-button-prev slider-arrow">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
                <div className="swiper-button-next slider-arrow">
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
                <div className="swiper-pagination"></div>
              </div>
            </Swiper>
        </section>
    )
}