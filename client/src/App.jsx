// import { useState } from 'react'
import './index.css'
import { GlobalStoreContextProvider } from './store/';
import { Routes, Route, useLocation} from 'react-router-dom';
import Map from './components/Map.jsx';
import NavBar from './components/NavBar.jsx';
import StateSelection from './components/StateSelection.jsx';
import MapView from './components/MapView.jsx';
import ScatterPlot from './components/ScatterPlot.jsx';

function App() {
  const location = useLocation();
  const showNavBar = location.pathname !== "/";
  // const showStateSelection = location.pathname === "/" || location.pathname.startsWith("/map/");

  /*remember to route to specific stateID*/
  return (
    <GlobalStoreContextProvider>
      <div className = 'flex'>
        {showNavBar && <NavBar/>}
        {/* {showStateSelection && <StateSelection/>} */}
        <StateSelection/>
        <div className = 'flex-1'>
          <Routes>
            <Route path = "/" element = {<Map/>}></Route>
            <Route path = "/map/:name" element = {<MapView />}></Route> 
            <Route path = "/scatterplot" element = {<ScatterPlot/>}></Route>
            <Route path = "/eiAnalysis"></Route>
            <Route path = "/ensembleSplits"></Route>
            <Route path = "/boxWhisker"></Route> 
          </Routes>
        </div>
      </div>
    </GlobalStoreContextProvider>
  )
}

export default App
