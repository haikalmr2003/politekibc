import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Simple admin login page (no backend).
 * Credentials not validated — demonstration only.
 */
export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // For demo, accept any username/password
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ibc-light">
      <div className="w-full max-w-md p-6 card">
        <h2 className="text-xl font-semibold text-ibc-blue mb-4">Admin Login</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full p-3 border rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" className="w-full p-3 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="w-full px-4 py-3 bg-ibc-blue text-white rounded">Login</button>
        </form>
      </div>
    </div>
  );
}
