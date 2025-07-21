import React, { useEffect, useState } from "react";
import { LocationContext } from "./LocationContext";
import { getClientLocation } from "../services/geoapify";
import { type ClientLocation } from "../types";
import { setupAppLanguage } from "../services/appLang";

interface LocationProviderProps {
  children: React.ReactNode;
}
const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<ClientLocation | null>(null);

  
  useEffect(() => {
    // Try to load from sessionStorage first
    const cached = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setLocation(JSON.parse(cached));
        // Auto page translation with client IP
        setupAppLanguage(JSON.parse(cached))

        return;
      } catch (error) {
        console.error(error)
      }
    }

    // Otherwise, fetch from API
    const fetchLocation = async () => {
      try {
        const clientLocation = await getClientLocation();
        setLocation(clientLocation);
        // Auto page translation with client IP
        setupAppLanguage(clientLocation)
        sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clientLocation));
      } catch {
        setLocation(null);
      }
    };
    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
};