/**
 * GTM dataLayer for thank-you page (SPA).
 * - Push conversion event and virtual page_view from the ThankYou page after navigation
 *   so GTM runs in thank-you context (URL is /thank-you).
 * - In GTM: use Custom Event "thank_you_conversion" for conversion tags; use "page_view" for thank-you page triggers.
 */

export const THANK_YOU_CONVERSION_EVENT = "thank_you_conversion";

/** Event name for virtual page view (SPA route change) */
export const PAGE_VIEW_EVENT = "page_view";

/**
 * @typedef {Object} ConversionFormValues
 * @property {string} [name]
 * @property {string} [phone]
 * @property {string} [email]
 * @property {string} [service]
 * @property {string} [message]
 * @property {Record<string, string|number|boolean>} [additional] - merged into form_values
 */

/**
 * Push thank-you conversion event to dataLayer for GTM.
 * Pass the same form payload you send to the sheet (same field names and values).
 * @param {string} formSource - 'home_hero' | 'contact_form' | 'chatbot' | 'mortgage_calculator'
 * @param {ConversionFormValues & Record<string, unknown>} [formValues] - submitted form data (same as form fields)
 */
export function pushThankYouConversion(formSource, formValues = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const { additional = {}, ...rest } = formValues;
  const name = formValues.name ?? "";
  const phone = formValues.phone ?? "";
  const email = formValues.email ?? "";
  const service = formValues.service ?? "";
  const message = formValues.message ?? "";

  window.dataLayer.push({
    event: THANK_YOU_CONVERSION_EVENT,
    form_source: formSource,
    page: "thank-you",
    conversion_name: name,
    conversion_phone: phone,
    conversion_email: email,
    conversion_service: service,
    conversion_message: message,
    form_values: { ...rest, ...additional },
  });
}

/**
 * Push virtual page_view for thank-you page (SPA has no full reload).
 * Call this when ThankYou component mounts so GTM tags that fire on "Thank you page" can run.
 * In GTM: create trigger Custom Event = "page_view", and filter Page path = /thank-you (from the pushed page_path).
 */
export function pushThankYouPageView() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: PAGE_VIEW_EVENT,
    page_path: "/thank-you",
    page_location: window.location.href,
    page_title: document.title || "Thank You | Media247 Digital",
  });
}
