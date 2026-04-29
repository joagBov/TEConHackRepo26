import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are logged in.</p>

      <Link to="/profile">Go to Profile</Link>

      <br />
      <br />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}