// src/utils/listFiles.ts

import { getStorage, listAll, ref } from "firebase/storage";
import { app } from "../firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

const storage = getStorage(app);
const auth = getAuth(app);

const listFiles = async (userId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const listRef = ref(storage, `uploads/${userId}/`);
    const fileList = await listAll(listRef);
    return fileList.items.map((itemRef) => itemRef.fullPath);
  } catch (error) {
    console.error("Error listing files: ", error);
    throw error;
  }
};

export const useListFiles = () => {
  const { currentUser, loading } = useAuth();
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!loading && currentUser) {
        try {
          const userFiles = await listFiles(currentUser.uid);
          setFiles(userFiles);
        } catch (err) {
          setError("Failed to list files");
          console.error(err);
        }
      }
    };
    fetchFiles();
  }, [currentUser, loading]);

  return { files, error, loading };
};
