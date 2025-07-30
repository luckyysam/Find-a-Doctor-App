import { useRef, useEffect, useState } from "react";
import { type HealthcareProvider, type ClientIPLocation, type Location } from "../types"
import maplibregl from 'maplibre-gl';
import { getProviderWebsiteScreenShot } from '../services/microlink'

import { isLocationTypeClientIPLocation, isLocationTypeLocation } from "../util/typeChecker";

import mapPin from "../assets/map-pin (2).svg"
import phone from "../assets/phone.svg"
import globe from "../assets/globe.svg"
import arrowRight from "../assets/arrow-elbow-up-right.svg"
import emailIcon from "../assets/envelope-simple.svg"


interface providerProps {
  provider : HealthcareProvider[]
  location : Location | ClientIPLocation
}


const AllHealthcareProviders = ({ provider, location }: providerProps ) => {
  const healthCareProviderRef = useRef<HTMLDivElement>(null)

  const [ providerWebsiteScreenshot, setProviderWebsiteScreenshot ] = useState<string | undefined>(undefined)

  const setMapandFullDetails = async (healthcare : HealthcareProvider) => {
    setCoordinates(healthcare.geometry.coordinates)
    setFullDetails(healthcare)
    setProviderWebsiteScreenshot(undefined) // Don't show same img for other providers if response time takes a while

    if (healthcare.properties.website) {
      const data = await getProviderWebsiteScreenShot(healthcare.properties.website)
      if (data && data.screenshot?.url) {
        setProviderWebsiteScreenshot(data.screenshot.url)
      }else{
        setProviderWebsiteScreenshot(undefined)
      }

    }
    
  }
  
  // MapLibre setup  
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRef = useRef<maplibregl.Marker | null>(null)
  const [ coordinates, setCoordinates ] = useState<number[]>([])
  const styleUrl = import.meta.env.VITE_GEOAPIFY_MAP_TILE_API


  
  
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let lat = undefined
    let lon = undefined

    if (isLocationTypeClientIPLocation(location)) {
      lat = location.location?.latitude
      lon = location.location?.longitude
    }
    if (isLocationTypeLocation(location)) {
      lat = location.lat
      lon = location.lon
    }
  
    // Only initialize map once 
    if (!mapRef.current && lat && lon) {
      mapRef.current = new maplibregl.Map({
        container: mapContainerRef.current, // container id
        style: styleUrl,
        center: [lon, lat], // starting position [lng, lat]
        zoom: 10 // starting zoom
      })

      mapRef.current.addControl(new maplibregl.NavigationControl());
    }

    // If coordinates are set, update marker and zoom
    if (coordinates.length === 2 && mapRef.current) {
      // Remove previous marker if exists
      if (markerRef.current) {
        markerRef.current.remove();
      }
      // Add new marker
      markerRef.current = new maplibregl.Marker()
        .setLngLat([coordinates[0], coordinates[1]])
        .addTo(mapRef.current);

      // Zoom and center the map to the marker
      mapRef.current.flyTo({
        center: [coordinates[0], coordinates[1]],
        zoom: 14, // Adjust zoom level as needed
        speed: 1.2,
        curve: 1.42,
        essential: true
      });
    }
    
    return () => {
      // Remove marker if component unmounts
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
      
  }, [coordinates, styleUrl])


  // Show full detials
  const [fullDetails, setFullDetails] = useState<HealthcareProvider | null>(null )


  return (
    <>
      <div className="results">
        {provider.map((healthcare) => (
          <div className="cl-container" ref={healthCareProviderRef} key={healthcare.properties.osm_id} onClick={() => setMapandFullDetails(healthcare)}>
            <h3 className="text-medium">{healthcare.properties.name}</h3>
            <p className="color-fad text-small">Healthcare - {healthcare.properties.amenity}</p>
            <div className="flex-gap text-small">
              <img src={mapPin} alt="map-pin icon" />
              <p className="text-small">{healthcare.properties.address_line2}</p>
            </div>
            <div className="flex-gap center">
              <img src={phone} alt="phone icon" />
              <p className="text-small">{healthcare.properties.phone}</p>
            </div>

            <p className="text-small"><span className="color-fad">Open</span> {healthcare.properties.opening_hours}
            </p>

            <div className="web-dir">

              <div className="website">

                <a 
                  href={healthcare.properties.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="svg-wrapper">
                    <img src={globe} alt="" />
                  </div>
                </a>
                <p className="font-medium"> Website</p>
                  
              </div>

              <div className="direction">
                <div className="svg-wrapper">
                  <img src={arrowRight} alt="" />
                </div>
                <p className="font-medium">Direction</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="map-geoapify">
        <div id="map" ref={mapContainerRef}></div>
      </div>


      <div className="view-detials">
        { fullDetails && (
          <div className="cd-container">
            { providerWebsiteScreenshot && <img src={providerWebsiteScreenshot} alt="healthcare provider website img" />}
            <h3>{fullDetails.properties.name}</h3>
            <p className="color-fad">Healthcare - {fullDetails.properties.amenity}</p>
            <div className="address">
              <img src={mapPin} alt="" />
              <p>{fullDetails.properties.address_line2} </p>
            </div>
            <p> <span className="color-fad">Open</span> {fullDetails.properties.opening_hours}</p>

            <div className="phone">
              <img src={phone} alt="" />
              <p>{fullDetails.properties.phone}</p>
            </div>

            <div className="email">
              <img src={emailIcon} alt="" />
              <p>{fullDetails.properties.email}</p>
            </div>

            <div className="web-dir">
              <div className="website">
                <a href={fullDetails.properties.website}>
                  <div className="svg-wrapper">
                    <img src={globe} alt="" />
                  </div>
                </a>
                <p className="font-medium">Website</p>
              </div>
              <div className="direction">
                <div className="svg-wrapper">
                  <img src={arrowRight} alt="" />
                </div>
                <p className="font-medium">Direction</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}

export default AllHealthcareProviders