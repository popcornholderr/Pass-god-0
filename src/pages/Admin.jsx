import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users_data")
      .select("*")
      .neq("status", "removed") // 👈 hide removed users
      .order("created_at", { ascending: false });

    if (!error) {
      setUsers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approveUser = async (id) => {
    await supabase
      .from("users_data")
      .update({ status: "approved" })
      .eq("id", id);

    loadUsers();
  };

  const removeUser = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this user?"
    );
    if (!confirm) return;

    await supabase
      .from("users_data")
      .update({
        status: "removed",
        deleted: true,
      })
      .eq("id", id);

    loadUsers();
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          Loading users...
        </p>
      )}

      {/* Empty */}
      {!loading && users.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          No users found
        </p>
      )}

      {/* Users */}
      {users.map((u) => (
        <div className="user-card" key={u.id}>
          <div className="user-info">
            <strong>{u.email}</strong>
            <span className={`badge ${u.status}`}>
              {u.status}
            </span>
          </div>

          <div className="actions">
            {u.status === "pending" && (
              <button
                className="approve"
                onClick={() => approveUser(u.id)}
              >
                Approve
              </button>
            )}

            <button
              className="remove"
              onClick={() => removeUser(u.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
