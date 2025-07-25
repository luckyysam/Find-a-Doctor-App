import { BrowserRouter, Routes, Route } from "react-router"
import { LocationProvider } from "./context/LocationProvider"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import HomePage from "./pages/Homepage"
import SymptomSearch from "./pages/SymptomSearch"
import FindADoctor from "./pages/FindADoctor"
function App() {

  return (
    <BrowserRouter>
      <LocationProvider>
        <NavBar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Find-a-Doctor" element={<FindADoctor/>} />
          <Route path="/symptom-search" element={<SymptomSearch />} />
        </Routes>
        <Footer/>
      </LocationProvider>
    </BrowserRouter>
  )
}

export default App
