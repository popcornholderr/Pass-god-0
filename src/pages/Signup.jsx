import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    // CREATE USER RECORD
    await supabase.from("users_data").insert({
      id: data.user.id,
      email,
      status: "pending",
    });

    alert("Account created. Waiting for admin approval.");
    navigate("/");
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input name="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button>Sign Up</button>
        </form>
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
}
