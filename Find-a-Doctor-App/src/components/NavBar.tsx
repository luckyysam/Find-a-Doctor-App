import { useEffect, useRef, useState } from 'react';
import { countries } from 'country-data-list';

import logo from '../assets/logo.png'

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpenCountries(false)
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
    setOpenCountries(false);
  };


  return (
    <>
      <div className="container-nav">
        <div className="logo-nav-links">
          <a href="/" className="logo-wrapper">
            <img src={logo} alt="FaD logo" />
          </a>

          <div className="nav-links-container">
            <div className="nav-links-inner">
              <div className="nav-link">
                <p><a href="./search-clinic">Find Clinics</a></p>
              </div>

              <div className="nav-link">
                <p><a href="./find-a-doctor">Try Symptom Search</a></p>
              </div>
            </div>
          </div>

        </div>

        <div className="select-country">
          <input 
            ref={inputRef}
            type="text" 
            placeholder='Search Country' 
            value={searchTerm}
            onChange={handleInputChange} 
            onFocus={()=> setOpenCountries(true)}
            autoComplete='off'
          />
          {openCountries && (
            <div className="country-dropdown" ref={dropdownRef}>
              {filteredCountries.length === 0 ? (
                <div className="">No countries found</div>
              ): (
                filteredCountries.map((country) => (
                  <div className="" 
                    key={country.name}
                    onClick={() => handleCountrySelect(country.name)}
                  >
                    {country.name} { country.emoji}
                  </div>
                ))
              ) }
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NavBar