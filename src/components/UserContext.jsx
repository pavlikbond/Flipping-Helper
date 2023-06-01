import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "@clerk/nextjs";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  let { userId, sessionId } = useAuth();
  const [user, setUser] = useState({});
  useEffect(() => {
    if (sessionId) {
      console.log("getting user");
      fetch(`api/mongo_user?clerkId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        });
    }
  }, [sessionId]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
