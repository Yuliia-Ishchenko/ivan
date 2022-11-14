import { Module } from "vuex";
import { AuthService } from "@/services"
import store from '@/store'

type UserState = {
    userInfo: User | null,
    isLoged: boolean
}
type User = {
    loginName: string,
    expires: string
}


export const AuthModule : Module<UserState, GlobalState> = {
    state: {
        userInfo: {
            loginName: '',
            expires: ''
        },
        isLoged: false,
    },
    getters: {
        getUserInfo: ( state:any ) =>state.userInfo, 
        getAuthStatus: ( state:any ) => state.isLoged,
    },
    mutations: {
        loginSuccess(state, user) {
            state.isLoged = true;
            state.userInfo = user;
        },
        loginFailure(state) {
            state.isLoged = false;
            state.userInfo = null;
        },
        logout(state) {
            state.isLoged = false;
            state.userInfo = null;
        }
    },
    actions: {
        async login({ dispatch, commit }, { UserName, Password }) {
           
            await AuthService.Login(UserName, Password)
                .then(
                    access_token => {
                        const parsedToken = parseJwt(access_token) 
                        commit('loginSuccess', {loginName: parsedToken.unique_name, expires: parsedToken.exp});
                    }
                )
                .catch(error => {
                    commit('loginFailure');
                });
        },

        async refreshToken({ dispatch, commit }, { access_Token, refresh_Token}) {
           
            await AuthService.RefreshToken(access_Token, refresh_Token)
                .then(
                    access_token => {
                        const parsedToken = parseJwt(access_token) 
                        commit('loginSuccess', {loginName: parsedToken.unique_name, expires: parsedToken.exp});
                    }
                )
                .catch(error => {
                    commit('loginFailure');
                });
        },

        logout({ commit }) {
            const storedUser: any = localStorage.getItem('user');
            const storedRefreshToken: any = localStorage.getItem('refresh_token');
            if(storedUser!=null && storedRefreshToken!=null){
                AuthService.Logout(storedUser?.replace('"', '').slice(0, -1), storedRefreshToken?.replace('"', '').slice(0, -1));
            }
            commit('logout');
        },

        reload({commit}){
            const storedUser = localStorage.getItem('user');
            if(storedUser!=null){
                const parsedToken = parseJwt(storedUser) 
                commit('loginSuccess', {loginName: parsedToken.unique_name, expires: parsedToken.exp});
            }
        }
    
       
    }
}
function parseJwt(aToken: string) {
    
    const base64Url = aToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

