import * as React from "react";
import { Tracker } from "src/components/tracker-page";
import { connectMongo } from "utils/connectMongo.js";
import { User } from "models/schemas.js";
import Container from "@mui/material/Container";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
export default function TrackerPage({ data, items }) {
  return (
    <Container maxWidth="lg" className="my-6">
      <Tracker data={data} items={items} />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { userId } = getAuth(ctx.req);
  await connectMongo();
  let data = await User.findOne({ clerkId: userId });
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
