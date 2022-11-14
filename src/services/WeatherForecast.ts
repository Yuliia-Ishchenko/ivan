import {url, authHeader, handleResponse} from '@/helpers/api'
import { AuthService } from "@/services"
export class WeatherForecastService {
    
   public static async getWeatherForecast(signal:any){
      const path = '/api/WeatherForecast'
      try{
         const requestOptions: any = {
            method: 'GET',
            headers: authHeader(),
            credentials: 'include',
            signal: signal,
            query: {aCount: 5,}
        };
        return fetch(url(path, requestOptions.query), requestOptions)
         .then(handleResponse)
         .then(data=>data)
         .catch(error=>Promise.reject(error));
      }
      catch(error) {
         // console.log(error);
      }
   }   
   
   public static async getTestDataByRange(from: string, to:string, signal: any){
      const path = '/api/Test/TestDataByRange'
         const requestOptions: any = {
            method: 'GET',
            headers: authHeader(),
            credentials: 'include',
            signal: signal,
            query: {aFrom: from, aTo: to}
        };
        return fetch(url(path, requestOptions.query), requestOptions)
         .then(handleResponse)
         .then(data=>data)
         .catch(error=>Promise.reject(error));
   }   
}