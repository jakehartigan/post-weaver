import { useEffect, useState } from "react";
import { Table, Checkbox, Loader, Text } from "@mantine/core";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { useAuth } from "../../../contexts/AuthContext";
import { IconExternalLink } from "@tabler/icons-react"; // Assuming you are using Tabler Icons

interface Post {
  createdAt: string;
  favorites: number;
  posts: { text: string; url: string }[];
}

export default function MTable() {
  const { currentUser } = useAuth();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        const db = getFirestore(app);
        const postsCollection = collection(
          db,
          `users/${currentUser.uid}/importedPosts`
        );
        const postSnapshot = await getDocs(postsCollection);
        const postList = postSnapshot.docs.map((doc) => doc.data() as Post);
        setPosts(postList);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser]);

  if (loading) {
    return <Loader />;
  }

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
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, index]
                : selectedRows.filter((i) => i !== index)
            )
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
        {post.posts.map((p, i) => (
          <Text key={i} size="sm">
            {p.text}
          </Text>
        ))}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table stickyHeader stickyHeaderOffset={60} horizontalSpacing="md">
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>Created At</Table.Th>
          <Table.Th>Link</Table.Th>
          <Table.Th>Posts</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
