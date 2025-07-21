import FaDlogo from '../assets/logo.png'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <>
      <footer>
        <div className="f-container">
          <img src={FaDlogo} alt="" />
          <p>{t('footer.p')}</p>
        </div>
      </footer>
    </>
  )
}


export default Footer