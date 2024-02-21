import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, ScrollArea, Skeleton, Text, Title } from "@mantine/core";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Main from "../layouts/Main";
import NavHeader from "../layouts/NavHeader";

const Dashboard: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();
  // Initialize the Firebase auth instance
  const auth = getAuth();

  // Function to handle the logout process
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // You can redirect the user to the login page or perform other actions after logout
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle errors here, such as displaying a notification to the user
    }
  };

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
        <Title visibleFrom="sm" p={10}>
          Apace Step Dashboard
        </Title>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <NavHeader />
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <Button fullWidth onClick={alert}>
            Invite
          </Button>
          60 links in a scrollable section
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>
          <Button color="gray" variant="subtle" onClick={handleLogout}>
            Logout
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Main />
      </AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;
