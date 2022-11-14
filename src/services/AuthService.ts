import {url, handleResponse, authHeader} from '@/helpers/api'
import  Router  from '@/router'
export class AuthService {
    
   public static async Login(UserName: string, Password: string){
      const requestOptions:any = {
         method: 'POST',
         credentials: 'include',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ Name: UserName,Password: Password })
     };
     const path = process.env.VUE_APP_IS_SECURED=="true"?`/api/Users/SecureLogin`:`/api/Users/Login`
     return fetch(url(path), requestOptions)
            .then(handleResponse)
            .then(data => {
                  if (data.access_token) {
                     localStorage.setItem('user', JSON.stringify(data.access_token));
                  }
                  if (data.refresh_token) {
                     localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
                  }
                  return data.access_token;
            })
            .catch(error=>Promise.reject(error));
   } 
   
   public static async Logout (Token: string, RefreshToken: string){
      const requestOptions:any = {
         method: 'POST',
         credentials: 'include',
         headers: authHeader(),
         body: JSON.stringify({ token: Token, refreshToken: RefreshToken})
     };
     const path = process.env.VUE_APP_IS_SECURED=="true"?`/api/Users/SecureLogout`:`/api/Users/Logout`
     fetch(url(path), requestOptions)
            .then(handleResponse)
            .catch(error=>Promise.reject(error));
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
      Router.push({name: 'Login'})
   }

   public static async RefreshToken(Token: string, RefreshToken: string){
      const requestOptions:any = {
         method: 'POST',
         credentials: 'include',
         headers: authHeader(),
         body: JSON.stringify({ token: Token, refreshToken: RefreshToken})
     };
     const path = process.env.VUE_APP_IS_SECURED=="true"?`/api/Users/SecureRefreshToken`:`/api/Users/RefreshToken`
     return fetch(url(path), requestOptions)
            .then(handleResponse)
            .then(data => {
                  if (data.access_token) {
                     localStorage.setItem('user', JSON.stringify(data.access_token));
                  }
                  if (data.refresh_token) {
                     localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
                  }
                  return data.access_token;
            })
            .catch(error=>Promise.reject(error));
   } 
}

