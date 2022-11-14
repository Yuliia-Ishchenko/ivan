import { Module } from "vuex";

type BaseState = {
  isFetchingData: boolean
}

export const BaseModule: Module<BaseState, GlobalState> = {
    state: {
      isFetchingData: false,
    },
    getters: {
      isFetchingData: (state)=> state.isFetchingData,
    },
    mutations: {
      setFetchingData: (state, value) => state.isFetchingData = value,
    },
}