import { Container, Title, Text, Button, Group } from "@mantine/core";
import classes from "./NothingFoundBackground.module.css";
import { Illustration } from "./Illustration";
import { Link } from "react-router-dom";

export function NothingFoundBackground() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text size="lg" ta="center" className={classes.description}>
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Group justify="center">
            <Button>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/dashboard"
              >
                Back to Dashboard
              </Link>
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
