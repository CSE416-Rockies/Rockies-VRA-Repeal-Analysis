// import { useState } from 'react'
import './index.css'
import { Routes, Route, useLocation} from 'react-router-dom';
import Map from './components/Map.jsx';
import NavBar from './components/NavBar.jsx';
import StateSelection from './components/StateSelection.jsx';
import MapView from './components/MapView.jsx';


function App() {
  const location = useLocation();
  const showNavBar = location.pathname !== "/";

  /*remember to route to specific stateID*/
  return (
    <>
      {showNavBar && <NavBar/>}
      <StateSelection/>
     
      <Routes>
        <Route path = "/" element = {<Map/>}></Route>
        <Route path = "/map/:name" element = {<MapView />}></Route> 
        <Route path = "/scatterplot"></Route>
        <Route path = "/eiAnalysis"></Route>
        <Route path = "/ensembleSplits"></Route>
        <Route path = "/boxWhisker"></Route> 
      </Routes>
    </>
  )
}

export default App
