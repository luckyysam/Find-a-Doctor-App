import mapPin from "../assets/map-pin (2).svg"
import phone from "../assets/phone.svg"
import globe from "../assets/globe.svg"
import arrowRight from "../assets/arrow-elbow-up-right.svg"
import emailIcon from "../assets/envelope-simple.svg"
import oralFI from "../assets/oral.fi.png"

const ClinicsDetails = () => {
    
  return (
    <>
      <div className="cd-container">
        <img src={oralFI} alt="" />
        <h3>Oulunkylän terveysaseman hammashoitola</h3>
        <p className="color-fad">Healthcare - Dentist</p>
        <div className="address">
          <img src={mapPin} alt="" />
          <p>Siltavoudintie 4, 00640 Helsinki, Finland </p>
        </div>
        <p> <span className="color-fad">Open</span> Mo-Fr 08:00-20:00, Fr 08:00-15:00</p>

        <div className="phone">
          <img src={phone} alt="" />
          <p>+358 10 400 3780</p>
        </div>

        <div className="email">
          <img src={emailIcon} alt="" />
          <p>itakeskus@oral.fi</p>
        </div>

        <div className="web-dir">
          <div className="website">
            <div className="svg-wrapper">
              <img src={globe} alt="" />
            </div>
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
    </>
  )
}

export default ClinicsDetails