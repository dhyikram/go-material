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
    description: string;
    itemReceived: {
      id: string;
      qty: number;
    }[];
  }

  function NewReceive() {
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

        const variables = {
            description: item.description,
            itemReceived: item.itemReceived,
            createdBy : uid
        };
        let receivedString = "["
  
        item.itemReceived!.map(item => {
          receivedString += `{id: "${item.id}", qty: ${item.qty}}`
        })
        receivedString += "]"
  
        const query = gql`mutation createReceive {
            createReceive(input: {description : "${item.description}", createdBy: "${uid}", itemReceived: ${receivedString}}){
              id
            }
          }`;
        return await client.request(query, variables);
      },
      {
        onSuccess: (data) => {
          navigate("/receive");
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
        description: "",
        itemReceived: formList([{id: "", qty:0}]),
      },
    });
  
    const fieldsitemReceived = form.values.itemReceived.map((item, index) => (
      <Center>
        <Group key={index} mt="xs">
          <Select
            data={itemList}
            {...form.getListInputProps("itemReceived", index, "id")}
          />
          <NumberInput {...form.getListInputProps("itemReceived", index, "qty")} />
          <Button
            color="red"
            onClick={() => {
              form.removeListItem("itemReceived", index);
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
              description: form.values.description,
              itemReceived: form.values.itemReceived,
            });
          }}
        >
          <Textarea
            label="Description"
            size="md"
            {...form.getInputProps("description")}
          />

          {fieldsitemReceived.length > 0 && (
              <>
              Requires Item
              {fieldsitemReceived}
              </>
          )}
          <Button
            mt="sm"
            onClick={() => {
              form.addListItem("itemReceived", { id: "", qty: 0 });
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
  
  export default NewReceive;
  