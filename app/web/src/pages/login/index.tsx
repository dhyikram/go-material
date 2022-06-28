import React, { useState } from "react";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { gql, GraphQLClient } from "graphql-request";
import { useMutation } from "react-query";
import { AlertCircle } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

interface LoginCreds {
  email: string;
  password: string;
}
export function LoginPage() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [alert, setAlert] = useState(false);
  const client = new GraphQLClient("/gql/query");
  const { mutate: loginMutation } = useMutation(
    async (auth: LoginCreds) => {
      const variables = {
        email: auth.email,
        password: auth.password,
      };

      const query = gql`mutation createUser {
          auth {
            login(input: {email : "${auth.email}" password : "${auth.password}"})
          }
        }`;
      return await client.request(query, variables);
    },
    {
      onSuccess: (e) => {
        localStorage.setItem("jwt", e.auth.login.token);
        navigate("/");
      },
      onError: (e) => {
        setAlert(true);
      },
    }
  );

  const { classes } = useStyles();
  let navigate = useNavigate();
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Material Inventory System (MIS)
        </Title>
        {alert && (
          <Alert
            mb="sm"
            icon={<AlertCircle size={16} />}
            title="Invalid Login!"
            color="red"
          >
            Invalid Credential, please check email and password are match
          </Alert>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation({
              email: form.values.email,
              password: form.values.password,
            });
          }}
        >
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Login
          </Button>
        </form>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => navigate("/register")}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
