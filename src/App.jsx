import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import AdmHomePage from './pages/AdmHomePage'
import AdmLoginPage from './pages/AdmLoginPage'

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AdmLoginPage />}></Route>
          <Route path="/dashboard" element={<AdmHomePage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App
