"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import api from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        setMessage("Login successful.");
        router.push("/admin/dashboard");
      } else {
        setMessage("Unable to authenticate. Please try again.");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setMessage(err.response?.data?.error ?? "Server unavailable.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-500">Access your EduManage workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="you@university.edu"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="********"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {message ? <p className="text-center text-sm text-slate-600">{message}</p> : null}

        <p className="text-center text-sm text-slate-600">
          No account?{" "}
          <Link href="/register" className="font-semibold text-blue-700 hover:text-blue-800">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
