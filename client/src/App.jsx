// import { useState } from 'react'
import './index.css'
import { Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import StateSelection from './components/StateSelection.jsx';
import MapView from './components/MapView.jsx';


function App() {

  /*remember to route to specific stateID*/
  return (
    <>
      <NavBar/>
      <StateSelection/>
     
      <Routes>
        {/* <Route path = "/" element = {<Map/>}></Route> */}
        <Route path = "/map" element = {<MapView />}></Route> 
        <Route path = "/scatterplot"></Route>
        <Route path = "/eiAnalysis"></Route>
        <Route path = "/ensembleSplits"></Route>
        <Route path = "/boxWhisker"></Route> 
      </Routes>
    </>
  )
}

export default App
