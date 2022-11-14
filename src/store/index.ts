import { createStore } from 'vuex'

import {AuthModule} from "@/store/AuthModule";
import {WeatherForecastModule} from "@/store/WeatherForecastModule";
import {BaseModule} from "@/store/BaseModule";
import {ErrorModule} from "@/store/ErrorModule";

export default createStore({
  modules: {
    AuthModule,
    WeatherForecastModule,
    BaseModule,
    ErrorModule
  }
})