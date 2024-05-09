// @ts-nocheck

import axios from 'axios';
const BACKEND_URL = 'http://localhost:3000' || '';
import API from '../src/util/api'

export async function getResponseObject(urlString : string) : Promise<any> {
  return (await axios.get(`${BACKEND_URL}${urlString}`)).data;
}

export async function postResponseObject(urlString : string, data : any) : Promise<any> {
  try {
    return ((await axios.post(`${BACKEND_URL}${urlString}`, data)).data);
  }
  catch (error : any) {
    return error.response.data;
  }
  
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

