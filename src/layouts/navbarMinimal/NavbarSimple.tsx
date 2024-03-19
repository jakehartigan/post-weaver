import { useState } from "react";
import { Group, Code } from "@mantine/core";
import { getAuth, signOut } from "firebase/auth";

import {
  IconLifebuoy,
  IconHome,
  IconCoins,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconCreditCard,
  IconSwitchHorizontal,
  IconLogout,
} from "@tabler/icons-react";

import classes from "./NavbarSimple.module.css";

const data = [
  { link: "", label: "Home", icon: IconHome },
  { link: "", label: "Help", icon: IconLifebuoy },
  { link: "", label: "Billing", icon: IconCreditCard },
  { link: "", label: "Get Tokens", icon: IconCoins },

  { link: "", label: "Settings", icon: IconSettings },
];

export function NavbarSimple() {
  const [active, setActive] = useState("Billing");
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
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
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
