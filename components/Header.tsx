import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = ({ children, className }: Readonly<HeaderProps>) => {
  return (
    <div className={cn("header", className)}>
      <Link href={"/"}>
        <Image
          src={"/assets/icons/logo.svg"}
          alt="liveDocs"
          width={120}
          height={32}
          className="hidden md:block"
        />
        <Image
          src={"/assets/icons/logo-icon.svg"}
          alt="liveDocs"
          width={92}
          height={32}
          className="mr-2 md:hidden"
        />
      </Link>
      {children}
    </div>
  );
};

export default Header;
