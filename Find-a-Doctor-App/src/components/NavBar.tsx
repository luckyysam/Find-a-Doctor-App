import { useEffect, useRef, useState, useContext } from 'react';
import { countries } from 'country-data-list';
import { LocationContext } from '../context/LocationContext';

import logo from '../assets/logo.png'
import caretDown from '../assets/caret-down.svg'

const allCountries = countries.all
const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openCountries, setOpenCountries] = useState<boolean>(false)
  const [filteredCountries, setFilteredCountries] = useState(allCountries)
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)

  // Filter countries as user types
  useEffect(() => {
    if (searchTerm.trim() === ''){
      setFilteredCountries(allCountries)
    } else {
      setFilteredCountries(
        allCountries.filter(country => 
          country.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )

    }
  }, [searchTerm])

  // Close dropdown and remove active style on country-container when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleCloseCountrySelect()
        document.querySelector('.nav-links-container')?.classList.remove('active')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return ()=> {
      document.removeEventListener('mousedown', handleClickOutside)
    }

  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOpenCountries(true);
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    setSearchTerm(countryName);
    handleCloseCountrySelect()
  };

  const handleUseMyLocation = () => {
    setSelectedCountry('')
    handleCloseCountrySelect()
  }

  const handleCloseCountrySelect = () => {
    setOpenCountries(false)
    document.querySelector('.country-container')?.classList.remove('active')

  }
    
  // IP Geolocation Detection with Geoapify IP API
  const clientIP = useContext(LocationContext)


  useEffect(() => {
    const countryContainer = document.querySelector('.country-container')
    const countryDropDown = document.querySelector('.country')
    countryDropDown?.addEventListener('click', () => countryContainer?.classList.add('active') )
  }, [])


  // Mobile Nav Toggle 
  useEffect(() => {
    const button = document.querySelector('.mobile-nav-toggle')
    const navContainer = document.querySelector('.nav-links-container')
    button?.addEventListener('click', () => {
    
      if (navContainer?.hasAttribute('active')) {
        navContainer?.classList.remove('active')
      } else {
        // change imageurl 
        // open tab of nav links 
        console.log('HELLO')
        navContainer?.classList.add('active')
      }

     
      
    })
  }, [])

  


  return (
    <>
      <div className="container-nav">
        <div className="logo-nav-links">
          <a href="/" className="logo-wrapper">
            <img src={logo} alt="FaD logo" />
          </a>

          <div className="nav-links-container">
            <div className="nav-links-inner">

              <ul className='nav-link'>
                <li><a href="./search-clinic">Find Clinics</a></li>
                <li><a href="./find-a-doctor">Try Symptom Search</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="select-country">
          <div className="country-container">
            {/* Ip Geolocation Detection */}
            <div className="country" onClick={()=> setOpenCountries(true)}>
              <p>{selectedCountry? selectedCountry : clientIP?.country.names.en}</p>
              <img src={caretDown} alt="caret-down" />
            </div>

            {openCountries && (

              <div className="country-dropdown">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder='Search Country'
                  value={searchTerm}
                  onChange={handleInputChange}
                  autoComplete='off' />
              
                <div className="countries" ref={dropdownRef}>
                  {filteredCountries.length === 0 ? (
                    <div className="">No countries found</div>
                  ) : (
                    <> 
                      {/* Use IP */}
                      <div className="ip-detect" onClick={handleUseMyLocation}> Use my location </div>
                      {filteredCountries.map((country) => (
                      
                        <div className=""
                          key={country.name}
                          onClick={() => handleCountrySelect(country.name)}
                        >
                          {country.name} {country.emoji}
                        </div>
                      ))}
                    </>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

        <button className="mobile-nav-toggle"></button>

      </div>
    </>
  )
}

export default NavBar