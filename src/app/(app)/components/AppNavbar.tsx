"use client";

import { AppUser } from "@/app/api/auth/authTypes";
import { Avatar } from "@/primitives/avatar";
import { Dropdown, DropdownButton } from "@/primitives/dropdown";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileMenu } from "./MobileMenu";
import { NavBrand } from "./NavBrand";
import { UserMenu } from "./UserMenu";

interface AppNavbarProps {
  user: AppUser | null;
  pathname: string;
  onSignOut: () => void;
}

export function AppNavbar({ user, pathname, onSignOut }: AppNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-8">
              <NavBrand />
              <DesktopNavigation pathname={pathname} />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <Dropdown>
                  <DropdownButton
                    as="button"
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Avatar
                      initials={
                        user?.name?.charAt(0) || user?.email?.charAt(0) || "U"
                      }
                      square={false}
                      className="size-7"
                    />
                    <div className="hidden text-left sm:block">
                      <div className="text-xs font-medium text-zinc-900 dark:text-white">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user?.email?.split("@")[0] || "user"}
                      </div>
                    </div>
                    <ChevronDownIcon className="size-4 text-zinc-400" />
                  </DropdownButton>
                  <UserMenu
                    anchor="bottom end"
                    user={user}
                    onSignOut={onSignOut}
                  />
                </Dropdown>
              </div>

              {/* Mobile menu button */}
              <button
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-zinc-50 md:hidden dark:hover:bg-zinc-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="size-6 text-zinc-600 dark:text-zinc-400" />
                ) : (
                  <Bars3Icon className="size-6 text-zinc-600 dark:text-zinc-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        pathname={pathname}
        user={user}
        onClose={() => setMobileMenuOpen(false)}
        onSignOut={onSignOut}
      />
    </>
  );
}
