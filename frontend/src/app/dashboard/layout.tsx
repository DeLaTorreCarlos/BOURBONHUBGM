"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-black" />; // Blank screen while redirecting
  }

  return <>{children}</>;
}
