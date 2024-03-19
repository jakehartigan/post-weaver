import { Box, Center, Text, Title } from "@mantine/core";
import React from "react";
import { DropzoneButton } from "../components/ui/dropzone/DropzoneButton";

function Main() {
  return (
    <Box>
      <Title order={2}>Main</Title>
      <Box>
        <DropzoneButton />
      </Box>
    </Box>
  );
}

export default Main;
