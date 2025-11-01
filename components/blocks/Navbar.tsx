"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Squash as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

export function Navbar() {
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const customease = [0.05, 0.58, 0.57, 0.96];
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (!isMobile) setOpenMobileNav(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflowY = openMobileNav ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [openMobileNav]);

  const hrVariant = {
    initial: {
      width: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: customease },
    },
    animate: {
      width: "100%",
      opacity: 1,
      transition: { duration: 0.5, ease: customease },
    },
    exit: {
      width: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: customease },
    },
  };

  const liVariant = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  };

  const navVariant = {
    initial: { opacity: 0, scale: 1.1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: customease },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.2, delay: 0.3, ease: customease },
    },
  };

  const handleClose = () => setOpenMobileNav(false);

  return (
    <>
      {/* === Navbar Bar === */}
      <nav className="flex justify-between items-center pt-5 text-sm font-sans relative z-[1000]">
        {/* --- Logo --- */}
        <Link href="#">
          <Image
            src="/drillrecord.png"
            alt="drillrecords logo"
            width={100}
            height={50}
            className="mr-4"
          />
        </Link>

        {/* --- Desktop Menu --- */}
        <ul className="hidden md:flex gap-x-12 text-white">
          {["Home", "Search", "About us"].map((item) => (
            <li key={item}>
              <Link
                href="#"
                className="relative inline-block no-underline after-line"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* --- Desktop Buttons --- */}
        <div className="hidden md:flex">
          <Button size="lg" variant="ghost" asChild>
            <Link href="#">Login</Link>
          </Button>
          <Button size="lg" variant="default" asChild>
            <Link href="#">Explore</Link>
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
            {["Home", "Search", "About us", "Login", "Explore"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  variants={liVariant}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 * index,
                    ease: customease,
                  }}
                  onClick={handleClose}
                  className="text-4xl sm:text-5xl font-semibold"
                >
                  <Link href="#" className="hover:text-gray-300 duration-200">
                    {item}
                  </Link>
                  <motion.hr
                    variants={hrVariant}
                    className="bg-gray-600 h-[1px] w-full mt-2"
                  />
                </motion.div>
              )
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
