// import { useState } from 'react'
import './index.css'
import { GlobalStoreContextProvider } from './store/';
import { Routes, Route, useLocation} from 'react-router-dom';
import Map from './components/Map.jsx';
import NavBar from './components/NavBar.jsx';
import StateSelection from './components/StateSelection.jsx';
import MapView from './components/MapView.jsx';
import Gingles from './components/Gingles.jsx';
import EIAnalysis from './components/EIAnalysis.jsx';
import Ensemble from './components/Ensemble.jsx';
import MinorityEffect from './components/MinorityEffect.jsx';


function App() {
  const location = useLocation();
  const showNavBar = location.pathname !== "/";
  // const showStateSelection = location.pathname === "/" || location.pathname.startsWith("/map/");

  /*remember to route to specific stateID*/
  return (
    <GlobalStoreContextProvider>
      <div className = 'relative min-h-screen w-full overflow-hidden'>
        {showNavBar && (
          <div className="fixed top-0 left-0 z-[100] h-full">
            <NavBar />
          </div>
        )}
        {/* {showStateSelection && <StateSelection/>} */}
        <StateSelection/>
        <div className = 'overflow-hidden'>
          <Routes>
            <Route path = "/" element = {<Map/>}></Route>
            <Route path = "/map/:name" element = {<MapView />}></Route> 
            <Route path = "/gingles" element = {<Gingles/>}></Route>
            <Route path = "/eiAnalysis" element = {<EIAnalysis/>}></Route>
            <Route path = "/ensembles" element = {<Ensemble/>}></Route> 
            <Route path = "/minorityEffect" element = {<MinorityEffect/>}></Route> 
          </Routes>
        </div>
      </div>
    </GlobalStoreContextProvider>
  )
}

export default App
