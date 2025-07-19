import SymptomInput from "./components/SymptomInput"
import NavBar from "./components/NavBar"
import HomePage from "./views/Homepage"
import { LocationProvider } from "./context/LocationProvider"
function App() {

  return (
    <LocationProvider>
      <HomePage/>
    </LocationProvider>
  )
}

export default App
