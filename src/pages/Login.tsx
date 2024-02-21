import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Paper,
  Title,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const Login: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 0 ? null : "Password is required"),
    },
  });

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [currentUser, navigate]);

  const handleLogin = async (values: typeof form.values) => {
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          navigate("/dashboard"); // Redirect to dashboard after successful login
        })
        .catch((error) => {
          setError(error.message); // Set the error message to display to the user
        });
    } catch (error: any) {
      setError("An unexpected error occurred.");
    }
  };
  return (
    <Flex pt={100} justify="center" align="center">
      <Box maw={340} mx="auto">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={2}>Login</Title>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={form.onSubmit(handleLogin)}>
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
              <Button type="submit">Log in</Button>
            </Group>
          </form>

          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                padding: 10,
              }}
            >
              Signup
            </Link>
          </p>
        </Paper>
      </Box>
    </Flex>
  );
};

export default Login;
