import React, { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import {
  TextInput,
  Button,
  Box,
  Group,
  Paper,
  Title,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../contexts/AuthContext";

const Signup: React.FC = () => {
  const [error, setError] = useState<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (values: typeof form.values) => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          const user = userCredential.user;
          setDoc(doc(db, "users", user.uid), {
            email: values.email,
          });
          navigate("/dashboard");
        })
        .catch((error) => {
          setError(error.message);
        });
    } catch (error: any) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <Flex pt={100} justify="center" align="center">
      <Box maw={340} mx="auto">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={2}>Sign Up</Title>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              withAsterisk
              label="Password"
              placeholder="Your password"
              type="password"
              {...form.getInputProps("password")}
            />
            <Group mt="md">
              <Button type="submit">Sign Up</Button>
            </Group>
          </form>
          <Flex p={10} justify="flex-start" align="baseline" direction="row">
            <p>Already have an account?</p>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                padding: 10,
              }}
            >
              Login
            </Link>
          </Flex>
        </Paper>
      </Box>
    </Flex>
  );
};

export default Signup;
