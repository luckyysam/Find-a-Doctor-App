import { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LocationContext } from '../context/LocationContext';
import { setIpLocation } from '../services/appLang';

import { type Language, type languageContent } from '../types';

import languages from '../locales/languages.json'
import { setAppLanguage } from '../services/appLang';

import logo from '../assets/logo.png'
import caretDown from '../assets/caret-down.svg'

const allLanguages: Language  = languages 

const NavBar = () => {  
  const [searchTerm, setSearchTerm] = useState('')
  const [openLanguage, setOpenLanguage] = useState<boolean>(false)
  const [languages, setLanguages] = useState<Language>(allLanguages)
  const [selectedLanguage, setSelectedLanguage] = useState<languageContent | null >(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)

  // Filter countries as user types
  useEffect(() => {
    if (searchTerm.trim() === ''){
      setLanguages(allLanguages)
    } else {
      setLanguages(
        allLanguages.filter( lang => 
          lang.language.toLowerCase().includes(searchTerm.toLowerCase()))
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
        handleCloseLanguageSelect()
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
    setOpenLanguage(true);
  };

  const handleLanguageSelect = (language: languageContent) => {
    setSelectedLanguage(language);
    setAppLanguage(language) // Language Content
    setSearchTerm(language.language);
    handleCloseLanguageSelect()
  };

  const handleUseMyLocation = () => {
    setSelectedLanguage(null)
    setIpLocation() // setIpLocation will call setAppLanguage with ClientIPLocation
    handleCloseLanguageSelect()
  }

  const handleCloseLanguageSelect = () => {
    setOpenLanguage(false)
    document.querySelector('.lang-container')?.classList.remove('active')
  }
    
  // DIsplay client Location with Geoapify IP API
  const clientIP = useContext(LocationContext)
  const { t } = useTranslation();

  useEffect(() => {
    const countryContainer = document.querySelector('.lang-container')
    const countryDropDown = document.querySelector('.language')
    countryDropDown?.addEventListener('click', () => countryContainer?.classList.add('active') )
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ openNav, setOpenNav] = useState<boolean>(false)


  // Mobile Nav Toggle 
  useEffect(() => {
    const button = document.querySelector('.mobile-nav-toggle')
    const navContainer = document.querySelector('.nav-links-container')

    if (!button || !navContainer) return;

    const handleToggle = () => {
      setOpenNav(prevOpenNav => {
        if (prevOpenNav) {
          navContainer.classList.remove('active')
          button.classList.remove('active')
        }
        else {
          navContainer.classList.add('active')
          button.classList.add('active')
        }

        return !prevOpenNav
      })
    }
     
    button?.addEventListener('click', handleToggle)

    // Cleanup to avoid duplicate listeners in Strict Mode
    return () => {
      button.removeEventListener('click', handleToggle)
    }
  }, [])

  
  return (
    <>
      <div className="nav-container">
        <div className="nav-content">
          <div className="logo-nav-links">
            <Link to="/" className="logo-wrapper">
              <img src={logo} alt="FaD logo" />
            </Link>

            <div className="nav-links-container">
              <div className="nav-links-inner">

                <ul className='nav-link'>
                  <li><Link to="./Find-a-Doctor">{t('navbar.find_clinics_navlink')}</Link></li>
                  <li><Link to="./symptom-search">{t('navbar.symptom_search_navlink')}</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="select-language">
            <div className="lang-container">
              {/* Ip Geolocation Detection */}
              <div className="language" onClick={()=> setOpenLanguage(true)}>
                <p>{selectedLanguage ? selectedLanguage?.language_code : clientIP?.country.iso_code}</p>
                <img src={caretDown} alt="caret-down" />
              </div>

              {openLanguage && (

                <div className="languages-dropdown">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={t('navbar.language.searchLang')}
                    value={searchTerm}
                    onChange={handleInputChange}
                    autoComplete='off' />
              
                  <div className="languages" ref={dropdownRef}>
                    {languages.length === 0 ? (
                      <div className="">{t('navbar.language.noLang')}</div>
                    ) : (
                      <> 
                        {/* Use IP */}
                        <div className="ip-detect" onClick={handleUseMyLocation}> 
                          <p>{t('navbar.language.myIP')}</p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M240,120H215.63A88.13,88.13,0,0,0,136,40.37V16a8,8,0,0,0-16,0V40.37A88.13,88.13,0,0,0,40.37,120H16a8,8,0,0,0,0,16H40.37A88.13,88.13,0,0,0,120,215.63V240a8,8,0,0,0,16,0V215.63A88.13,88.13,0,0,0,215.63,136H240a8,8,0,0,0,0-16ZM128,200a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,200Zm0-112a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152Z"></path></svg>
                        </div>
                        {languages.map((language) => (
                      
                          <div className="d-lang"
                            key={language.language}
                            onClick={() => handleLanguageSelect(language)}
                          >
                            {language.language}
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
      </div>
    </>
  )
}

export default NavBar