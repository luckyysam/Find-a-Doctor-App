import { useContext } from "react"
import { LocationContext } from "../context/LocationContext"
import SpecialtyCard from '../components/SpecialtyCard'
import CoupleImg from '../assets/gslvpBQcsewrasKXc8ip1j8pWnQ.avif'
import ClinicImg from '../assets/QjuNJ8gzqebcwfGzu9ekzNSM.avif'
import magnifyingGlassIcon from '../assets/magnifying-glass.svg'
import { type SpecialtyCardContent } from "../types"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router"
const HomePage = () => {
  const clientCountry = useContext(LocationContext)
  const navigate = useNavigate()

  const { t } = useTranslation()
  const specialties = t('specialties_section.grid_layout', { returnObjects: true }) as Record<string, SpecialtyCardContent>;

  return (
    <>
      <section id="hero-section">
        {/* Find Clinics */}
        <div className="find-doctor">
          <img src={CoupleImg} alt="A happy elderly couple" />
          <div className="find-doctor-text">
            <h1>{t('hero-section.find_clinic.h1')}</h1>
            <p className="hero-p">{t('hero-section.find_clinic.p')}</p>
            <button className="find-doctor-btn btn" onClick={() => navigate('/Find-a-Doctor')}>
              <Link to="/Find-a-Doctor" >{t('hero-section.find_clinic.button_text')}</Link>
              <img src={magnifyingGlassIcon} alt="magnifying glassg Icon" />
            </button>
          </div>
        </div>

        {/* Try Symptom Search */}

        <div className="symptom-search">

          <div className="symptom-search-text">
            <h2>{t('hero-section.symptom_search.h2')}</h2>
            <p className="hero-p">{t('hero-section.symptom_search.p')}</p>
            <button className="symptom-btn btn" onClick={() => { navigate('/symptom-search') }}>{t('hero-section.symptom_search.button_text')}</button>
          </div>

          <img src={ClinicImg} alt="A patient with a doctor" />
        </div>
      </section>


      <section id="specialties">
        <div className="list-speciaties">
          <h3>{t('specialties_section.h3')} <span className="country-s">{clientCountry?.country?.name_native}</span> </h3>
          <div className="find-healthcare">
          </div>

          <div className="layout-grid">
            {Object.keys(specialties).map((key: string, idx: number) => (
              <SpecialtyCard key={idx} idx={key}/>))
            }
          </div>
        </div>
      </section>
    </>
  )

}

export default HomePage