import { createContext, useCallback, useContext, useState } from "react";
import PopupForm from "./PopupForm";

const PopupFormContext = createContext({
  openPopup: () => {},
  closePopup: () => {},
});

export function usePopupForm() {
  return useContext(PopupFormContext);
}

export function PopupFormProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openPopup = useCallback(() => setOpen(true), []);
  const closePopup = useCallback(() => setOpen(false), []);

  return (
    <PopupFormContext.Provider value={{ openPopup, closePopup }}>
      {children}
      <PopupForm open={open} onClose={closePopup} />
    </PopupFormContext.Provider>
  );
}
