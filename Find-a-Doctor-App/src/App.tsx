import SymptomInput from "./components/SymptomInput"
import NavBar from "./components/NavBar"
import { LocationProvider } from "./context/LocationProvider"
function App() {

  return (
    <LocationProvider>
      <div className="wrapper">
        <NavBar/>
      </div>
    </LocationProvider>
  )
}

export default App
