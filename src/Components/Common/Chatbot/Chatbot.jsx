import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sendContactFormEmail, sendChatbotToGoogleSheets } from "../../../Utils/emailService";
import "./Chatbot.scss";
import chatbotAvatar from "../../../assets/Logo/m247-outdoor-logo.png";
import chatbotIcon from "../../../assets/Common/chatbot-icon.png";
import { TbMessageChatbot } from "react-icons/tb";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";

const OPTION_LABELS = {
    "hoardings": "Hoardings",
    "unipoles": "Unipoles",
    "digital-ooh": "Digital OOH Screens",
    "transit-media": "Transit Media (Taxis & Buses)",
    "lamp-posts": "Lamp Post Banners",
    "glass-graphics": "Glass Graphics & Building Wraps",
};

const SERVICES = [
    { id: "hoardings", label: "Hoardings", description: "Large-format roadside hoardings on key UAE highways" },
    { id: "unipoles", label: "Unipoles", description: "High-visibility unipoles on high-traffic corridors" },
    { id: "digital-ooh", label: "Digital OOH Screens", description: "Dynamic digital screens in premium locations" },
    { id: "transit-media", label: "Transit Media (Taxis & Buses)", description: "Taxi tops and full wraps from airport to city" },
    { id: "lamp-posts", label: "Lamp Post Banners", description: "High-frequency lamp post networks along major routes" },
    { id: "glass-graphics", label: "Glass Graphics & Building Wraps", description: "Iconic building wraps and glass graphics" },
];

const BUDGET_OPTIONS = [
    { value: "100k-500k AED", label: "100k-500k AED" },
    { value: "500k-1M AED", label: "500k-1M AED" },
    { value: "1M+ AED", label: "1M+ AED" },
];

const CHATBOT_CLOSE_COUNT_KEY = 'chatbotCloseCount';
const CHATBOT_LAST_CLOSE_TIME_KEY = 'chatbotLastCloseTime';
const CHATBOT_AUTO_OPEN_DONE_KEY = 'chatbotAutoOpenDone';

const BOT_MIN_SECONDS = 3;

