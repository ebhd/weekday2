"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Squash as Hamburger } from "hamburger-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/features/auth/store";
import { useNavbarUiState, customEase } from "./useNavbarUiState";
import { useRouter } from "next/navigation";
import {
  isAdmin,
  isArtist,
  isRegularUser,
  isLoggedIn,
} from "@/features/auth/roles";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const loggedIn = isLoggedIn(user);
  const admin = isAdmin(user?.role);
  const artist = isArtist(user?.role);
  const regularUser = isRegularUser(user?.role);

  let primaryHref = "/register";
  let primaryLabel = "Sign Up";

  if (loggedIn) {
    if (admin) {
      primaryHref = "/admin";
      primaryLabel = "Dashboard";
    } else if (artist) {
      primaryHref = "/profile";
      primaryLabel = "Profile";
    } else if (regularUser) {
      primaryHref = "/profile";
      primaryLabel = "Profile";
    }
  }

  const {
    openMobileNav,
    setOpenMobileNav,
    handleClose,
    hrVariant,
    liVariant,
    navVariant,
  } = useNavbarUiState();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* === Navbar Bar === */}
      <nav className="flex justify-between items-center pt-5 text-sm font-sans relative z-[1000]">
        {/* --- Logo --- */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="weekday logo"
            width={145}
            height={60}
            className="mr-4"
          />
        </Link>

        {/* --- Desktop Menu --- */}
        <ul className="hidden md:flex gap-x-12 text-white">
          <li>
            <Link
              href="/"
              className="relative inline-block no-underline after-line"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/search"
              className="relative inline-block no-underline after-line"
            >
              Search
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="relative inline-block no-underline after-line"
            >
              Over ons
            </Link>
          </li>
          <li>
            <Link
              href="/who"
              className="relative inline-block no-underline after-line"
            >
              Wie is Wie
            </Link>
          </li>
          <li>
            <Link
              href="/interview"
              className="relative inline-block no-underline after-line"
            >
              Interview
            </Link>
          </li>
          <li>
            <Link
              href="/webinar"
              className="relative inline-block no-underline after-line"
            >
              Webinar
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="relative inline-block no-underline after-line"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/promovideo"
              className="relative inline-block no-underline after-line"
            >
              Promovideo
            </Link>
          </li>
        </ul>

        {/* --- Desktop Buttons --- */}
        <div className="hidden md:flex">
          {user ? (
            <Button
              className="cursor-pointer"
              size="lg"
              variant="ghost"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button size="lg" variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

          <Button size="lg" variant="default" asChild>
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
        </div>

        {/* --- Mobile Hamburger --- */}
        <div className="md:hidden z-[1001]">
          <Hamburger
            color="white"
            rounded
            size={30}
            toggled={openMobileNav}
            toggle={setOpenMobileNav}
          />
        </div>
      </nav>

      {/* === Overlay Background === */}
      <AnimatePresence>
        {openMobileNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 z-[997] backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* === Animated Mobile Menu === */}
      <AnimatePresence mode="wait">
        {openMobileNav && (
          <motion.nav
            variants={navVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 flex flex-col items-center justify-center gap-8 text-white z-[998] bg-background"
          >
            {/* Home */}
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.1, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/" className="hover:text-gray-300 duration-200">
                Home
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>

            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.2, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/search" className="hover:text-gray-300 duration-200">
                Search
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>

            {/* About us */}
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.3, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/about" className="hover:text-gray-300 duration-200">
                Over ons
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.3, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/who" className="hover:text-gray-300 duration-200">
                Wie is Wie?
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.3, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/who" className="hover:text-gray-300 duration-200">
                Interview
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.3, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/who" className="hover:text-gray-300 duration-200">
                Webinar
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.3, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/who" className="hover:text-gray-300 duration-200">
                Blogs
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.3, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold"
            >
              <Link href="/who" className="hover:text-gray-300 duration-200">
                Promovideo
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>

            {/* Login */}
            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.4, ease: customEase }}
              className="text-4xl sm:text-5xl font-semibold"
            >
              {loggedIn ? (
                <button
                  onClick={async () => {
                    await handleLogout();
                    handleClose();
                  }}
                  className="hover:text-gray-300 duration-200"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={handleClose}
                  className="hover:text-gray-300 duration-200"
                >
                  Login
                </Link>
              )}
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>

            <motion.div
              variants={liVariant}
              transition={{ duration: 0.3, delay: 0.5, ease: customEase }}
              onClick={handleClose}
              className="text-4xl sm:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
            >
              <Link href={primaryHref} className="duration-200">
                {primaryLabel}
              </Link>
              <motion.hr
                variants={hrVariant}
                className="bg-gray-600 h-px w-full mt-2"
              />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
