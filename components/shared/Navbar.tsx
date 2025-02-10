import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ThemeSwitcher } from "../theme-switcher";

interface NavbarProps {
  isPublic?: boolean;
  className?: string;
}

const Navbar = ({ isPublic = false, className }: NavbarProps) => {
  return (
    <nav className={cn("w-full border-b bg-white", className)}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <Link
            href={isPublic ? "/store/products" : "/dashboard/products"}
            className="text-lg font-semibold hover:text-gray-600 transition-colors"
          >
            {isPublic ? <span>Products</span> : <span>Dashboard</span>}
          </Link>
        </div>

        <div className="flex items-center">
          <ThemeSwitcher />
          {!isPublic && (
            <div>
              <Link
                href="/dashboard/products/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
