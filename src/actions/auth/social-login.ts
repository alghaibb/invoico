"use server";

import { signIn } from "@/auth";

export async function facebookLogin() {
  await signIn("facebook", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
  });
}

export async function googleLogin() {
  await signIn("google", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
  });
}
