import { useContext } from "react";
import { PresenceContext } from "../components/context/PresenceContext.jsx";

export default function usePresence() {
  const context = useContext(PresenceContext);

  if (!context) {
    throw new Error(
      "usePresence must be used inside PresenceProvider"
    );
  }

  return context;
}