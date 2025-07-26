import { useEffect, useRef, useState } from "react"
import { getAutoComplete } from "../services/geoapify"
import { type AutoComplete, type Location } from "../types"
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';



import ClinicsAndHospitals from "./ClinicsAndHospitals"
import ClinicsDetails from "./ClinicDetails"
import mapPin  from '../assets/map-pin.svg'


const SearchResultMap = () => {

  const [location, setLocation] = useState<Location | null>(null)
  const [locationInput, setLocationInput] = useState<string>('')
  const [autoCompletes, setAutoCompletes] = useState<AutoComplete | null> (null)
  const [sepcialty, setSpecialty] = useState<string>('')
  const [ InputValue , setInputValue ] = useState<string>('')
  
  const locationInputRef = useRef<HTMLInputElement>(null)
  const autoCompleteRef = useRef<HTMLInputElement>(null)
  const specialtyInputRef = useRef<HTMLInputElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  //  Auto complete suggestions for location input
  useEffect(() => {
    const autoComplete = async (location: string) => {
      const autoCompletes = await getAutoComplete(location)
      document.querySelector('.autocomplete-results')?.classList.add('active')
      setAutoCompletes(autoCompletes)
    }
    if (locationInput) {
      const timeoutId = setTimeout(autoComplete, 2000, locationInput)
      return () => clearTimeout(timeoutId)
    }

  }, [locationInput])

  // Close location dropdown 
  useEffect(() => {
    const handleCloseLocationInput =  (event: MouseEvent) => {
      if (
        ((locationInputRef && !locationInputRef.current?.contains(event.target as Node)) && 
          (autoCompleteRef && !autoCompleteRef.current?.contains(event.target as Node))) 
        ||
        (specialtyInputRef && specialtyInputRef.current?.contains(event.target as Node))

      ) {
        document.querySelector('.autocomplete-results')?.classList.remove('active')
      }
    }
    document.addEventListener('mousedown', handleCloseLocationInput)
    return () => {
      document.removeEventListener('mousedown', handleCloseLocationInput)
    }
  }, [])

  //  MapLibre setup
  const styleUrl = import.meta.env.VITE_GEOAPIFY_MAP_TILE_API
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current, // container id
      style: styleUrl,
      center: [0, 0], // starting position [lng, lat]
      zoom: 1 // starting zoom
    })

    map.addControl(new maplibregl.NavigationControl());

    return () => map.remove()
  })

  const handleSetLocation = (location: Location) => {
    setLocation(location)
    setInputValue(location.formatted)
    document.querySelector('.autocomplete-results')?.classList.remove('active')

  }


  const handleInputAndSearch = (e: string) => {
    setInputValue(e)
    setLocationInput(e)
  }


  // Open previous autoComplete suggestions when dropdown closes and user clicks on the location input the second time
  const openAutoCompleteSuggestions = () => {
    if (autoCompletes) {
      document.querySelector('.autocomplete-results')?.classList.add('active')
    }
  }

  return (
    <>
      <div className="srm-container">

        <div className="l-s-input">
          <div className="location-container">
            <input 
              ref={locationInputRef}
              type="text " 
              placeholder="Helsinki" 
              className="location-input border-focus"
              value={InputValue}
              onChange={(e) => handleInputAndSearch(e.target.value)}
              onClick={openAutoCompleteSuggestions}
            />
            <div className="autocomplete-results" ref={autoCompleteRef}>
              {
                autoCompletes && autoCompletes['results'].map((autoComplete, idx) => {
                  return (
                    <div key={idx} className="autocompletes" onClick={() =>handleSetLocation(autoComplete)}>
                      <img src={mapPin} alt="map pin" />
                      <p>{autoComplete.formatted}</p>
                    </div>
                  )
                })
              }
            </div>


          </div>
          <div className="specialty-container">
            <input 
              ref={specialtyInputRef}
              type="text" 
              placeholder="Gastroenterologist  in FInland" className="specialty-input border-focus"
              value={sepcialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>
        </div>

        <div className="srm-results">
          <h2 className="result-heading">Nearby Gastroenterology Clinics & Hospitals</h2>

          <div className="result-map">

            <div className="results">
              <ClinicsAndHospitals/>
              <ClinicsAndHospitals/>
              <ClinicsAndHospitals/>
              <ClinicsAndHospitals/>
              <ClinicsAndHospitals/>
            </div>

            <div className="map-geoapify">
              <div id="map" ref={mapContainerRef}></div>
            </div>

            <div className="view-detials">
              <ClinicsDetails/>
            </div>
          </div>
        </div>

      </div>


    </>
  )

}

export default SearchResultMap