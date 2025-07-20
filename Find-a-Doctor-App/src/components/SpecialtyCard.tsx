import pediatricsSVG from '../assets/pediatrics.svg'


const SpecialtyCard = () => {

  return (
    <>
      <div className="s-container">
        <img src={pediatricsSVG} alt="" />
        <h3>Pediatrics</h3>
        <p>Monitor your child's growth and development closely to ensure their health at every stage.</p>
        <div className="view-btn">

          <a href=""> 
            View Heathcare <img src="" alt="" /></a>
          
        </div>
      </div>
    </>
  )
}

export default SpecialtyCard