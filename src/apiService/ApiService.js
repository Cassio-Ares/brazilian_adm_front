import axios from 'axios';

const api = axios.create({
  baseURL: "https://brazilian-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepta cada requisição antes de ela ser enviada
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token') // Obtenha o token de onde ele estiver armazenado

    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config

}, error=>{
    return Promise.reject(error)
})


const apiCoordinates = axios.create({
    baseURL:'https://api.opencagedata.com/geocode',
    headers:{
        'Content-Type':'application/json'
    }
})

export { api,  apiCoordinates}