import React from "react";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavbarSimple } from "../layouts/navbarSimple/NavbarSimple";
import { Outlet, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Support from "./Support";
import Billing from "./Billing";
import Tokens from "./Tokens";
import Settings from "./Settings";
import Referrals from "./Referrals";

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
        <Routes>
          <Route index element={<Home />} />
          <Route path="get-tokens" element={<Tokens />} />
          <Route path="referrals" element={<Referrals />} />

          <Route path="support" element={<Support />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
