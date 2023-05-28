import React from 'react'
import { useAddress, useLogout , useDisconnect } from "@thirdweb-dev/react";


const Logout = () => {
    const { logout, isLoading } = useLogout();
    const address = useAddress();
    const { disconnect } = useDisconnect();
    
    console.log("address => ",address);

    return (
      
      <button>{address ? 'Sign Out' : 'Sign In'}</button>
      
    );
}

export default Logout