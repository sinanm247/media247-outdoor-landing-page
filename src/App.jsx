import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppLoader from './Components/AppLoader/AppLoader';
import AppRouter from './Components/AppRouter/AppRouter';
import routes from './Routes/Routes';
import Header from './Components/Common/Header/Header';
import Footer from './Components/Common/Footer/Footer';
import Chatbot from './Components/Common/Chatbot/Chatbot';
import ConsentPopup from './Components/Common/ConsentPopup/ConsentPopup';
import { PopupFormProvider } from './Components/Common/PopupForm/PopupFormContext';
import { initAttributionCapture } from './Utils/attribution';
import { initRecaptchaOnLanding } from './Utils/recaptcha';

export default function App() {
  const location = useLocation();
  const [ pageLoading, setPageLoading ] = useState(true);

  // Initialize attribution capture on app load
  useEffect(() => {
    initAttributionCapture();
    initRecaptchaOnLanding();
  }, []);

  useEffect(() => {
    setPageLoading(true);

    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 1500); // Adjust loader duration

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Normal site
  return (
    <>
      <AppLoader isVisible={pageLoading} />
        {!pageLoading && (
          <Fragment>
            <PopupFormProvider>
            <Header />
            <AppRouter routes={routes} />
            <Footer />
            <ConsentPopup />
            {location.pathname !== '/thank-you' && <Chatbot />}
            </PopupFormProvider>
          </Fragment>
        )}
    </>
  );
}