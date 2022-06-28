import { LoadingOverlay, Table } from "@mantine/core";
import React from "react";

interface itemReceived {
  name: string;
  qty: number;
}

interface Item {
  id: string;
  CreatedBy: string;
  Description: number;
  ItemReceived: itemReceived[];
}

interface pageProps {
  data: Item[];
}

function ItemTable({ data }: pageProps) {
    if(!data) return <LoadingOverlay visible />
  const rows = data.map((element) => (
    <tr key={element.id}>
      <td>{element.CreatedBy}</td>
      <td>{element.Description}</td>
      <td>
        <ul>
          {element.ItemReceived && element.ItemReceived.map((item) => (
            <li>{item.name} ({item.qty})</li>
          ))}
        </ul>
      </td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Created By</th>
          <th>Description</th>
          <th>List Item</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default ItemTable;
