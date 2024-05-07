// @ts-nocheck

import axios from 'axios';
const BACKEND_URL = 'http://localhost:3000' || '';
import API from '../src/util/api'
import CreateUniversityDTO from '../../backend/src/routes/university/university-dto'

export async function getIds(){
  const uniId = createUniversity();
}

async function createUniversity() : number{
  const uni : CreateUniversityDTO = {
    name: 'dummy university',
    courses: []
  }
  postResponse(`${API.createUniversity}`, uni);
  
  const allUnis = getResponseObject(`${API.getUniversities}`);
  const x = await allUnis
  console.log(x)


}

async function getResponseObject(urlString : string) : Promise<any> {
  return (await axios.get(`${BACKEND_URL}${urlString}`)).data;
}

function postResponseObject(urlString : string, data : any) : Promise<any> {
  return axios.post(`${BACKEND_URL}${urlString}`, data);
}

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
   return error.response.status; // error.response.statusText
 }
}

