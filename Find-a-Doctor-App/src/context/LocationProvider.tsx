import React, { useEffect, useState } from "react";
import { LocationContext } from "./LocationContext";
import { getClientLocation } from "../services/geoapify";
import { type ClientIPLocation } from "../types";
import { setAppLanguage } from "../services/appLang";

interface LocationProviderProps {
  children: React.ReactNode;
}
const LOCAL_STORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<ClientIPLocation | null>(null);

  useEffect(() => {
    // Try to load from sessionStorage first
    const cached = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        setLocation(JSON.parse(cached));
        // Auto page translation with client IP
        setAppLanguage(JSON.parse(cached))

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
        setAppLanguage(clientLocation)
        sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clientLocation));
      } catch (e) {
        setLocation(null);
        console.error('error fetching location', e)
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