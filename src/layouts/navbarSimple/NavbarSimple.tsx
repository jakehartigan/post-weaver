import { useState } from "react";
import { Group, Code } from "@mantine/core";
import { getAuth, signOut } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import {
  IconTable,
  IconHome,
  IconCoins,
  IconSettings,
  IconCreditCard,
  IconLogout,
  IconGift,
} from "@tabler/icons-react";

import classes from "./NavbarSimple.module.css";

const data = [
  { link: "/", label: "Home", icon: IconHome },
  { link: "/posts", label: "Posts", icon: IconTable },
  { link: "/get-tokens", label: "Buy Tokens", icon: IconCoins },
  { link: "/referrals", label: "Refer a Friend", icon: IconGift },
  { link: "/billing", label: "Billing", icon: IconCreditCard },
  { link: "/settings", label: "Settings", icon: IconSettings },
];

export function NavbarSimple() {
  const location = useLocation();

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // Perform additional actions after logout if needed, such as redirecting to the login page
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout errors here
    }
  };

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={
        (item.label === "Home" &&
          (location.pathname === `/dashboard` ||
            location.pathname === `/dashboard/`)) ||
        (item.label !== "Home" &&
          location.pathname.includes(`/dashboard${item.link}`))
          ? "true"
          : undefined
      }
      to={`/dashboard${item.link === "/" ? "" : item.link}`} // Adjust `to` prop to handle the Home link correctly
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Code fw={700}>Beta</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
