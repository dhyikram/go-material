import { Paper } from "@mantine/core";
import React from "react";
import { HeaderComponent } from "./header.component";




function Homepage({children}:any) {
  const mainLinks = [
    {
      link: "/items",
      label: "Items",
    },
    {
      link: "/issues",
      label: "Issues",
    },
    {
      link: "/receive",
      label: "Receive",
    },
    {
      link: "/logout",
      label: "Logout",
    },
  ]
  return (
    <>
      <HeaderComponent mainLinks={mainLinks}/>
      <Paper mx="md">
      {children}
      </Paper>
    </>
  );
}

export default Homepage;
