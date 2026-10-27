import { useCallback, useMemo, useState } from "react";
import { NavContext } from "./components/Navbar/Nanbar.jsx";

export function NavigationProvider({ children }) {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const [groupsIntroSeen, setGroupsIntroSeen] = useState(false);

  const navigate = useCallback(
    (pageId) => {
      if (pageId === "home" || pageId === "login") {
        setActive(pageId);
        return;
      }

      if (!user) {
        setActive("login");
        return;
      }

      if (
        pageId === "groups" &&
        user.role !== "verifiedStudent"
      ) {
        setActive("groups");
        return;
      }

      setActive(pageId);
    },
    [user]
  );

  const login = useCallback((userData) => {
    setUser(userData);
    setActive("home");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActive("home");
  }, []);

  const markGroupsIntroSeen = useCallback(() => {
    setGroupsIntroSeen(true);
  }, []);

  const value = useMemo(
    () => ({
      active,
      navigate,
      user,
      setUser,
      login,
      logout,
      groupsIntroSeen,
      markGroupsIntroSeen,
    }),
    [
      active,
      navigate,
      user,
      login,
      logout,
      groupsIntroSeen,
      markGroupsIntroSeen,
    ]
  );

  return (
    <NavContext.Provider value={value}>
      {children}
    </NavContext.Provider>
  );
}

export default NavigationProvider;