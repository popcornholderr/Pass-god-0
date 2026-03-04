import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("users_data")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approve = async (id) => {
    await supabase.from("users_data").update({ status: "approved" }).eq("id", id);
    loadUsers();
  };

  const removeUser = async (id) => {
  await supabase
    .from("users_data")
    .update({
      status: "removed",
      deleted: true
    })
    .eq("id", id);

  loadUsers();
};

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {users.map((u) => (
        <div className="user-card" key={u.id}>
          <div>
            <strong>{u.email}</strong>
            <span className={`badge ${u.status}`}>{u.status}</span>
          </div>

          <div className="actions">
            {u.status === "pending" && (
              <button className="approve" onClick={() => approve(u.id)}>
                Approve
              </button>
            )}
            <button className="remove" onClick={() => removeUser(u.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
