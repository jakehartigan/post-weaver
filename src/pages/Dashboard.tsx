import React from "react";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Main from "../layouts/Main";

import { NavbarSimple } from "../layouts/navbarMinimal/NavbarSimple";

const Dashboard: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarSimple />
      </AppShell.Navbar>

      <AppShell.Main>
        <Main />
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
