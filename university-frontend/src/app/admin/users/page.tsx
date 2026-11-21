"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import api from "@/utils/api";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}


export default function UsersPage() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
}, []);

const showToast = (message: string, type: "success" | "error") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast(null);
  }, 3000);
};

const handleAddUser = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/register", newUser);

    setUsers((prev) => [...prev, res.data.user]);

    setNewUser({ fullName: "", email: "", password: "", role: "student" });

    showToast("User created successfully 🎉", "success"); // ✅ AJOUT
  } catch {
    showToast("Failed to add user ❌", "error"); // ✅ AJOUT
  }
};

const handleDelete = async (id: number) => {
  try {
    await api.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((u) => u.id !== id));

    showToast("User deleted successfully 🗑️", "success");

  } catch {
    showToast("Failed to delete user ❌", "error");
  }
};


  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-center text-slate-600 shadow-sm">Loading...</p>;
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>

      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {toast && (
        <div
          className={`rounded-xl p-3 text-sm ${
            toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Add New User</h2>
        <form onSubmit={handleAddUser} className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            type="text"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <Select
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" className="md:col-span-2">
            Add User
          </Button>
        </form>
      </Card>

      <Table headers={["Name", "Email", "Role", "Actions"]}>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{u.fullName}</td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">{u.email}</td>
            <td className="px-4 py-3 text-sm capitalize text-slate-700">{u.role}</td>
            <td className="px-4 py-3 text-sm">
              <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </main>
  );
}

