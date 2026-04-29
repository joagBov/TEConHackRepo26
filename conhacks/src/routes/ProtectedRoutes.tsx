import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();

      setIsLoggedIn(!!data.session);
      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default ProtectedRoutes;