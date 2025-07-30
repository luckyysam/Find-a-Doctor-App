import SymptomInput from "../components/SymptomInput"


const SymptomSearch = () => {

  return (
    <section id="symptom-search">
      <h1 className="heading-text">AI-powered search.</h1>
      <p className="s-description">Simply type your symptoms. The app’s advanced AI interprets your description and directs you to the most relevant specialist.</p>
      <SymptomInput/>
    </section>
  )
}

export default SymptomSearch