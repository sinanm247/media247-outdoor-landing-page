import { toast } from "react-toastify";
import { getAttributionData, generateLeadId } from "./attribution";

// Google Apps Script Web App URL - Replace with your deployed web app URL
// To get this URL: Deploy > New deployment > Web app > Copy the URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCdzdycOToLkR7ucwHxH8FhsR8n8Na9T8QL2hm4ZuqHxpSNcNRzIfQmqi9CZIBJCCx/exec";

/**
 * Sends form data to Google Sheets via Google Apps Script.
 * Field names must match google-apps-script-sheet.js doPost():
 *   leadId, name, phone, email, message, source, serviceType|selectedService|service,
 *   company|companyName, budget, botMessageField, remarks, gclid, fbclid.
 * Sheet columns (script order): Lead ID, Date & Time, Name, Phone Number, Email, Service,
 * Budget, Company, Message, Bot Message Field, Bot Identified, Source, Lead Status, Conversion Sent, gclid, fbclid, Remarks.
 * Bot: when botMessageField is set, script sets Bot Identified = "Yes"; otherwise "No".
 */
export const sendToGoogleSheets = async (formData) => {
    // Skip if URL is not configured
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        console.warn("Google Sheets integration not configured. Skipping...");
        return { success: false, error: "Google Sheets URL not configured" };
    }

    try {
        // Get attribution data from localStorage
        const attribution = getAttributionData() || {};
        
        // Generate Lead ID if not provided
        const leadId = formData.leadId || generateLeadId();
        
        const serviceValue = formData.serviceType || formData.service || formData.selectedService || "";
        const dataToSend = {
            leadId: leadId,
            name: formData.name || "",
            phone: formData.phone || "",
            email: formData.email || "",
            message: formData.message || "",
            source: formData.source || "Contact Form",
            selectedService: formData.selectedService || serviceValue,
            interestedBefore: formData.interestedBefore !== undefined && formData.interestedBefore !== null ? formData.interestedBefore : null,
            serviceType: serviceValue,
            service: serviceValue,
            pageUrl: formData.pageUrl || "",
            botMessageField: formData.botMessageField || "",
            remarks: formData.remarks || "",
            company: formData.company || formData.companyName || "",
            budget: formData.budget || "",

            // Attribution (Google Ads)
            gclid: attribution.gclid || "",
            gbraid: attribution.gbraid || "",
            gad_source: attribution.gad_source || "",
            gad_campaignid: attribution.gad_campaignid || "",
            
            // Attribution data (Meta/Facebook)
            fbclid: attribution.fbclid || "",
            _fbp: attribution._fbp || "",
            _fbc: attribution._fbc || "",
            
            // UTM parameters
            utm_source: attribution.utm_source || "",
            utm_medium: attribution.utm_medium || "",
            utm_campaign: attribution.utm_campaign || "",
            utm_term: attribution.utm_term || "",
            utm_content: attribution.utm_content || "",
            utm_id: attribution.utm_id || "",
        };
        
        // Send as form-encoded so the request is "simple" and does not trigger CORS preflight.
        // Apps Script only has doGet/doPost (no OPTIONS), so preflight would block the POST.
        const formBody = "data=" + encodeURIComponent(JSON.stringify(dataToSend));
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody,
        });

        if (!response.ok) {
            const text = await response.text();
            console.warn("Google Sheets response not OK:", response.status, text);
            return { success: false, error: `Server returned ${response.status}` };
        }
        let result = { success: true, message: "Data sent successfully" };
        try {
            const json = await response.json();
            if (json && json.success === false) result = { success: false, error: json.error || "Unknown error" };
            else if (json && json.message) result.message = json.message;
        } catch (_) {
            // Response may be unreadable due to CORS; 200 usually means the script ran and wrote to sheet
        }
        return result;
        
    } catch (error) {
        console.error("Google Sheets error:", error);
        // Even if there's an error, the data might still be saved
        // Return success: false but don't block the main flow
        return { success: false, error: error.message };
    }
};

