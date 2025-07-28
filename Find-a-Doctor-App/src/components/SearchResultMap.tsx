import { useEffect, useRef, useState, useContext } from "react"
import { LocationContext } from "../context/LocationContext";
import { getAutoComplete } from "../services/geoapify"
import AllHealthcareProviders from "./AllHealthcareProviders"
import { getHealthcareProviders, getGeocodedLocation } from "../services/geoapify";

import { type AutoComplete, type Location, type FaDSpecialties, type ProviderResults } from "../types"

import 'maplibre-gl/dist/maplibre-gl.css';
import speciatiesJson from '../FaD/specialties.json'
import mapPin  from '../assets/map-pin.svg'
import magnifyingGlassIcon from '../assets/magnifying-glass.svg'


const SearchResultMap = () => {

  const [location, setLocation] = useState<Location | null>(null)
  const [locationInput, setLocationInput] = useState<string>('')
  const [autoCompletes, setAutoCompletes] = useState<AutoComplete | null> (null)
  const [sepcialty, setSpecialty] = useState<string>('')
  const [InputValue , setInputValue ] = useState<string>('')

  const locationInputRef = useRef<HTMLInputElement>(null)
  const autoCompleteRef = useRef<HTMLInputElement>(null)
  const specialtyInputRef = useRef<HTMLInputElement>(null)
  const specialtyListRef = useRef<HTMLDivElement>(null)

  // Get user lat and lon from thier IP to find healthcare providers in the area
  const [placeholderValue, setPlaceholderValue] = useState<string>('')
  const userLocation = useContext(LocationContext)

  // Set Location Input placeholder value with ClientIPLocation city name 
  useEffect(() => {
    if (userLocation?.city) {
      setPlaceholderValue(userLocation?.city?.names.en)
    }

    return () => setInputValue('')
  },[userLocation])


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
    
  // Open Specialty lists when user click on the input
  const specialties : FaDSpecialties = speciatiesJson
  useEffect(() => {
    const handleOpenSpecialtyList = () => {
      if (specialtyListRef.current) {
        specialtyListRef.current.classList.add('active')
      }
    }
    
    const handleCloseSpecialtyList = (event: MouseEvent) => {
      // if click is outside both input and the list, close
      if (
        (specialtyInputRef.current && !specialtyInputRef.current.contains(event.target as Node))
         && 
        (specialtyListRef.current && !specialtyListRef.current.contains(event.target as Node))
      ) {
        specialtyListRef.current.classList.remove('active')
      }
    }

    // Attach focus/click handler to input
    const inputNode = specialtyInputRef.current
    inputNode?.addEventListener('focus', handleOpenSpecialtyList)
    inputNode?.addEventListener('click', handleOpenSpecialtyList)

    // Attach global click handler for closing
    document.addEventListener('mousedown', handleCloseSpecialtyList)

    // Cleanup
    return () => {
      inputNode?.removeEventListener('focus', handleOpenSpecialtyList )
      inputNode?.removeEventListener('click', handleOpenSpecialtyList)
      document.removeEventListener('mousedown', handleCloseSpecialtyList)
    }


  }, [specialtyInputRef, specialtyListRef])


  const [specialtyLink, setSpecialtyLink] = useState<string>('')
  const handleSpecialtySelect = (type: string, specialty: string) => {
    specialtyListRef.current?.classList.remove('active')
    setSpecialty(specialty)
    setSpecialtyLink(`${type}.${specialty}`)
  }

  // Fetch Healthcare Providers when user Selects sepecialty
  const [healthCareProviders, setHealthCareProviders] = useState<ProviderResults>()
  useEffect(() => {
    const getProviders = async (specialty: string, lat: number, lon: number) => {
      const res = await getHealthcareProviders(specialty, lat, lon)
      setHealthCareProviders(res)
    }

    if (location && specialtyLink) {
      getProviders(specialtyLink, location.lat, location.lon)
    }
    if(!InputValue && userLocation?.location && specialtyLink) {
      getProviders(specialtyLink, userLocation?.location?.latitude, userLocation?.location?.longitude)
    }
  }, [specialtyLink, location, userLocation, InputValue])


  // User types in the input form but did not select from autocomplete suggestion 
  useEffect(() => {
    if (!locationInputRef.current) return

    const geocodeInput = async () => {
      if (InputValue){
        const location = await getGeocodedLocation(InputValue)
        setLocation(location)
      }
    }
    
    if (
      locationInputRef.current && 
      locationInputRef.current.value.trim() !=="" && 
      autoCompletes && 
      !location
    ){
      geocodeInput()
    }

  }, [InputValue, autoCompletes, location])

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
            <div className="input-l">
              <img src={mapPin} alt="map pin svg icon" />
              <input 
                ref={locationInputRef}
                type="text " 
                placeholder={placeholderValue}
                className="location-input"
                value={InputValue}
                onChange={(e) => handleInputAndSearch(e.target.value)}
                onClick={openAutoCompleteSuggestions}
              />

            </div>
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
              placeholder="Search doctors, clinics, hospitals, etc." className="specialty-input border-focus"
              value={sepcialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
            
            <div className="specialty-lists" ref={specialtyListRef}>
              {(Object.keys(specialties) as (keyof FaDSpecialties)[]).map((key) => (
                specialties[key].map((s: string, idx: number) => (
                  <div key={idx} className="specialty" onClick={() => handleSpecialtySelect(key, s)} >
                    <div className="type-specialty">
                      <div className="s-icon">
                        <img src={magnifyingGlassIcon} alt="magnifying glass Icon" />
                      </div>
                      <p>{s}</p>
                    </div>
                    
                    <p className="text-small">SPECIALTY</p>
                  </div>
                ))
              ))}
            </div>

          </div>
        </div>

        { healthCareProviders && (
          <div className="srm-results">
            <h2 className="result-heading">Nearby {sepcialty} Clinics & Hospitals</h2>

            <div className="result-map">
              <AllHealthcareProviders provider={healthCareProviders['HealthcareProviders']}  />
            </div>
          </div>
        )} 
      </div>


    </>
  )

}

export default SearchResultMap