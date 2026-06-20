import { useEffect, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("bharatai-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return user;
};

export default useAuth;
