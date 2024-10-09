"use client";

import { User, Plan } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { LoadingDots } from "@/components/loading";

const AccountPage = () => {
  const [user, setUser] = useState<(User & { Plan: Plan | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch session data
    const fetchUserSession = async () => {
      const res = await fetch("/api/get-session");
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
      } else {
        router.push("/login"); // Redirect to login if no user is found
      }
      setLoading(false);
    };

    fetchUserSession();
  }, [router]);

  if (loading) {
    return <LoadingDots />;
  }

  if (!user) {
    return null; // This will not be shown since the user is redirected
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}</h1>
      <p>Here is your account overview</p>

      <p>Email: {user.email}</p>
      <p>Plan: {user.Plan?.type}</p>
    </div>
  );
};

export default AccountPage;
