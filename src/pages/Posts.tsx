import { useState } from "react";
import { Button, Container, Modal, Text } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import MTable from "../components/ui/table/MTable";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";

function Posts() {
  const { currentUser } = useAuth();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSelectedRowsChange = (selectedRows: any[]) => {
    console.log("Selected Rows:", selectedRows);
    setSelectedRows(selectedRows);
  };

  const handleDownload = async () => {
    if (currentUser) {
      const db = getFirestore(app);
      let combinedContent = "";

      for (const rowIndex of selectedRows) {
        const docRef = doc(
          db,
          `users/${currentUser.uid}/importedPosts`,
          rowIndex.postNodeId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          combinedContent += JSON.stringify(docSnap.data(), null, 2) + "\n";
        } else {
          console.log("No such document!");
        }
      }

      console.log("Combined Content:", combinedContent);
      setModalContent(combinedContent);
      setModalOpened(true);
    }
  };

  const handleConfirmDownload = () => {
    const blob = new Blob([modalContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "posts.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setModalOpened(false);
  };

  return (
    <div>
      <Container
        fluid
        h={50}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Button
          onClick={handleDownload}
          rightSection={<IconDownload size={14} />}
        >
          Download
        </Button>
      </Container>
      <MTable onSelectedRowsChange={handleSelectedRowsChange} />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="JSON Content Preview"
      >
        <pre>{modalContent}</pre>
        <Button onClick={handleConfirmDownload}>Confirm Download</Button>
      </Modal>
    </div>
  );
}

export default Posts;
