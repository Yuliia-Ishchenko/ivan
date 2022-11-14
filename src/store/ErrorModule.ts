import { Module } from "vuex";

type ErrorState = {
    errorHeader: string,
    errorMessage: string,
    showError: boolean
}

export const ErrorModule: Module<ErrorState, GlobalState> = {
    state:{
        errorHeader: "",
        errorMessage: "",
        showError: false
    },
    getters:{
        showError: (state) => state.showError,
        errorHeader: (state) => state.errorHeader,
        errorMessage: (state) => state.errorMessage,
    },
    mutations: {
        show_error(state, { header, message }) {
            state.showError = true
            state.errorHeader = header
            state.errorMessage = message
        },
        close_error(state) {
            state.showError = false
            state.errorMessage = ""
            state.errorHeader = ""
        }
    },
    actions: {
        showError({ commit }, { header, message }) {
            commit("show_error", { header, message })
        },
        closeError({ commit }) {
            commit("close_error")
        }
    }
}