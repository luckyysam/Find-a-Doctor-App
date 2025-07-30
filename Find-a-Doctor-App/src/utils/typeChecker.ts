/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClientIPLocation, type Location } from "../types"

export const isLocationTypeClientIPLocation = (location: any): location is ClientIPLocation => {
  return location && typeof location === 'object' && "location" in  location &&  "latitude" in location.location  && "longitude" in location.location
  
}
export const isLocationTypeLocation = (location: any): location is Location => {
  return location && typeof location === 'object' && "lat" in location && "lon" in  location
}