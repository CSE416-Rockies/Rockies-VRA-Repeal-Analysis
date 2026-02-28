import { Link, useLocation } from "react-router-dom"
import { useState, useContext } from "react"

import MapIcon from '../assets/svgs/map.svg?react';
import BarIcon from '../assets/svgs/bargraph.svg?react';
import EIAnalysisIcon from '../assets/svgs/eiAnalysis.svg?react';
import BoxPlotIcon from '../assets/svgs/boxandwhisker.svg?react';
import ScatterIcon from '../assets/svgs/scatterplot.svg?react';

import { Bars3Icon } from '@heroicons/react/24/solid'

import { GlobalStoreContext } from "../store";

export default function NavBar(){
    const { store } = useContext(GlobalStoreContext);
    const location = useLocation();
    
    const selectedStateName = store?.selectedState || "";
    const [expand, setExpand] = useState(false);
    const navItems = [
        {to: `/map/${selectedStateName}`, id: "map-nav", icon: MapIcon, label: "Map"},
        {to: "/scatterplot", id: "scatter-nav", icon: ScatterIcon, label: "Scatterplot"},
        {to: "/eiAnalysis", id: "boxplot-nav", icon: EIAnalysisIcon, label: "EI Analysis"},
        {to: "/ensembleSplits", id: "ensemble-nav", icon: BarIcon, label: "Ensemble Splits"},
        {to: "/boxWhisker", id: "boxWhisker-nav", icon: BoxPlotIcon, label: "Box & Whisker Data"},
    ]

    return(
        <div id = "navbar" 
            className = {`flex flex-col relative z-50 h-screen bg-white/30 backdrop-blur-sm shadow-md py-5 overflow-hidden transition-all duration-500 ease-in-out ${expand ? 'w-72' : 'w-16'}`}
            onMouseEnter={() => setExpand(true)}
            onMouseLeave={() => setExpand(false)}
        >
            <div id = "hamburgerMenu" className = "flex items-center justify-start w-12 ml-2">
                <Bars3Icon className = "nav-icon"/>
            </div>
            
            
            <div className = "w-full border-divide border-gray-300 my-5 overflow-hidden whitespace-nowrap">
            
                {navItems.map(({to, id, icon: Icon, label})=> {
                    const active = location.pathname == to;

                    return(
                        <Link key = {id} to = {to} id = {id} className = "nav-link group">
                            <div className= "flex items-center justify-center w-12">
                                <Icon className= {`nav-icon ${active ? "text-emerald-500":""}`}/>
                            </div>
                            <div className = {`nav-label p-4 transition-opacity duration-500 ${active? 'text-emerald-500':""} ${expand? 'opacity-100' : 'opacity-0'}`}>{label}</div>
                        </Link>
                    )

                })}
            </div>
            
            
        </div>
    )
}