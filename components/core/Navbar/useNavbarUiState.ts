// components/core/Navbar/useNavbarUiState.ts
"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const customEase: [number, number, number, number] = [
  0.05, 0.58, 0.57, 0.96,
];
export function useNavbarUiState() {
  const [openMobileNav, setOpenMobileNav] = useState(false);
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

  const handleClose = () => setOpenMobileNav(false);

  const hrVariant = {
    initial: {
      width: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: customEase },
    },
    animate: {
      width: "100%",
      opacity: 1,
      transition: { duration: 0.5, ease: customEase },
    },
    exit: {
      width: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: customEase },
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
      transition: { duration: 0.2, ease: customEase },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.2, delay: 0.3, ease: customEase },
    },
  };

  return {
    openMobileNav,
    setOpenMobileNav,
    handleClose,
    isMobile,
    hrVariant,
    liVariant,
    navVariant,
  };
}
