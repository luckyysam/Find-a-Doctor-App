import { createContext } from "react";
import { type ClientLocation } from "../types";

export const LocationContext = createContext<ClientLocation | null>(null);