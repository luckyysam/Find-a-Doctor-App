import pediatricsSVG from '../assets/pediatrics.svg'
import { useTranslation } from 'react-i18next'
interface SpecialtyCardProps {
  idx: string;
}

const SpecialtyCard = ({idx}: SpecialtyCardProps) => {

  const { t }  = useTranslation()
  return (
    <>
      <div className="s-container">
        <img src={pediatricsSVG} alt="" />
        <h3>{t(`specialties_section.grid_layout.${idx}.h3`)}</h3>
        <p>{t(`specialties_section.grid_layout.${idx}.p`)}</p>
        <div className="view-btn">

          <a href=""> 
            {t(`specialties_section.grid_layout.${idx}.a`)} <img src="" alt="" /></a>
          
        </div>
      </div>
    </>
  )
}

export default SpecialtyCard