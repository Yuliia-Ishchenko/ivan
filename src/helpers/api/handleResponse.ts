import  Router  from '@/router'
import store from '@/store'

export async function handleResponse(response:any) {
   // console.log(response);
   try{
      const controllerName = getControllerName(response.url)
      const body = await getRequestBody(response);
      if (body == null && !response.ok){
         
         if (response.status === 401) {
            showErrorModal(`Code ${response.status}`, getMessage(response.status))
            Router.push({name: 'Login'})
          }
          else{
            showErrorModal(`${controllerName}: Code ${response.status}`, getMessage(response.status))
          }
          return Promise.reject(response.status);
      }
      if(!response.ok){
         showErrorModal(`${controllerName}: Code ${response.status}`, body.title?body.title:body)
          return Promise.reject(body);
      }
      return body;
   }
   catch(error){
      console.log(error);
   }
   
}

function showErrorModal(headerError :string, obj: string){
   store.dispatch('showError', {header: headerError, message: obj})
}

function getControllerName(url:string){
   const urlList:Array<string> = url.split('/')
   const controllerName = urlList[urlList.length-1]
   let result = controllerName
   if(controllerName.includes('?')){
      const witoutParameters = controllerName.split('?')
      result = witoutParameters[0]
   }
   return result
}

function  getRequestBody(response :Response){
   if(response.headers.get('Content-Type')==null){
      return null
   }
   else{
      if(response.headers.get('Content-Type')?.includes('text/plain')){
         return  response.text()
      }
      return response.json()
   }
}
   


function getMessage(status: string|number){
   switch(status) {
      case 400:
        return `Internal Server Error: `
      case 401:
         return 'Unauthorized. You need to log in'
      case 403:
         return 'Nemáte oprávnění k přístupu ke zdroji'
      case 404:
         return 'Chyba při přístupu k webu pomocí přesměrování adresy URL.'
      case 405:
         return 'Response method Not Allowed'
      case 415:
         return 'Unsupported Media Type'
      case 500:
         return 'Internal Server Error'
      case 502:
         return 'Bad Gateway'
      case 503:
         return 'Service Unavailable'
      default:
         return 'Internal Server Error'
    }
}
