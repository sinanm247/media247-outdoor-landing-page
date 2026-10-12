import "./Testimonials.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Dummy testimonial data
const testimonials = [
    {
        id: 1,
        name: "Sarah Ahmed",
        role: "CEO, TechStart Dubai",
        company: "TechStart Dubai",
        image: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        text: "Media247 Digital transformed our online presence completely. Their strategic approach to digital marketing helped us increase our leads by 300% in just 3 months. Highly recommended!",
    },
    {
        id: 2,
        name: "Mohammed Al-Rashid",
        role: "Marketing Director, RetailPlus",
        company: "RetailPlus",
        image: "https://i.pravatar.cc/150?img=12",
        rating: 5,
        text: "The team at Media247 Digital is exceptional. They understand our business needs and deliver results that exceed expectations. Our social media engagement has never been better.",
    },
    {
        id: 3,
        name: "Fatima Hassan",
        role: "Founder, Fashion Forward",
        company: "Fashion Forward",
        image: "https://i.pravatar.cc/150?img=47",
        rating: 5,
        text: "Working with Media247 Digital has been a game-changer for our brand. Their creative content and data-driven strategies have significantly boosted our online sales.",
    },
    {
        id: 4,
        name: "Ahmed Khalil",
        role: "Operations Manager, RealEstate Pro",
        company: "RealEstate Pro",
        image: "https://i.pravatar.cc/150?img=33",
        rating: 5,
        text: "Media247 Digital's programmatic advertising campaigns delivered outstanding ROI. They truly understand how to maximize online potential and drive real business results.",
    },
    {
        id: 5,
        name: "Layla Mansour",
        role: "CMO, HealthCare Solutions",
        company: "HealthCare Solutions",
        image: "https://i.pravatar.cc/150?img=20",
        rating: 5,
        text: "The expertise and professionalism of Media247 Digital is unmatched. They helped us break through our limitations and achieve remarkable growth in our digital marketing efforts.",
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="testimonials-section section-container">
            <div className="testimonials-wrapper">
                <div className="testimonials-header">
                    <h2 className="section-tagline">Testimonials</h2>
                    <h1 className="section-title">What Our Clients Say</h1>
                    <p className="section-description">
                        Don't just take our word for it. See how we've helped businesses maximize their online potential and achieve remarkable growth.
                    </p>
                </div>

                <div className="testimonials-slider">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        loop={true}
                        spaceBetween={20}
                        slidesPerView={1}
                        centeredSlides={true}
                        initialSlide={0}
                        pagination={{ clickable: true, el: '.testimonials-pagination' }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                        className="testimonials-swiper"
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="testimonial-card">
                                    <div className="testimonial-rating">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#EC1C24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="testimonial-text">"{testimonial.text}"</p>
                                    <div className="testimonial-author">
                                        <div className="author-image">
                                            <img src={testimonial.image} alt={testimonial.name} />
                                        </div>
                                        <div className="author-info">
                                            <h4 className="author-name">{testimonial.name}</h4>
                                            <p className="author-role">{testimonial.role}</p>
                                            <p className="author-company">{testimonial.company}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="testimonials-pagination"></div>
                </div>
            </div>
        </section>
    );
}

