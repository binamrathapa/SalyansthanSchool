import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ChinoLoader from "../components/ui/ChinoLoader/ChinoLoader";

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("_UPLFMMATRIX");
    const user = localStorage.getItem("user");

    if (token && user) {
      queryClient.setQueryData(["auth"], {
        token,
        user: JSON.parse(user),
      });
    }

    setIsAuthReady(true); 
  }, [queryClient]);

  if (!isAuthReady) {
    return <ChinoLoader/>;
  }

  return children;
};

export default AuthProvider;
