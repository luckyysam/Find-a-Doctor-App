import { createContext } from "react";
import { type ClientIPLocation } from "../types";

export const LocationContext = createContext<ClientIPLocation | null>(null);