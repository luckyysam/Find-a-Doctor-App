import { useTranslation } from 'react-i18next'
import arrowRightSVG from '../assets/arrow-right.svg'
const images = import.meta.glob('../assets/*', { eager: true, as: 'url' });

interface SpecialtyCardProps {
  idx: string;
}

const SpecialtyCard = ({idx}: SpecialtyCardProps) => {
  const { t }  = useTranslation()
  const iconFileName = t(`specialties_section.grid_layout.${idx}.icon_link`)
  const iconPath = images[`../assets/${iconFileName}`] as string;

  return (
    <>
      <div className="s-container">
        <img src={iconPath} alt="" />
        <h3>{t(`specialties_section.grid_layout.${idx}.h3`)}</h3>
        <p>{t(`specialties_section.grid_layout.${idx}.p`)}</p>
        <div className="view-btn">
          <a href="">{t(`specialties_section.grid_layout.${idx}.a`)} </a>
          <img src={arrowRightSVG} alt="" />
        </div>
      </div>
    </>
  )
}

export default SpecialtyCard