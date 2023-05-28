import React from "react";
import { useAddress, useLogout, useDisconnect } from "@thirdweb-dev/react";

const Logout = () => {
  const { logout, isLoading } = useLogout();
  const address = useAddress();
  console.log("address => ", address);
  const { disconnect } = useDisconnect();

  return <button>{address ? "Sign Out" : "Sign In"}</button>;
};

export default Logout;
