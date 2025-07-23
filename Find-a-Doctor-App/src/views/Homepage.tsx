import { useContext } from "react"
import { LocationContext } from "../context/LocationContext"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import SpecialtyCard from '../components/SpecialtyCard'
import CoupleImg from '../assets/gslvpBQcsewrasKXc8ip1j8pWnQ.avif'
import ClinicImg from '../assets/QjuNJ8gzqebcwfGzu9ekzNSM.avif'
import { type SpecialtyCardContent } from "../types"
import { useTranslation } from "react-i18next"
const HomePage = () => {
  const clientCountry = useContext(LocationContext)

  const { t } = useTranslation()
  const specialties = t('specialties_section.grid_layout', { returnObjects: true }) as Record<string, SpecialtyCardContent>;

  return (
    <>
      <NavBar/>
      <section id="hero-section">
        {/* Find Clinics */}
        <div className="find-clinic">
          <img src={CoupleImg} alt="" />
          <div className="find-clinic-text">
            <h1>{t('hero-section.find_clinic.h1')}</h1>
            <p className="hero-p">{t('hero-section.find_clinic.p')}</p>
            <button className="find-clinic-btn btn">
              <a href="" >{t('hero-section.find_clinic.button_text')}</a>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
            </button>
          </div>
        </div>

        {/* Try Symptom Search */}

        <div className="symptom-search">

          <div className="symptom-search-text">
            <h2>{t('hero-section.symptom_search.h2')}</h2>
            <p className="hero-p">{t('hero-section.symptom_search.p')}</p>
            <button className="symptom-btn btn">{t('hero-section.symptom_search.button_text')}</button>
          </div>

          <img src={ClinicImg} alt="" />


        </div>
      </section>


      <section id="specialties">
        <div className="list-speciaties">
          <div className="find-healthcare">
            <h3>{t('specialties_section.h3')} <span className="country-s">{clientCountry?.country?.name_native}</span> </h3>
          </div>

          <div className="layout-grid">
            {Object.keys(specialties).map((key: string, idx: number) => (
              <SpecialtyCard key={idx} idx={key}/>))
            }
          </div>
        </div>
      </section>

      <Footer/>
    </>
  )

}

export default HomePage