import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  TextInput,
} from "@mantine/core";
import { formList, useForm } from "@mantine/form";
import { parse } from "graphql";
import { gql, GraphQLClient } from "graphql-request";
import React, { useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

interface NewItem {
  name: string;
  stock: number;
  category: string;
  requires?: {
    id: string;
    qty: number;
  }[];
}
function NewItem() {
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });
  const navigate = useNavigate();
  const { mutate: NewItemMutation } = useMutation(
    async (item: NewItem) => {
      const variables = {
        name: item.name,
        stock: item.stock,
        category: item.category,
        requires: item.requires,
      };

      let requiresString = "["

      item.requires!.map(item => {
        requiresString += `{id: "${item.id}", qty: ${item.qty}}`
      })
      requiresString += "]"

      const query = gql`mutation createItem {
          createItem(input: {name : "${item.name}", stock: ${item.stock}, category : "${item.category}", requires: ${requiresString}}){
            id
          }
        }`;
      return await client.request(query, variables);
    },
    {
      onSuccess: (data) => {
        navigate("/items");
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
      name: "",
      stock: 0,
      category: "",
      requires: formList([{id:"", qty: 0}]),
    },
  });

  const fieldsRequires = form.values.requires.map((item, index) => (
    <Center>
      <Group key={index} mt="xs">
        <Select
          data={itemList}
          {...form.getListInputProps("requires", index, "id")}
        />
        <NumberInput {...form.getListInputProps("requires", index, "qty")} />
        <Button
          color="red"
          onClick={() => {
            form.removeListItem("requires", index);
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
            name: form.values.name,
            stock: 0,
            category: form.values.category,
            requires: form.values.requires,
          });
        }}
      >
        <TextInput
          label="Item Name"
          placeholder="hello@gmail.com"
          size="md"
          {...form.getInputProps("name")}
        />
        <Select
          label="Category"
          placeholder="Pick one"
          data={[
            { value: "Raw", label: "Raw" },
            { value: "Semi-Finished", label: "Semi-Finished" },
            { value: "Finished", label: "Finished" },
          ]}
          {...form.getInputProps("category")}
        />
        {fieldsRequires.length > 0 && (
            <>
            Requires Item
            {fieldsRequires}
            </>
        )}
        <Button
          mt="sm"
          onClick={() => {
            form.addListItem("requires", { id: "", qty: 0 });
          }}
        >
          Add Requires Item
        </Button>
        <Button fullWidth mt="xl" size="md" type="submit" >
          Add Item
        </Button>
      </form>
      
    </Paper>
  );
}

export default NewItem;
