export function authHeader() {
   const storedUser = localStorage.getItem('user');
   const user = storedUser ? JSON.parse(storedUser) : null;
   if (user) {
     return { Authorization: 'Bearer ' + user , 'Content-Type': 'application/json'};
   } else {
     return {};
   }
 }