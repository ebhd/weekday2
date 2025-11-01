"use client";

import React, { FC, useRef, useState, useEffect } from "react";

interface HamburgerMenuProps {
  children: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface HamburgerMenuBrandProps {
  children: React.ReactNode;
  href: string;
}

interface HamburgerMenuTogglerProps {
  toggle: () => void;
  isOpen: boolean;
}

interface HamburgerMenuCollapseProps {
  children: React.ReactNode;
  open: boolean;
}

interface HamburgerMenuNavProps {
  children: React.ReactNode;
}

interface HamburgerMenuItemProps {
  children: React.ReactNode;
}

interface HamburgerMenuLinkProps {
  children: React.ReactNode;
  href: string;
}

const style = {
  nav: `block pl-0 mb-0`,
  navbar: `font-light py-2 px-4`,
  collapse: `transition-all ease duration-700 overflow-hidden fixed inset-0 transform  w-[100%] max-w-sm z-50 inset-y-1/2 top-[20%]	`,
  toggler: `text-3xl focus:outline-none focus:shadow transform transition-transform duration-700 z-50`,
  link: `block cursor-pointer py-3 px-6 hover:text-gray-400 font-medium text-4xl text-center pb-6`,
  brand: `inline-block pt-1.5 pb-1.5 mr-4 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400 z-30`,
  overlay: `fixed inset-0 bg-black transition-opacity duration-700 z-40 backdrop-blur-3xl	`,
};

const HamburgerMenu: FC<HamburgerMenuProps> = ({
  children,
  bgColor,
  textColor,
}) => {
  return (
    <nav className={`${bgColor} ${textColor} ${style.navbar} relative`}>
      {children}
    </nav>
  );
};

const HamburgerMenuBrand: FC<HamburgerMenuBrandProps> = ({
  children,
  href,
}) => {
  return (
    <a href={href} className={style.brand}>
      <strong>{children}</strong>
    </a>
  );
};

const HamburgerMenuToggler: FC<HamburgerMenuTogglerProps> = ({
  toggle,
  isOpen,
}) => {
  return (
    <button
      type="button"
      aria-expanded={isOpen ? "true" : "false"}
      aria-label="Toggle navigation"
      className={`${style.toggler} ${isOpen ? "rotate-90" : "rotate-0"}`} // Rotate based on isOpen state
      onClick={toggle}
    >
      &#8801;
    </button>
  );
};

const HamburgerMenuCollapse: FC<HamburgerMenuCollapseProps> = ({
  children,
  open,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const inlineStyle = open
    ? {
        height: ref.current?.scrollHeight,
        visibility: "visible" as "visible",
        opacity: 1,
      }
    : {
        height: 0,
        visibility: "hidden" as "hidden",
        opacity: 0,
      };

  return (
    <div className={style.collapse} style={inlineStyle} ref={ref}>
      {children}
    </div>
  );
};

const HamburgerMenuNav: FC<HamburgerMenuNavProps> = ({ children }) => {
  return <ul className={style.nav}>{children}</ul>;
};

const HamburgerMenuItem: FC<HamburgerMenuItemProps> = ({ children }) => {
  return <li>{children}</li>;
};

const HamburgerMenuLink: FC<HamburgerMenuLinkProps> = ({ children, href }) => {
  return (
    <a href={href} className={style.link}>
      {children}
    </a>
  );
};

// Page Component
export const HamburgerMenuPage: FC = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prevState) => !prevState);
  };

  // Disable body scroll when the menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflowY = "hidden"; // Disable vertical scrolling
    } else {
      document.body.style.overflowY = "auto"; // Re-enable vertical scrolling
    }

    return () => {
      document.body.style.overflowY = "auto"; // Cleanup on unmount
    };
  }, [open]);

  return (
    <>
      <div
        className={`${style.overlay} ${
          open ? "opacity-90 visible" : "opacity-0 invisible"
        }`}
      ></div>

      <HamburgerMenu bgColor="bg-transparent" textColor="text-white">
        <div className="flex justify-between items-center z-30">
          <HamburgerMenuBrand href="#">
            <svg
              height="25"
              preserveAspectRatio="xMidYMid"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 153.6"
            >
              <linearGradient id="a" x1="-2.778%" y1="32%" y2="67.556%">
                <stop offset="0" stopColor="#2298bd" />
                <stop offset="1" stopColor="#0ed7b5" />
              </linearGradient>
            </svg>
          </HamburgerMenuBrand>
          <HamburgerMenuToggler toggle={toggle} isOpen={open} />
        </div>
        <HamburgerMenuCollapse open={open}>
          <HamburgerMenuNav>
            <HamburgerMenuItem>
              <HamburgerMenuLink href="#">Home</HamburgerMenuLink>
            </HamburgerMenuItem>
            <HamburgerMenuItem>
              <HamburgerMenuLink href="#">Teams</HamburgerMenuLink>
            </HamburgerMenuItem>
            <HamburgerMenuItem>
              <HamburgerMenuLink href="#">Fixtures</HamburgerMenuLink>
            </HamburgerMenuItem>
            <HamburgerMenuItem>
              <HamburgerMenuLink href="#">Players</HamburgerMenuLink>
            </HamburgerMenuItem>
          </HamburgerMenuNav>
        </HamburgerMenuCollapse>
      </HamburgerMenu>
    </>
  );
};
