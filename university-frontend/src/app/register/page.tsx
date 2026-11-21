"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import api from "@/utils/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      setMessage("Registration successful.");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setMessage(err.response?.data?.error ?? "Server unavailable.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="mt-1 text-sm text-slate-500">Join EduManage in less than a minute</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            required
          />
          <Select name="role" label="Role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </Select>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        {message ? <p className="text-center text-sm text-slate-600">{message}</p> : null}
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
