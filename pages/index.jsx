import * as React from "react";
import { HomePage } from "../src/components/home-page";
import { connectMongo } from "../utils/connectMongo.js";
import { user } from "../models/schemas.js";
import Container from "@mui/material/Container";

export default function Index({ data, items }) {
  return (
    <Container maxWidth="lg" className="my-6">
      <HomePage data={data} items={items} />;
    </Container>
  );
}

export async function getServerSideProps(context) {
  console.log(context.req);

  await connectMongo();
  let data = await user.findOne({ email: "pavlik.bond@gmail.com" });
  let items = await fetch("https://prices.runescape.wiki/api/v1/osrs/mapping").then((response) => response.json());
  items = items.map((item) => {
    return {
      name: item.name,
      osrs_id: item.id,
    };
  });

  //sort data.trackedItems by name
  data.trackedItems.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  if (!data) {
    data = "No data found";
  }
  return {
    props: { data: JSON.parse(JSON.stringify(data)), items: items },
  };
}
