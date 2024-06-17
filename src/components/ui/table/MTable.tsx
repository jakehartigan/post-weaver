import { useState, useEffect } from "react";
import {
  Table,
  Checkbox,
  Loader,
  Text,
  Button,
  Container,
} from "@mantine/core";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { useAuth } from "../../../contexts/AuthContext";
import {
  IconExternalLink,
  IconArrowsMaximize,
  IconRefresh,
} from "@tabler/icons-react";
import ContentModal from "./ContentModal";

interface Post {
  createdAt: string;
  favorites: number;
  content: string;
  postNodeId: string;
  posts: { text: string; url: string }[];
}

interface MTableProps {
  onSelectedRowsChange: (selectedRows: Post[]) => void;
}

export default function MTable({ onSelectedRowsChange }: MTableProps) {
  const { currentUser } = useAuth();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalContent, setModalContent] = useState<string>("");

  const fetchPosts = async () => {
    if (currentUser) {
      setLoading(true);
      const db = getFirestore(app);
      const postsCollection = collection(
        db,
        `users/${currentUser.uid}/importedPosts`
      );
      const postSnapshot = await getDocs(postsCollection);
      const postList = postSnapshot.docs.map((doc) => {
        console.log("Retrieved doc:", doc.data());
        return { ...doc.data(), postNodeId: doc.id } as Post;
      });
      setPosts(postList);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentUser]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updatedSelectedRows = checked
      ? [...selectedRows, index]
      : selectedRows.filter((i) => i !== index);

    setSelectedRows(updatedSelectedRows);
    const selectedData = updatedSelectedRows.map((rowIndex) => posts[rowIndex]);
    onSelectedRowsChange(selectedData);
  };

  if (loading) {
    return <Loader />;
  }

  const handleContentClick = (content: string) => {
    setModalContent(content);
    setModalOpened(true);
  };

  const rows = posts.map((post, index) => (
    <Table.Tr
      key={index}
      bg={
        selectedRows.includes(index)
          ? "var(--mantine-color-blue-light)"
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label="Select row"
          checked={selectedRows.includes(index)}
          onChange={(event) =>
            handleCheckboxChange(index, event.currentTarget.checked)
          }
        />
      </Table.Td>
      <Table.Td>{new Date(post.createdAt).toLocaleString()}</Table.Td>
      <Table.Td>
        {post.posts.length > 0 && (
          <a
            href={post.posts[0].url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open original post"
          >
            <IconExternalLink />
          </a>
        )}
      </Table.Td>
      <Table.Td>
        <Button
          variant="subtle"
          onClick={() => handleContentClick(post.content)}
        >
          <IconArrowsMaximize size={16} />
        </Button>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{post.posts[0]?.text}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Container
        fluid
        h={50}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Button onClick={fetchPosts} rightSection={<IconRefresh size={14} />}>
          Refresh
        </Button>
      </Container>
      <Table stickyHeader stickyHeaderOffset={60} horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Created At</Table.Th>
            <Table.Th>Link</Table.Th>
            <Table.Th>Content</Table.Th>
            <Table.Th>Posts</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <ContentModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        content={modalContent}
      />
    </>
  );
}
