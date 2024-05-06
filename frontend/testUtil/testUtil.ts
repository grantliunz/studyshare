import axios from 'axios';
const BACKEND_URL = 'http://localhost:3000' || '';

export async function getResponse(urlString : string) : Promise<number> {
 try {
   return (await axios.get(`${BACKEND_URL}${urlString}`)).status;
 } catch (error : any) {
   return error.response.status;
 }
}

export async function postResponse(urlString : string, data : any) : Promise<number> {
 try {
   return (await axios.post(`${BACKEND_URL}${urlString}`, data)).status;
 } catch (error : any) {
   return error.response.status;
 }
}