/**
 * Sends contact form data to Google Sheets (which automatically sends email notifications)
 * Google Apps Script handles email sending when data is saved
 * @param {Object} formData - Form data object
 * @param {string} formData.name - User's name
 * @param {string} formData.phone - User's phone number
 * @param {string} formData.email - User's email (optional)
 * @param {string} formData.message - Message content
 * @param {string} formData.source - Source of the form (optional, defaults to "Contact Form")
 * @param {string} formData.serviceType - Service type (optional)
 * @param {string} formData.service - Service (alternative field name, optional)
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const sendContactFormEmail = async (formData) => {
    try {
        // Only send to Google Sheets if it's NOT a chatbot submission
        // Chatbot submissions are handled separately by sendChatbotToGoogleSheets
        // Detect chatbot: message is "-" and no email (chatbot doesn't collect email)
        const isChatbotSubmission = formData.source === "Chatbot" || 
            (formData.message === "-" && (!formData.email || formData.email === ""));
        
        if (!isChatbotSubmission) {
            const formDataWithSource = {
                ...formData,
                source: formData.source || "Contact Form",
                selectedService: "",
                interestedBefore: null,
                serviceType: formData.serviceType || formData.service || formData.selectedService || "",
                pageUrl: "",
                botMessageField: formData.botMessageField || "",
                // Store any extra config (e.g. selected locations / formats) in Remarks column
                remarks: formData.remarks || formData.configuration || "",
                company: formData.company || formData.companyName || "",
                budget: formData.budget || "",
            };
            const result = await sendToGoogleSheets(formDataWithSource);
            
            if (result.success) {
                toast.success("Thank you for your message! We'll get back to you soon.");
                return { success: true, message: "Data saved successfully" };
            } else {
                throw new Error(result.error || "Failed to save data");
            }
        } else {
            // If it's a chatbot submission, just return success (handled separately)
            toast.success("Thank you for your message! We'll get back to you soon.");
            return { success: true };
        }
    } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Failed to send message. Please try again.");
        return { success: false, error: error.message || error };
    }
};

/**
 * Sends chatbot data to Google Sheets via Google Apps Script
 * @param {Object} chatData - Chatbot data object
 * @param {string} chatData.name - User's name
 * @param {string} chatData.phone - User's phone number
 * @param {string} chatData.email - User's email address
 * @param {string} chatData.selectedService - Selected service label
 * @param {boolean} chatData.interestedBefore - Whether user worked with mortgage broker before
 * @param {string} chatData.pageUrl - Page URL where chatbot was used
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const sendChatbotToGoogleSheets = async (chatData) => {
    // Get attribution data from localStorage
    const attribution = getAttributionData() || {};
    
    // Generate Lead ID if not provided
    const leadId = chatData.leadId || generateLeadId();
    
    const serviceValue = chatData.serviceType || chatData.service || chatData.selectedService || "";
    const formData = {
        leadId: leadId,
        name: chatData.name || "",
        phone: chatData.phone || "",
        email: chatData.email || "",
        message: "-",
        source: "Chatbot",
        selectedService: serviceValue,
        serviceType: serviceValue,
        service: serviceValue,
        interestedBefore: chatData.interestedBefore !== undefined && chatData.interestedBefore !== null ? chatData.interestedBefore : null,
        pageUrl: chatData.pageUrl || "",
        botMessageField: chatData.botMessageField || "",
        remarks: chatData.remarks || "",
        company: chatData.company || chatData.companyName || "",
        budget: chatData.budget || "",

        // Attribution (Google Ads)
        gclid: attribution.gclid || "",
        gbraid: attribution.gbraid || "",
        gad_source: attribution.gad_source || "",
        gad_campaignid: attribution.gad_campaignid || "",
        
        // Attribution data (Meta/Facebook)
        fbclid: attribution.fbclid || "",
        _fbp: attribution._fbp || "",
        _fbc: attribution._fbc || "",
        
        // UTM parameters
        utm_source: attribution.utm_source || "",
        utm_medium: attribution.utm_medium || "",
        utm_campaign: attribution.utm_campaign || "",
        utm_term: attribution.utm_term || "",
        utm_content: attribution.utm_content || "",
        utm_id: attribution.utm_id || "",
    };

    try {
        const result = await sendToGoogleSheets(formData);
        return result;
    } catch (error) {
        console.error("Failed to save chatbot data to Google Sheets (non-critical):", error);
        return { success: false, error };
    }
};

/**
 * Tracks WhatsApp click and sends lead to Google Sheets for offline conversion tracking
 * @param {string} pageUrl - Current page URL where WhatsApp was clicked
 * @returns {Promise<Object>} - Returns result with leadId
 */
export const trackWhatsAppClick = async (pageUrl = "") => {
    try {
        // Get attribution data from localStorage
        const attribution = getAttributionData() || {};
        
        // Generate Lead ID
        const leadId = generateLeadId();
        
        // Prepare WhatsApp lead data
        const whatsappLeadData = {
            // Lead identification
            leadId: leadId,
            
            // Form data (empty for WhatsApp clicks - user will provide info via WhatsApp)
            name: "",
            phone: "",
            email: "",
            message: "WhatsApp Click",
            source: "WhatsApp",
            selectedService: "",
            interestedBefore: null,
            serviceType: "",
            pageUrl: pageUrl || window.location.href,
            
            // Attribution data (Google Ads)
            gclid: attribution.gclid || "",
            gbraid: attribution.gbraid || "",
            gad_source: attribution.gad_source || "",
            gad_campaignid: attribution.gad_campaignid || "",
            
            // Attribution data (Meta/Facebook)
            fbclid: attribution.fbclid || "",
            _fbp: attribution._fbp || "",
            _fbc: attribution._fbc || "",
            
            // UTM parameters
            utm_source: attribution.utm_source || "",
            utm_medium: attribution.utm_medium || "",
            utm_campaign: attribution.utm_campaign || "",
            utm_term: attribution.utm_term || "",
            utm_content: attribution.utm_content || "",
            utm_id: attribution.utm_id || "",
        };
        
        // Send to Google Sheets (non-blocking - don't block WhatsApp redirect)
        sendToGoogleSheets(whatsappLeadData).then(result => {
            if (result.success) {
                console.log("WhatsApp click tracked and saved to Google Sheets successfully!", leadId);
            } else {
                console.warn("WhatsApp click tracking failed (non-critical):", result.error);
            }
        }).catch(error => {
            console.warn("WhatsApp click tracking error (non-critical):", error);
        });
        
        // Return leadId immediately (don't wait for Google Sheets)
        return { success: true, leadId };
        
    } catch (error) {
        console.error("WhatsApp click tracking error:", error);
        // Return success anyway - don't block WhatsApp redirect
        return { success: false, error: error.message };
    }
};