import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { parse } from "graphql";
import { gql, GraphQLClient } from "graphql-request";
import jwtDecode from "jwt-decode";
import React, { useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

interface Received {
  title: string
  description: string;
  requestItem: {
    id: string;
    qty: number;
  }[];
}

function NewIssues() {
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const navigate = useNavigate();
  const { mutate: NewItemMutation } = useMutation(
    async (item: Received) => {
      // @ts-ignore
      const uid = jwtDecode(localStorage.getItem("jwt")).ID;


      let requestItem = "["

      item.requestItem!.map(item => {
        requestItem += `{id: "${item.id}", qty: ${item.qty}}`
      })
      requestItem += "]"

      const query = gql`mutation createIssues{
        createIssue(input: {title: "${item.title}", description: "${item.description}", createdBy : "${uid}", status: "Pending", requestedItem: ${requestItem}}){
          id
        }
      }`;
      return await client.request(query);
    },
    {
      onSuccess: (data) => {
        navigate("/issues");
      },
    }
  );

  const {
    isLoading,
    data: itemList,
    refetch,
  } = useQuery(
    ["itemsList"],
    async () => {
      const query = gql`
        query items {
          items {
            id
            name
          }
        }
      `;
      let items = await client.request(query).then((data) => data.items);

      for (let item of items) {
        item.label = item.name;
        item.value = item.id;
      }
      return items;
    },
    {
      initialData: [],
    }
  );

  const form = useForm({
    initialValues: {
      title : "",
      description: "",
      requestItem: formList([{id: "", qty:0}]),
    },
  });

  const fieldsrequestItem = form.values.requestItem.map((item, index) => (
    <Center>
      <Group key={index} mt="xs">
        <Select
          data={itemList}
          {...form.getListInputProps("requestItem", index, "id")}
        />
        <NumberInput {...form.getListInputProps("requestItem", index, "qty")} />
        <Button
          color="red"
          onClick={() => {
            form.removeListItem("requestItem", index);
          }}
        >
          Delete
        </Button>
      </Group>
    </Center>
  ));

  if (isLoading) return <LoadingOverlay visible />;
  return (
    <Paper mx="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          NewItemMutation({
            title: form.values.title,
            description: form.values.description,
            requestItem: form.values.requestItem,
          });
        }}
      >

        <TextInput
          label="Title"
          size="md"
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Description"
          size="md"
          {...form.getInputProps("description")}
        />

        {fieldsrequestItem.length > 0 && (
            <>
            Request Item
            {fieldsrequestItem}
            </>
        )}
        <Button
          mt="sm"
          onClick={() => {
            form.addListItem("requestItem", { id: "", qty: 0 });
          }}
        >
          Add Request Item
        </Button>
        <Button fullWidth mt="xl" size="md" type="submit" >
          Add Item
        </Button>
      </form>
      
    </Paper>
  );
}

export default NewIssues;
