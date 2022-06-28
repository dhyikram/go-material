import { Table } from "@mantine/core";
import React from "react";

interface Item {
  id: string;
  name: string;
  stock: number;
}
interface pageProps {
  data: Item[];
}
function ItemTable({ data }: pageProps) {
  const rows = data.map((element) => (
    <tr key={element.id}>
      <td>{element.name}</td>
      <td>{element.stock}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default ItemTable;