export default function Chatbot() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [nameInput, setNameInput] = useState("");
    const [companyInput, setCompanyInput] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [phoneQuestionAsked, setPhoneQuestionAsked] = useState(false);
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [emailQuestionAsked, setEmailQuestionAsked] = useState(false);
    const [nameQuestionAsked, setNameQuestionAsked] = useState(false);
    const [companyQuestionAsked, setCompanyQuestionAsked] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [closeCount, setCloseCount] = useState(() => {
        if (typeof window !== "undefined") {
            return parseInt(localStorage.getItem(CHATBOT_CLOSE_COUNT_KEY) || '0');
        }
        return 0;
    });
    const [showHint, setShowHint] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth <= 768;
        }
        return false;
    });

    // Chatbot data state
    const [chatData, setChatData] = useState({
        name: "",
        phone: "",
        email: "",
        companyName: "",
        budget: "",
        selectedService: null,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        website: "", // honeypot: leave empty; bots often fill it
    });

    const chatContentRef = useRef(null);
    const formOpenTimeRef = useRef(null);
    const nameInputRef = useRef(null);
    const companyInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const hasInitialized = useRef(false);

    // Record when chat is opened (for bot timing check)
    useEffect(() => {
        if (isOpen) {
            formOpenTimeRef.current = Date.now();
        }
    }, [isOpen]);

    // Auto-open once on first visit after 5s. After close, never auto-open again.
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (localStorage.getItem(CHATBOT_AUTO_OPEN_DONE_KEY)) return;
        if (parseInt(localStorage.getItem(CHATBOT_CLOSE_COUNT_KEY) || "0", 10) > 0) {
            localStorage.setItem(CHATBOT_AUTO_OPEN_DONE_KEY, "1");
            return;
        }

        const timer = setTimeout(() => {
            if (localStorage.getItem(CHATBOT_AUTO_OPEN_DONE_KEY)) return;
            if (window.innerWidth <= 768) setIsFullScreen(true);
            setIsOpen(true);
            localStorage.setItem(CHATBOT_AUTO_OPEN_DONE_KEY, "1");
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Validate UAE phone number: +971 or 971 followed by 9 digits (total 12-13 characters)
    const validateUAEPhone = (phone) => {
        if (!phone || phone.trim().length === 0) return false;
        // Remove any spaces or dashes
        const cleanPhone = phone.replace(/[\s-]/g, '');
        // Check if it starts with +971 or 971 and has exactly 9 more digits
        const uaePhoneRegex = /^(\+971|971)[0-9]{9}$/;
        return uaePhoneRegex.test(cleanPhone);
    };

    // Validate email format
    const validateEmail = (email) => {
        if (!email || email.trim().length === 0) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    // Determine current step function
    const getCurrentStep = () => {
        if (!chatData.name) return "name-input";
        if (!chatData.selectedService) return "welcome";
        if (!chatData.companyName) return "company-input";
        if (!chatData.budget) return "budget";
        if (isFormSubmitted || isSubmitting) return "complete";
        if (phoneSubmitted) return "email-input";
        if (phoneQuestionAsked) return "phone-input";
        return "phone-input";
    };

    const currentStep = getCurrentStep();

    // Show hint every 10 seconds when chat is closed (same pattern as waiter-bell)
    useEffect(() => {
        if (isOpen || isFormSubmitted) return;
        let hideTimer = null;
        const interval = setInterval(() => {
            setShowHint(true);
            hideTimer = setTimeout(() => setShowHint(false), 3000);
        }, 10000);
        return () => {
            clearInterval(interval);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [isOpen, isFormSubmitted]);

    // Initialize messages on mount - staggered for more natural feel
    useEffect(() => {
        if (messages.length === 0 && !hasInitialized.current) {
            hasInitialized.current = true;
            // First message appears immediately
            setMessages([
                {
                    type: "bot",
                    content: "Hello! 👋 Welcome to Media 247. I’m here to help you plan high-impact outdoor and digital OOH campaigns across the UAE.",
                    timestamp: new Date(),
                },
            ]);
            // Second message appears after a natural pause (like a real person typing)
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        type: "bot",
                        content: "May I know your name?",
                        timestamp: new Date(),
                    },
                ]);
                // Set nameQuestionAsked to true after the message appears so input shows
                setNameQuestionAsked(true);
            }, 800);
        }
    }, [messages.length]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (chatContentRef.current) {
            setTimeout(() => {
                if (chatContentRef.current) {
                    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [messages, showOptions, currentStep]);

    // Ensure phone input is visible when step changes to phone-input
    useEffect(() => {
        if (currentStep === "phone-input") {
            const timer = setTimeout(() => {
                if (phoneInputRef.current && chatContentRef.current) {
                    phoneInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    useEffect(() => {
        if (currentStep === "company-input") {
            const timer = setTimeout(() => {
                if (companyInputRef.current && chatContentRef.current) {
                    companyInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    // Ensure email input is visible when step changes to email-input
    useEffect(() => {
        if (currentStep === "email-input") {
            const timer = setTimeout(() => {
                if (emailInputRef.current && chatContentRef.current) {
                    emailInputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const calculateTypingDelay = (content) => {
        if (typeof content === "string") {
            const baseDelay = Math.min(Math.max(content.length * 28, 450), 1200);
            return Math.round(baseDelay);
        }
        return 700;
    };

    const addBotMessageWithTyping = (content, customDelay = null, shouldShowOptions = false, onComplete = null) => {
        const delay = customDelay !== null ? customDelay : calculateTypingDelay(content);
        setMessages((prev) => [...prev, { type: "typing", content: "", timestamp: new Date() }]);
        setTimeout(() => {
            setMessages((prev) => {
                const withoutTyping = prev.filter((msg) => msg.type !== "typing");
                return [...withoutTyping, { type: "bot", content, timestamp: new Date() }];
            });
            if (shouldShowOptions) {
                setTimeout(() => {
                    setShowOptions(true);
                }, 50);
            }
            if (onComplete) {
                setTimeout(() => {
                    onComplete();
                }, 50);
            }
        }, delay);
    };

    const addAcknowledgment = (message, callback, delay = null) => {
        const ackDelay = delay !== null ? delay : Math.max(calculateTypingDelay(message) * 0.7, 280);
        addBotMessageWithTyping(message, ackDelay, false);
        setTimeout(() => {
            if (callback) callback();
        }, ackDelay + 180);
    };

    // Add user message
    const addUserMessage = (content) => {
        setMessages((prev) => [...prev, { type: "user", content, timestamp: new Date() }]);
    };

    // Stable phone change handler to prevent re-renders
    const handlePhoneChange = useCallback((phone) => {
        setChatData((prev) => ({ ...prev, phone }));
    }, []);

    // Handle name submission
    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (!nameInput.trim() || nameInput.trim().length < 2) {
            return;
        }
        const userName = nameInput.trim();
        setChatData((prev) => ({ ...prev, name: userName }));
        addUserMessage(userName);
        setNameInput("");
        setShowOptions(false);
        setTimeout(() => {
            addAcknowledgment(`Nice to meet you, ${userName}! 😊`, () => {
                setTimeout(() => {
                    addBotMessageWithTyping("Which outdoor and digital OOH campaigns service are you interested in?", null, true);
                }, 280);
            });
        }, 220);
    };

    // Handle service selection
    const handleServiceSelect = (serviceId) => {
        const service = SERVICES.find(s => s.id === serviceId);
        addUserMessage(service ? service.label : OPTION_LABELS[serviceId]);
        setChatData((prev) => ({ ...prev, selectedService: serviceId }));
        setShowOptions(false);
        const acknowledgments = [
            "Perfect choice! 👍",
            "Great! Let me help you with that.",
            "Excellent! I'll get that sorted for you.",
        ];
        const randomAck = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        setTimeout(() => {
            addAcknowledgment(randomAck, () => {
                setTimeout(() => {
                    addBotMessageWithTyping("What's your company name?", null, false, () => {
                        setCompanyQuestionAsked(true);
                    });
                }, 280);
            });
        }, 220);
    };

    const handleCompanySubmit = (e) => {
        e.preventDefault();
        if (!companyInput.trim() || companyInput.trim().length < 2) {
            return;
        }
        const companyName = companyInput.trim();
        setChatData((prev) => ({ ...prev, companyName }));
        addUserMessage(companyName);
        setCompanyInput("");
        setShowOptions(false);
        setTimeout(() => {
            addAcknowledgment("Got it! 🏢", () => {
                setTimeout(() => {
                    addBotMessageWithTyping("What's your campaign budget range?", null, true);
                }, 280);
            });
        }, 220);
    };

    const handleBudgetSelect = (budget) => {
        addUserMessage(budget);
        setChatData((prev) => ({ ...prev, budget }));
        setShowOptions(false);
        setTimeout(() => {
            addAcknowledgment("Thanks! 💰", () => {
                setTimeout(() => {
                    const phoneMessage = "📞 Please provide your phone number so our team can contact you and discuss your outdoor and digital OOH campaigns.";
                    addBotMessageWithTyping(phoneMessage, null, false, () => {
                        setPhoneQuestionAsked(true);
                    });
                }, 280);
            });
        }, 220);
    };

    // Handle phone submission - move to email step
    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (!chatData.phone || !validateUAEPhone(chatData.phone)) {
            // Show error message if phone is invalid
            if (chatData.phone && chatData.phone.length > 0) {
                addBotMessageWithTyping("Please enter a valid UAE phone number (+971XXXXXXXXX)", 1500);
            }
            return;
        }

        addUserMessage(chatData.phone);
        setShowOptions(false);
        // Mark phone as submitted immediately so phone input disappears
        setPhoneSubmitted(true);

        // Add acknowledgment and ask for email
        setTimeout(() => {
            addAcknowledgment("Great! 📱", () => {
                setTimeout(() => {
                    const emailMessage = "📧 Please provide your email address so we can send you detailed information about our OOH advertising services.";
                    addBotMessageWithTyping(emailMessage, null, false, () => {
                        setEmailQuestionAsked(true);
                    });
                }, 280);
            });
        }, 220);
    };

    // Handle email submission and final submission
    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        const elapsed = formOpenTimeRef.current ? (Date.now() - formOpenTimeRef.current) / 1000 : 999;
        const isHoneypotBot = chatData.website && String(chatData.website).trim() !== "";
        const isTimingBot = elapsed < BOT_MIN_SECONDS;

        // Bot: still write to sheet for tracking; show error and do not navigate to thank-you
        if (isHoneypotBot || isTimingBot) {
            const botMessageField = isHoneypotBot ? String(chatData.website).trim() : "submitted_too_fast";
            await sendChatbotToGoogleSheets({
                ...chatData,
                botMessageField,
            });
            addBotMessageWithTyping(isHoneypotBot ? "Something went wrong. Please try again or contact us directly." : "Please take a moment to complete the form, then try again.");
            return;
        }

        if (!chatData.email || !validateEmail(chatData.email)) {
            // Show error message if email is invalid
            if (chatData.email && chatData.email.length > 0) {
                addBotMessageWithTyping("Please enter a valid email address", 1500);
            }
            return;
        }

        addUserMessage(chatData.email);
        setIsSubmitting(true);
        setShowOptions(false);

        // Add acknowledgment before processing - with longer delay
        setTimeout(() => {
            addBotMessageWithTyping("Perfect! Let me process this for you...", 700);
        }, 200);

        const serviceLabel = chatData.selectedService
            ? (OPTION_LABELS[chatData.selectedService] || chatData.selectedService)
            : "";

        const emailData = {
            name: chatData.name,
            phone: chatData.phone,
            email: chatData.email,
            message: "-",
            service: serviceLabel,
            company: chatData.companyName,
            budget: chatData.budget,
            source: "Chatbot",
        };

        try {
            const result = await sendContactFormEmail(emailData);
            if (result.success) {
                const { website: _honeypot, ...sheetsPayload } = chatData;
                try {
                    await sendChatbotToGoogleSheets({
                        ...sheetsPayload,
                        selectedService: serviceLabel,
                        serviceType: serviceLabel,
                        service: serviceLabel,
                        company: chatData.companyName,
                        budget: chatData.budget,
                    });
                } catch (error) {
                    console.error("Failed to save chatbot data to Google Sheets (non-critical):", error);
                }

                setIsFormSubmitted(true);
                // Clear close tracking since form is submitted
                setCloseCount(0);
                localStorage.removeItem(CHATBOT_CLOSE_COUNT_KEY);
                localStorage.removeItem(CHATBOT_LAST_CLOSE_TIME_KEY);
                // Add success message with natural delay - longer for processing feel
                setTimeout(() => {
                    addBotMessageWithTyping(
                        <div className="chatbot-success-message">
                            <div className="success-icon">✅</div>
                            <h3>Thank you for your inquiry!</h3>
                            <p>Our team will contact you within 24 hours to discuss your outdoor and digital OOH campaigns and how we can maximize your brand visibility.</p>
                            <div className="contact-info">
                                <p>📞 For immediate assistance:</p>
                                <a href="tel:+971566938841" className="phone-link">+971 56 693 8841</a>
                            </div>
                        </div>,
                        900,
                        false,
                        () => {
                            const formValues = {
                                name: chatData.name,
                                phone: chatData.phone,
                                email: chatData.email,
                                service: serviceLabel,
                                message: "-",
                                selectedService: chatData.selectedService,
                                companyName: chatData.companyName,
                                budget: chatData.budget,
                                pageUrl: chatData.pageUrl,
                            };
                            setTimeout(() => {
                                navigate("/thank-you", { state: { gtmConversion: { formSource: "chatbot", formValues } } });
                            }, 1000);
                        }
                    );
                }, 500);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setTimeout(() => {
                addBotMessageWithTyping("Hmm, I'm having a bit of trouble processing that. Could you please try again, or feel free to contact us directly?");
            }, 500);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle chat close - track for auto-open intervals
    const handleChatClose = () => {
        localStorage.setItem(CHATBOT_AUTO_OPEN_DONE_KEY, "1");
        if (!isFormSubmitted) {
            const newCloseCount = closeCount + 1;
            setCloseCount(newCloseCount);
            localStorage.setItem(CHATBOT_CLOSE_COUNT_KEY, newCloseCount.toString());
            localStorage.setItem(CHATBOT_LAST_CLOSE_TIME_KEY, Date.now().toString());
        }
        setIsOpen(false);
    };

    // Reset chat
    const resetChat = () => {
        setChatData({
            name: "",
            phone: "",
            email: "",
            companyName: "",
            budget: "",
            selectedService: null,
            pageUrl: typeof window !== "undefined" ? window.location.href : "",
            website: "",
        });
        setNameInput("");
        setCompanyInput("");
        setShowOptions(false);
        setPhoneQuestionAsked(false);
        setPhoneSubmitted(false);
        setEmailQuestionAsked(false);
        setNameQuestionAsked(false);
        setCompanyQuestionAsked(false);
        setIsFormSubmitted(false);
        setCloseCount(0);
        localStorage.removeItem(CHATBOT_CLOSE_COUNT_KEY);
        localStorage.removeItem(CHATBOT_LAST_CLOSE_TIME_KEY);
        hasInitialized.current = false;
        // Reset with staggered initial messages - same delays as initial load
        setMessages([
            {
                type: "bot",
                content: "Hello! 👋 Welcome back to Media 247. I’m here to help you with outdoor and digital OOH advertising across the UAE.",
                timestamp: new Date(),
            },
        ]);
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    type: "bot",
                    content: "May I know your name?",
                    timestamp: new Date(),
                },
            ]);
            setNameQuestionAsked(true);
        }, 800);
    };


    return (
        <>
            {/* Floating Chat Button with Hint */}
            {!isOpen && (
                <div className="chatbot-bell-wrapper">
                    <div className={`chatbot-hint ${showHint ? "show" : ""}`}>
                        {/* Need mortgage advice? Chat with us - we're here to help! */}
                        Need OOH advertising help? Chat with us!
                    </div>
                    <button
                        onClick={() => {
                            localStorage.setItem(CHATBOT_AUTO_OPEN_DONE_KEY, "1");
                            if (typeof window !== "undefined" && window.innerWidth <= 768) {
                                setIsFullScreen(true);
                            }
                            setIsOpen(true);
                        }}
                        className="chatbot-toggle-btn"
                        aria-label="Open chat"
                    >
                        <HiChatBubbleOvalLeftEllipsis className="chatbot-icon" />
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`chatbot-container ${isFullScreen ? "chatbot-container--fullscreen" : ""}`}>
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <img src={chatbotAvatar} alt="Chatbot" />
                            </div>
                            <div className="chatbot-header-text">
                                <h3>Media 247</h3>
                                <p>Online</p>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <button
                                type="button"
                                onClick={() => setIsFullScreen((prev) => !prev)}
                                className="chatbot-expand-btn"
                                aria-label={isFullScreen ? "Exit full screen" : "Full screen"}
                            >
                                {isFullScreen ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={handleChatClose}
                                className="chatbot-close-btn"
                                aria-label="Close chat"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Honeypot: hidden from users; bots that fill all fields will fill this */}
                    <input
                        type="text"
                        name="website"
                        className="chatbot-honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        value={chatData.website}
                        onChange={(e) => setChatData((prev) => ({ ...prev, website: e.target.value }))}
                        aria-hidden="true"
                    />

                    {/* Messages Area */}
                    <div ref={chatContentRef} className="chatbot-messages">
                        {messages.map((message, index) => {
                            if (message.type === "typing") {
                                return (
                                    <div key={index} className="chatbot-message chatbot-message-bot">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={index}
                                    className={`chatbot-message ${
                                        message.type === "user" ? "chatbot-message-user" : "chatbot-message-bot"
                                    }`}
                                >
                                    <div className="message-bubble">
                                        {typeof message.content === "string" ? (
                                            <p>{message.content}</p>
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Name Input */}
                        {currentStep === "name-input" && nameQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handleNameSubmit}>
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="Enter your name"
                                            className="chatbot-input"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!nameInput.trim() || nameInput.trim().length < 2}
                                            className="chatbot-submit-btn"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Options - Welcome (Services) */}
                        {currentStep === "welcome" && showOptions && !messages.some((m) => m.type === "typing") && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-grid">
                                        {SERVICES.map((service) => (
                                            <button
                                                key={service.id}
                                                onClick={() => handleServiceSelect(service.id)}
                                                className="option-btn"
                                            >
                                                📱 {service.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Company Input */}
                        {currentStep === "company-input" && companyQuestionAsked && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handleCompanySubmit}>
                                        <input
                                            ref={companyInputRef}
                                            type="text"
                                            value={companyInput}
                                            onChange={(e) => setCompanyInput(e.target.value)}
                                            placeholder="Enter your company name"
                                            className="chatbot-input"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!companyInput.trim() || companyInput.trim().length < 2}
                                            className="chatbot-submit-btn"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Budget Options */}
                        {currentStep === "budget" && showOptions && !messages.some((m) => m.type === "typing") && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-options-bubble">
                                    <div className="options-grid">
                                        {BUDGET_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleBudgetSelect(option.value)}
                                                className="option-btn"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Phone Input */}
                        {currentStep === "phone-input" && phoneQuestionAsked && !isSubmitting && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handlePhoneSubmit}>
                                        <div ref={phoneInputRef} className="chatbot-phone-input-wrapper">
                                            <PhoneInput
                                                key="phone-input-field"
                                                country={"ae"}
                                                value={chatData.phone}
                                                onChange={handlePhoneChange}
                                                inputProps={{
                                                    name: "phone",
                                                    required: true,
                                                }}
                                                inputStyle={{
                                                    width: "100%",
                                                    height: "40px",
                                                    borderRadius: "8px",
                                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                                    backgroundColor: "white",
                                                    color: "#111b21",
                                                    paddingLeft: "50px",
                                                    fontSize: "14px",
                                                }}
                                                buttonStyle={{
                                                    border: "none",
                                                    backgroundColor: "transparent",
                                                    borderRight: "1px solid rgba(0, 0, 0, 0.2)",
                                                }}
                                                containerStyle={{
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!chatData.phone || !validateUAEPhone(chatData.phone)}
                                            className="chatbot-submit-btn"
                                        >
                                            Next
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        {currentStep === "email-input" && emailQuestionAsked && !isSubmitting && (
                            <div className="chatbot-message chatbot-message-bot">
                                <div className="message-bubble message-input-bubble">
                                    <form onSubmit={handleEmailSubmit}>
                                        <input
                                            ref={emailInputRef}
                                            type="email"
                                            value={chatData.email}
                                            onChange={(e) => setChatData((prev) => ({ ...prev, email: e.target.value }))}
                                            placeholder="Enter your email address"
                                            className="chatbot-input"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!chatData.email || !validateEmail(chatData.email) || isSubmitting}
                                            className="chatbot-submit-btn"
                                        >
                                            {isSubmitting ? "Sending..." : "Submit"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

