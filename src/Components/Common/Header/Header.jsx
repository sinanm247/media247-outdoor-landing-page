import React, { useEffect, useState } from 'react'
import "./Header.scss"

import logo from "../../../assets/Logo/m247-outdoor-logo.png"

import { useLocation } from 'react-router-dom'
import { navLinks } from '../../../Utils/App.util'
import { RiMenu2Line } from 'react-icons/ri'
import { IoClose } from 'react-icons/io5'
import { MdCall } from "react-icons/md";

// import { trackWhatsAppClick } from '../../../Utils/emailService' // Lead ID - commented off for now

export default function Header(){
    const location = useLocation()
    const [ isSticky, setIsSticky ] = useState(false)
    const [ activeSection, setActiveSection ] = useState("")

    const [ mobileMenu, setMobileMenu ] = useState(false)

    const toggleMenu = () => {
        setMobileMenu(!mobileMenu)
    }

    const handleNavClick = (e, path) => {
        if (path.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(path);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        setMobileMenu(false);
    }

    const handleContactUsClick = (e) => {
        e.preventDefault();
        handleNavClick(e, "#contact-us");
    }

    const isThankYouPage = location.pathname === "/thank-you";

    useEffect(() => {
        if (isThankYouPage) setMobileMenu(false);
    }, [isThankYouPage]);

    useEffect(() => {
        const handleScroll = () => {
            // Debug logs - remove after testing
            // console.log('Current pathname:', location.pathname);
            // console.log('Scroll Y:', window.scrollY);
            // console.log('Is sticky currently:', isSticky);
            
            if(location.pathname === "/thank-you" || location.pathname !== "/") {
                setIsSticky(true)
            } else if(window.scrollY > 100) {
                setIsSticky(true)
            } else {
                // console.log('Setting sticky to false');
                setIsSticky(false)
            }

            // Section detection logic
            if (location.pathname === "/") {
                // Get all sections from navigation links
                const allNavs = [...navLinks];
                const sections = allNavs
                    .map(nav => nav.path.startsWith('#') ? nav.path.substring(1) : null)
                    .filter(Boolean);
                
                const headerHeight = 120; // Offset for header height
                const viewportThreshold = headerHeight + 100; // Area around header to consider
                const sectionData = [];

                // Collect all sections with their positions
                sections.forEach(section => {
                    const element = document.getElementById(section);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        const sectionTop = rect.top;
                        const sectionBottom = rect.bottom;
                        const sectionHeight = rect.height;
                        const sectionCenter = sectionTop + (sectionHeight / 2);
                        
                        sectionData.push({
                            id: section,
                            top: sectionTop,
                            bottom: sectionBottom,
                            center: sectionCenter,
                            height: sectionHeight
                        });
                    }
                });

                // Sort sections by their position (top to bottom)
                sectionData.sort((a, b) => a.top - b.top);

                // Find the active section
                // Priority: Section whose center is closest to the header threshold
                let bestSection = '';
                let bestScore = Infinity;

                sectionData.forEach(section => {
                    // Calculate how close the section center is to the header threshold
                    const distanceFromThreshold = Math.abs(section.center - viewportThreshold);
                    
                    // Prefer sections that are in view or just scrolled past
                    if (section.top <= viewportThreshold && section.bottom >= headerHeight - 50) {
                        if (distanceFromThreshold < bestScore) {
                            bestScore = distanceFromThreshold;
                            bestSection = section.id;
                        }
                    }
                });

                // If no section found with priority method, use the one closest to the threshold
                if (!bestSection && sectionData.length > 0) {
                    sectionData.forEach(section => {
                        const distance = Math.abs(section.center - viewportThreshold);
                        if (distance < bestScore) {
                            bestScore = distance;
                            bestSection = section.id;
                        }
                    });
                }

                // If scrolled to top, clear active section
                if (window.scrollY < 100) {
                    bestSection = '';
                }

                setActiveSection(bestSection);
            } else {
                setActiveSection('');
            }
        };


        // Add the scroll event listener
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Run once on mount to set initial sticky state
        handleScroll();

        // Cleanup the event listener on unmount
        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, [location.pathname, isSticky]);

    const renderNavItems = (navItems) => {
        return navItems.map((ele) => {
            const isActive = () => {
                if (ele.path === "/") {
                    return location.pathname === "/" && activeSection === "";
                } else if (ele.path.startsWith("#")) {
                    const sectionId = ele.path.substring(1);
                    return activeSection === sectionId;
                }
                return location.pathname === ele.path;
            };

            const active = isActive();

            return (
                <li className="menu-items" key={ele.id}>
                    <a 
                        href={ele.path} 
                        className={active ? "active" : ""}
                        onClick={(e) => handleNavClick(e, ele.path)}
                    >
                        {ele.name}
                    </a>
                </li>
            );
        });
    };

    return (
        <nav className='navbar-container'>
            <div className={`navbar ${isSticky ? "sticky" : ""} ${location.pathname === "/thank-you" ? "thank-you-header" : ""}`}>
                {/* Left Logo */}
                <div className="logo-div">
                    <a href="/" className="logo-link">
                        <img src={logo} alt="Media247 Digital" className="logo" />
                    </a>
                </div>

                {/* Centered Navigation */}
                <div className="nav-links-center">
                    <ul className="menu-bar">
                        {renderNavItems(navLinks)}
                    </ul>
                </div>

                {/* Right Contact Us Button */}
                <div className="contact-btn-wrapper">
                    <a 
                        href="#contact-us" 
                        className="contact-header-btn"
                        onClick={handleContactUsClick}
                    >
                        CONTACT US
                        <MdCall className="contact-header-btn-icon" aria-hidden="true" />
                    </a>
                </div>

                {/* Menu Icon - hidden on thank-you page */}
                {!isThankYouPage && (
                    <div className="header-icons">
                        {!mobileMenu ? (
                            <RiMenu2Line className="menu-icon" onClick={toggleMenu} />
                        ) : (
                            <IoClose onClick={toggleMenu} className="menu-icon close" />
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu - hidden on thank-you page */}
            {!isThankYouPage && (
                <div className={`mobile-menu-overlay ${mobileMenu ? "show" : ""}`}>
                    <ul className="mobile-menu-bar">
                        {renderNavItems([...navLinks])}
                    </ul>
                </div>
            )}
            
            {/* Fixed Contact Us Button for Mobile */}
            {!isThankYouPage && (
                <a 
                    href="#contact-us" 
                    className="contact-fixed-btn"
                    onClick={handleContactUsClick}
                >
                    {/* Contact Us */}
                    <MdCall />
                </a>
            )}
        </nav>
    );
}