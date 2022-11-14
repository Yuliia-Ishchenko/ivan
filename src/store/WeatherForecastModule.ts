import { Module } from "vuex";
import { WeatherForecastService } from "@/services"

type WeatherForecastState={
   weatherForecastList: Array<WeatherForecast>
   testDataList: Array<any>
   
}
type WeatherForecast={
   date: string,
   TemperatureC: number,
   TemperatureF: number,
   Summary: string
}
export const WeatherForecastModule : Module<WeatherForecastState, GlobalState> = {
   state: {
      weatherForecastList: [],
      testDataList: []
   },
   getters: {
       getWeatherForecast: (state) => state.weatherForecastList,
       getTestData: (state) => state.testDataList,
   },
   mutations: {
      setWeatherForecast: (state, values) => state.weatherForecastList = values,
      setTestData: (state, values) => state.testDataList = values,
   },
   actions: {
      async getWeatherForecast ( { commit, dispatch }, signal=null)
      {
         await WeatherForecastService.getWeatherForecast(signal)
            .then(
               data => commit("setWeatherForecast", data),
            )
            .catch(error=>{
               // console.log("Module error", error );
            })
      },

      async getTestDataByRange ( { commit, dispatch }, {Range, signal=null })
      {
         await WeatherForecastService.getTestDataByRange(Range.from, Range.to, signal)
            .then(
               data => commit("setTestData", data)
            )
            .catch(error=>{
               // console.log("Module error", error );
            })
      },
      
   }
}