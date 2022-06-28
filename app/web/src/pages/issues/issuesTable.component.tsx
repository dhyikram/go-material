import { Button, Group, LoadingOverlay, Table } from "@mantine/core";
import { gql, GraphQLClient } from "graphql-request";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

interface itemReceived {
  name: string;
  qty: number;
}

interface Item {
  id: string;
  title: string;
  description: number;
  status: string;
  createdBy: string;
  requestedItem: itemReceived[];
}

interface pageProps {
  data: Item[];
}

interface RequestedItem {
  id: string;
  qty: string;
}
interface ProcessIssue {
  id: string;
  status: string;
}

function IssuesTable({ data }: pageProps) {
  const navigate = useNavigate();
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const { mutate: ProcessIssueMutation } = useMutation(
    async (item: ProcessIssue) => {
      const variables = {
        id: item.id,
        status: item.status,
      };

      const query = gql`mutation processIssue {
        processIssue(input: {id: "${item.id}", status: "${item.status}"}){
        id
      }
    }`;
      return await client.request(query, variables);
    },
    {
      onSuccess: (data) => {
        navigate("/issues");
      },
    }
  );

  const rows = data.map((element) => (
    <tr key={element.id}>
      <td>{element.title}</td>
      <td>{element.description}</td>
      <td>{element.createdBy}</td>
      <td>
        <ul>
          {element.requestedItem &&
            element.requestedItem.length > 0 &&
            element.requestedItem.map((item, index) => (
              <li key={index}>
                {item.name} ({item.qty})
              </li>
            ))}
        </ul>
      </td>
      <td>
        {element.status === "Pending" ? (
          <Group>
            <Button
              onClick={(e:any) => {
                e.preventDefault();
                ProcessIssueMutation({ id: element.id, status: "Approve" });
              }}
            >
              Approve
            </Button>
            <Button
              color={"red"}
              onClick={(e:any) => {
                e.preventDefault();
                ProcessIssueMutation({ id: element.id, status: "Reject" });
              }}
            >
              Reject
            </Button>
          </Group>
        ) : (
          element.status
        )}
      </td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Created By</th>
          <th>List Item</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default IssuesTable;
