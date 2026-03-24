import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getStateSummary = (stateName) => {
    return api.get(`/state/${stateName}/ensemble`);
}

export const getStateDetail = (stateName) =>{
    return api.get(`/state/${stateName}/detail`);
}

export const getEnsembleSplits = (stateName) =>{
    return api.get(`/state/${stateName}/ensembleSplits`);
}

export const getBoxWhiskers = (stateName) => {
    return api.get(`/state/${stateName}/boxWhiskers`);
}

export const getEIAnalysis = (stateName) => {
    return api.get(`/state/${stateName}/eiAnalysis`);
}

export const getGingles = (stateName) => {
    return api.get(`/state/${stateName}/gingles`);
}

export const getRepresentatives = (stateName) =>{
    return api.get(`/state/${stateName}/representatives`);
}

export const getPrecinctMap = (stateName) =>{
    return axios.get(`http://localhost:8080/${stateName}_precincts_topo.topojson`);
}

export const getCongressionalMap = (stateName) =>{
    return axios.get(`http://localhost:8080/${stateName}_Congressional_Districts.geojson`);
}