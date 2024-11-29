"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// must be client component will be caught at
// runtime with error boundries

const DashboardError = () => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/");
  };
  return (
    <div className="loader flex-col gap-2">
      <h2 className="text-28-semibold">Something unexpected happened :( </h2>
      <Button size={"lg"} onClick={handleRedirect}>
        Home
      </Button>
    </div>
  );
};

export default DashboardError;
