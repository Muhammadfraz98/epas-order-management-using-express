import React from "react";
import {Navigate} from 'react-router-dom'


function RequireAuth({ children }) {
    
  const user = JSON.parse(localStorage.getItem('user'))
  let token = user?.access_token ? user?.access_token : null
  
    if (!token) {
      
      return <Navigate to="/login" />;
    }
  
    return children;
  }

  export default RequireAuth;