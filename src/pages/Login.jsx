import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    const { data: userData } = await supabase
      .from("users_data")
      .select("status")
      .eq("id", data.user.id)
      .single();

    if (
  !userData ||
  userData.status !== "approved" ||
  userData.deleted
) {
  alert("Account disabled. Contact admin.");
  await supabase.auth.signOut();
  return;
}

    window.location.href = "/pass.html";
  };

  return (
    <div className="page-wrapper">
  <div className="card">
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button>Login</button>
    </form>
    <Link to="/signup">Create Account</Link>
  </div>
</div>
  );
}
