import React from "react";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {  useNavigate } from "react-router-dom";
import { gql, GraphQLClient } from "graphql-request";
import { useMutation } from "react-query";

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


interface registerCreds{
    email: string;
    password: string;
    name: string;
}

export function RegisterPage() {

    const client = new GraphQLClient("/gql/query");
    const { mutate: registerMutation} = useMutation(
      async (auth: registerCreds) => {
        const variables = {
          email: auth.email,
          name: auth.name,
          password: auth.password,
        };
  
        const query = gql`mutation createUser {
            auth {
              register(input: {email : "${auth.email}" name:"${auth.name}" password : "${auth.password}"})
            }
          }`;
        return await client.request(query, variables);
      },
      {
        onSuccess: () => {
          navigate("/login");
        },
      }
    );

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
  });
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
         Register Page
        </Title>
        <form onSubmit={(e) => {
            e.preventDefault()
            registerMutation({
                email: form.values.email,
                name: form.values.name,
                password: form.values.password,
            });
        }}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Name"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("name")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Register
          </Button>
        </form>

        <Text align="center" mt="md">
          Already Have an account ?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => navigate('/login')}
          >
            Login
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
