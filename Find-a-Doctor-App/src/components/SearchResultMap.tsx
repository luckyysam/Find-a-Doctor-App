import { useEffect, useRef, useState, useContext } from "react"
import { LocationContext } from "../context/LocationContext";
import { getAutoComplete } from "../services/geoapify"
import AllHealthcareProviders from "./AllHealthcareProviders"
import { getHealthcareProviders, getGeocodedLocation } from "../services/geoapify";

import { type AutoComplete, type Location, type FaDSpecialties, type ProviderResults, type ClientIPLocation } from "../types"
import { isLocationTypeClientIPLocation, isLocationTypeLocation } from "../util/typeChecker";

import 'maplibre-gl/dist/maplibre-gl.css';
import speciatiesJson from '../FaD/specialties.json'
import mapPin  from '../assets/map-pin.svg'
import magnifyingGlassIcon from '../assets/magnifying-glass.svg'
import circleNotch from '../assets/circle-notch.svg'


const SearchResultMap = () => {

  const [location, setLocation] = useState<Location | ClientIPLocation |  null>(null)
  const [autoCompletes, setAutoCompletes] = useState<AutoComplete | null> (null)
  const [specialty, setSpecialty] = useState<string>('')
  const [locationInputValue , setLocationInputValue ] = useState<string>('')
  const [isSuggestionIgnored, setIsSuggestionIgnored] = useState<boolean>(false)  // Know if autocomplete suggestions is closed

  const locationInputRef = useRef<HTMLInputElement>(null)
  const autoCompleteRef = useRef<HTMLInputElement>(null)
  const specialtyInputRef = useRef<HTMLInputElement>(null)
  const specialtyListRef = useRef<HTMLDivElement>(null)

  // Get user latitude and longitude from thier IP to find healthcare providers in the area
  const [placeholderValue, setPlaceholderValue] = useState<string>('')
  const userLocation = useContext(LocationContext)

  // Set Location Input placeholder value with ClientIPLocation city name 
  useEffect(() => {
    if (userLocation?.city) {
      setPlaceholderValue(userLocation?.city?.names.en)
    }

    return () => setLocationInputValue('')
  },[userLocation])

  //  Auto complete suggestions for location input
  useEffect(() => {
    const autoComplete = async (location: string) => {
      // if autocomplete and location and autoCompleteRef is closed,  return 
      if (autoCompletes && location && !autoCompleteRef.current?.classList.contains('active')) return 
      const autoCompletesSuggestion  = await getAutoComplete(location)
      setAutoCompletes(autoCompletesSuggestion)
    }
    
    if (locationInputValue) {
      const timeoutId = setTimeout(autoComplete, 2000, locationInputValue)
      return () => clearTimeout(timeoutId)
    }

  }, [autoCompletes, locationInputValue])

  // Close location dropdown 
  useEffect(() => {
    const handleCloseLocationInput =  (event: MouseEvent) => {
      if (
        ((locationInputRef && !locationInputRef.current?.contains(event.target as Node)) && 
          (autoCompleteRef && !autoCompleteRef.current?.contains(event.target as Node))) 
        ||
        (specialtyInputRef && specialtyInputRef.current?.contains(event.target as Node))

      ) {
        autoCompleteRef.current?.classList.remove('active')
        if (autoCompletes) {
          setIsSuggestionIgnored(true)
        }

      }
    }
    document.addEventListener('mousedown', handleCloseLocationInput)
    return () => {
      document.removeEventListener('mousedown', handleCloseLocationInput)
    }
  }, [autoCompletes])
    
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
  const handleSpecialtySelect = (type: string, specialtyType: string) => {
    specialtyListRef.current?.classList.remove('active')
    if (specialtyType !== specialty ) {
      setSpecialty(specialtyType)
      setSpecialtyLink(`${type}.${specialtyType}`)
      setHealthCareProviders(null)
    }
  }

  // Fetch Healthcare Providers when user Selects sepecialty
  const [fetchingProviders, setFetchingProviders ] = useState<boolean>(false)
  const [healthCareProviders, setHealthCareProviders] = useState<ProviderResults | null>(null)
  useEffect(() => {
    const getProviders = async (specialty: string, lat: number, lon: number, locationInputValue: string) => {
      setFetchingProviders(true)
      const res = await getHealthcareProviders(specialty, lat, lon, locationInputValue)
      setHealthCareProviders(res)
      setFetchingProviders(false)
    }

    if ( location && specialtyLink ) {
      // If current location and specialty is the same as previously queried, Don't fetch
      // Compares latitude, longitude and specialty

      if (isLocationTypeClientIPLocation(location) && location.location?.latitude) {
        const latlonIsSame = (location.location?.latitude === healthCareProviders?.location[0] || location.location?.longitude === healthCareProviders?.location[1])
        const specialtyIsSame = (healthCareProviders?.specialty !== specialty)

        if ( !latlonIsSame || !specialtyIsSame) {
          getProviders(specialtyLink, location.location?.latitude, location.location?.longitude, locationInputValue )
        }
      }

      if (isLocationTypeLocation(location)) {
        const latlonIsSame = (location.lat === healthCareProviders?.location[0] || location.lon === healthCareProviders?.location[1])
        const specialtyIsSame = (healthCareProviders?.specialty !== specialty)

        if ( !latlonIsSame || !specialtyIsSame) {
          getProviders(specialtyLink, location.lat, location.lon, locationInputValue )
        }
      }
    }
  }, [location, specialtyLink, healthCareProviders, specialty, locationInputValue, userLocation ])


  // User types in the location and ignores autocomplete suggestion 
  useEffect(() => {
    if (!locationInputRef.current) return

    const geocodeInput = async () => {
      if (locationInputValue){
        const location = await getGeocodedLocation(locationInputValue)
        setLocation(location)
      }
    }

    if (
      locationInputRef.current && 
      locationInputRef.current.value.trim() !=="" && 
      autoCompletes && 
      (location === null) && (isSuggestionIgnored === true)
    ){
      geocodeInput()
    }

  }, [locationInputValue, autoCompletes, location, isSuggestionIgnored])


  const handleSetLocation = (location: Location) => {
    if (healthCareProviders) {
      setHealthCareProviders(null)
    }
    setLocation(location)
    setLocationInputValue(location.formatted)
    autoCompleteRef.current?.classList.remove('active')
  }


  const handleUseMyLocation = () => {
    setLocation(userLocation)
    setLocationInputValue(placeholderValue)
    autoCompleteRef.current?.classList.remove('active')
  }

  const handleLocationInput = (e: string) => {
    setLocationInputValue(e)
    setLocation(null)
    setAutoCompletes(null)
    setIsSuggestionIgnored(false)
  }

  // Open previous autoComplete suggestions when dropdown closes and user clicks on the location input the second time
  const openAutoCompleteSuggestions = () => {
    autoCompleteRef.current?.classList.add('active')

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
                value={locationInputValue}
                onChange={(e) => handleLocationInput(e.target.value)}
                onClick={openAutoCompleteSuggestions}
              />

            </div>
            <div className="autocomplete-results" ref={autoCompleteRef}>
              <div className="autocompletes" onClick={handleUseMyLocation}>
                <img src={mapPin} alt="map pin" />
                <p>Use my location</p>
              </div>
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
              value={specialty}
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
        
        { fetchingProviders && (   
          <div className="loading-container">
            <img src={circleNotch} alt="" className="spinner" />
          </div>)
        }

        { healthCareProviders && location && (
          <div className="srm-results">
            <h2 className="result-heading">Nearby {healthCareProviders.specialty} in { healthCareProviders.locationInputValue}</h2>
            { healthCareProviders.HealthcareProviders.length > 0 ?
              <div className="result-map">
                <AllHealthcareProviders provider={healthCareProviders['HealthcareProviders']} location={location} />
              </div>
              : <p style={{ textAlign: "center"}}>No Providers</p>
            }
            
          </div>
        )} 
      </div>


    </>
  )

}

export default SearchResultMap