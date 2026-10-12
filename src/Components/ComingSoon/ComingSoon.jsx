import React, { useState, useEffect } from 'react';
import './ComingSoon.scss';
import { HiMail, HiPhone } from 'react-icons/hi';

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to 10 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);
    targetDate.setHours(0, 0, 0, 0);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="coming-soon">
      <div className="background-image">
        <div className="overlay"></div>
      </div>
      
      <div className="coming-soon-content">
        <div className="content-wrapper">
          <h1 className="company-name">Orange Advertising</h1>
          <h2 className="coming-soon-title">Coming Soon</h2>
          
          {/* <div className="countdown-section">
            <div className="countdown-grid">
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="countdown-label">Seconds</span>
              </div>
            </div>
          </div> */}
          
          <div className="contact-section">
            <div className="contact-info">
              <p className="person-name">Bharat S Ojha</p>
              <p className="person-role">Director Sales and Operation</p>
            </div>
            
            <div className="contact-details">
              <a href="mailto:bharatojha@orangeadv.ae" className="contact-link">
                <HiMail className="contact-icon" />
                <span>bharatojha@orangeadv.ae</span>
              </a>
              <a href="tel:+971 503856208" className="contact-link">
                <HiPhone className="contact-icon" />
                <span>+971 503856208</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

