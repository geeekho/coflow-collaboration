"use client";
import Loader from "@/components/Loader";
import { SignIn, useAuth } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <Loader />;
  return (
    <main className="auth-page">
      <SignIn />
    </main>
  );
};

export default SignInPage;
