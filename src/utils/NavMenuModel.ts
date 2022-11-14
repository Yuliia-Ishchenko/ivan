import  Router  from '@/router'
const home = {
  label: "Home",
  to: {name: "Home"},
}
const importExcel = {
  label:'Import',
  to: {name: 'Import'}
}
const logout = {
  label:'Odhlásit se',
  icon:'pi pi-fw pi-sign-out',
  command: () => {
    Router.push({name: 'Login'})
  }
}
export const loggedModel = [
  // home,
  // importExcel,
  // logout
]
