import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import SpecialtyCard from '../components/SpecialtyCard'
import CoupleImg from '../assets/gslvpBQcsewrasKXc8ip1j8pWnQ.avif'
import ClinicImg from '../assets/QjuNJ8gzqebcwfGzu9ekzNSM.avif'


const HomePage = () => {


  return (
    <>
      <NavBar/>
      <section id="hero-section">
        {/* Find Clinics */}
        <div className="find-clinic">
          <img src={CoupleImg} alt="" />
          <div className="find-clinic-text">
            <h1>We Help You Find Care</h1>
            <p className="hero-p">Find doctors and clinics nearest to you, with up-to-date details and map integration.</p>
            <button className="find-clinic-btn btn">
              <a href="" >Search Clinics</a>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
            </button>
          </div>
        </div>

        {/* Try Symptom Search */}

        <div className="symptom-search">

          <div className="symptom-search-text">
            <h2>Try Symptom Search</h2>
            <p className="hero-p">Type your main symptoms or concerns and see how the AI suggests a specialty and finds the right doctor or clinic in your area instantly.</p>
            <button className="symptom-btn btn">Try it Now</button>
          </div>

          <img src={ClinicImg} alt="" />


        </div>
      </section>


      <section id="specialties">
        <div className="list-speciaties">
          <div className="find-healthcare">
            <h3>Find Healthcare Services in <span className="country-s">Finland</span> </h3>
          </div>

          <div className="layout-grid">
            <SpecialtyCard/>
            <SpecialtyCard/>
            <SpecialtyCard/>
            <SpecialtyCard/>
            <SpecialtyCard/>
            <SpecialtyCard/>
          </div>
        </div>
      </section>

      <Footer/>
    </>
  )

}

export default HomePage