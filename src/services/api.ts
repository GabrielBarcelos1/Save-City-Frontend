import axios from "axios";

export const viacep = axios.create({
  baseURL: "https://viacep.com.br/ws/",
});

export const api = axios.create({
    baseURL:'https://save-city-backend-gabrielbarcelos1.vercel.app'
})


