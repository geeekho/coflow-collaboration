"use client";
import Loader from "@/components/Loader";
import { SignUp, useAuth } from "@clerk/nextjs";
import React from "react";

const SinUpPage = () => {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <Loader />;
  return (
    <main className="auth-page">
      <SignUp />
    </main>
  );
};

export default SinUpPage;
