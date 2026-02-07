"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link className="flex items-center gap-2" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
            P
          </div>
          <span className="font-semibold text-lg">Pre-Clinic</span>
        </Link>

        {/* Dark mode toggle only */}
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
