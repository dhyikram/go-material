import { Button, LoadingOverlay } from "@mantine/core";
import { gql, GraphQLClient } from "graphql-request";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import ItemTable from "./itemTable.component";

function ItemPages() {
  const navigate = useNavigate();
  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const { isLoading, data, refetch } = useQuery(
    ["itemsList"],
    async () => {
      const query = gql`
        query items {
          items {
            id
            name
            stock
          }
        }
      `;
      return await client.request(query).then((data) => data.items);
    },
    {
      initialData: [],
    }
  );

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <>
      <Button
        mb="sm"
        style={{ float: "right" }}
        mr="md"
        onClick={(e:any) => {
          e.preventDefault();
          navigate("/items/new");
        }}
      >
        New Item
      </Button>
      <ItemTable data={data} />
    </>
  );
}

export default ItemPages;
