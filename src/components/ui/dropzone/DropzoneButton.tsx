import { useRef } from "react";
import { Text, Group, Button, rem, useMantineTheme } from "@mantine/core";
import { IconCloudUpload } from "@tabler/icons-react";
import classes from "./DropzoneButton.module.css";
import importAndProcessPosts from "../../../modules/postimporting/importAndProcessPosts";

//firebase
import { useAuth } from "../../../contexts/AuthContext";

export function DropzoneButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const theme = useMantineTheme();

  const { currentUser } = useAuth();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && currentUser) {
      const file = files[0];
      console.log("Selected file:", file);

      // Read the file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          const jsonData = JSON.parse(
            text.replace("window.YTD.tweets.part0 = ", "")
          );
          await importAndProcessPosts(currentUser.uid, jsonData);
        }
      };
      reader.readAsText(file);
    } else {
      console.log("No file selected or user not authenticated");
    }
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
    fileInputRef.current?.click();
  };
  return (
    <div className={classes.wrapper}>
      <input
        type="file"
        accept=".js,.json"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Group justify="center" style={{ pointerEvents: "none" }}>
        <IconCloudUpload
          style={{ width: rem(50), height: rem(50) }}
          stroke={1.5}
        />
      </Group>
      <Text ta="center" fw={700} fz="lg" mt="xl">
        Upload Twitter Archive
      </Text>
      <Text ta="center" fz="sm" mt="xs" c="dimmed" mb="lg">
        Click the button below to select your tweet.js or JSON file.
      </Text>
      <Button
        className={classes.control}
        size="md"
        radius="md"
        onClick={handleButtonClick}
      >
        Select file
      </Button>
    </div>
  );
}
