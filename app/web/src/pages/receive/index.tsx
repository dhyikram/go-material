import { Button, LoadingOverlay } from "@mantine/core";
import { gql, GraphQLClient } from "graphql-request";
import React from "react";
import { useQuery } from "react-query";
import { Navigate, useNavigate } from "react-router-dom";
import ItemTable from "./receiveTable.component";

function ReceivePages() {
  const navigate = useNavigate()
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const { isLoading, data, refetch } = useQuery(
    ["itemsList"],
    async () => {
      const query = gql`
        query receive {
          Receives {
            ID
            CreatedBy
            Description
            ItemReceived {
              id
              name
              qty
            }
          }
        }
      `;
      return await client.request(query).then((data) => data.Receives);
    },
    {
      initialData: [],
    }
  );

  if (isLoading || !data || data.length < 1) return <LoadingOverlay visible />

  return (
    <>
    <Button style={{float:'right'}} mr ='sm' onClick={(e:any) => {
      e.preventDefault()
      navigate('/receive/new')
    }}>
      New Receive
    </Button>
      <ItemTable data={data} />
    </>
  );
}

export default ReceivePages;
