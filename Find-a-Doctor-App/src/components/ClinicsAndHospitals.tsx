import mapPin from "../assets/map-pin (2).svg"
import phone from "../assets/phone.svg"
import globe from "../assets/globe.svg"
import arrowRight from "../assets/arrow-elbow-up-right.svg"
const ClinicsAndHospitals = () => {

  return (
    <>
      <div className="cl-container">
        <h3 className="text-medium">Oulunkylän terveysaseman hammashoitola</h3>
        <p className="color-fad text-small">Healthcare - Dentist</p>
        <div className="flex-gap text-small">
          <img src={mapPin} alt="map-pin icon" />
          <p className="text-small">Siltavoudintie 4, 00640 Helsinki, Finland</p>
        </div>
        <div className="flex-gap center">
          <img src={phone} alt="phone icon" />
          <p className="text-small">+358 10 400 3780</p>
        </div>

        <p className="text-small"><span className="color-fad">Open</span> Mo-Fr 08:00-20:00, Fr 08:00-15:00
        </p>

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

export default ClinicsAndHospitals