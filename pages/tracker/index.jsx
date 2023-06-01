import * as React from "react";
import { Tracker } from "src/components/tracker/tracker";
import { connectMongo } from "utils/connectMongo.js";
import { User, Pricing } from "models/schemas.js";
import Container from "@mui/material/Container";
import { getAuth } from "@clerk/nextjs/server";
export default function TrackerPage({ mongoUser, items, limit }) {
  return (
    <Container maxWidth="lg" className="my-6">
      <Tracker mongoUser={mongoUser} items={items} limit={limit} />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { userId } = getAuth(ctx.req);
  await connectMongo();

  let mongoUser = await User.findOne({ clerkId: userId });
  let items = await fetch("https://prices.runescape.wiki/api/v1/osrs/mapping").then((response) => response.json());
  let allPricings = await Pricing.find({});

  //only need name and osrs_id for autocomplete dropdown
  items = items.map((item) => {
    return {
      name: item.name,
      osrs_id: item.id,
    };
  });
  //limit how many items are returned from Database. Important for when user downgrades plan
  let cutOff = 0;
  if (mongoUser.plan === "Free") {
    cutOff = allPricings.find((pricing) => pricing.name === "Free")?.limit || 3;
  } else if (mongoUser.plan === "Basic") {
    cutOff = allPricings.find((pricing) => pricing.name === "Basic")?.limit || 20;
  } else if (mongoUser.plan === "Pro") {
    cutOff = 9999;
  }

  //sort data.trackedItems by name. Will get rid of later if sorted when saved to database
  mongoUser.trackedItems?.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  mongoUser.trackedItems = mongoUser.trackedItems?.slice(0, cutOff);

  if (!mongoUser) {
    mongoUser = "No data found";
  }
  return {
    props: { mongoUser: JSON.parse(JSON.stringify(mongoUser)), items: items, limit: cutOff },
  };
}
