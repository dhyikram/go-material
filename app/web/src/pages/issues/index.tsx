import { Button } from "@mantine/core";
import { gql, GraphQLClient } from "graphql-request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import IssuesTable from "./issuesTable.component";

function IssuesPage() {
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });
  const navigate = useNavigate()
  const { isLoading, data, refetch } = useQuery(
    ["itemsList"],
    async () => {
      const query = gql`
        query issues {
          issues {
            id
            title
            description
            createdBy
            status
            requestedItem {
              id
              qty
              name
            }
          }
        }
      `;
      return await client.request(query).then((data) => data.issues);
    },
    {
      initialData: [],
    }
  );
  return (
    <div>
      <Button
        style={{
          float: "right",
        }}
        onClick={(e:any) => {
          e.preventDefault()
          navigate('/issues/new')
        }}
      >
        New Issues
      </Button>
      <IssuesTable data={data} />{" "}
    </div>
  );
}

export default IssuesPage;
