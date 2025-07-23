import HomePage from "./views/Homepage"
import { LocationProvider } from "./context/LocationProvider"

import { BrowserRouter } from "react-router"
function App() {

  return (
    <BrowserRouter>
      <LocationProvider>
        <HomePage/>
      </LocationProvider>
    </BrowserRouter>
  )
}

export default App
