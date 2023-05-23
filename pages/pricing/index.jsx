import React from "react";
import { Pricing } from "models/schemas.js";
import PricingPage from "@/src/components/pricing/page";
import { connectMongo } from "utils/connectMongo.js";
const PricesPage = ({ pricing }) => {
  return (
    <div>
      <PricingPage pricing={pricing} />
    </div>
  );
};

export async function getServerSideProps() {
  await connectMongo();
  // let newPricing = {
  //   name: "main",
  //   tier1: {
  //     name: "Free",
  //     shortDescription: "Perfect to get started",
  //     price: "Free",
  //     action: "Sign up",
  //     features: ["Track 3 items", "Standard email notifications"],
  //   },
  //   tier2: {
  //     name: "Basic",
  //     shortDescription: "Great for casual players",
  //     price: "2",
  //     action: "Get started",
  //     features: ["Track 20 items", "Email customization"],
  //   },
  //   tier3: {
  //     name: "Pro",
  //     shortDescription: "Ideal for power traders",
  //     price: "5",
  //     action: "Get started",
  //     features: ["Track unlimited items", "Additional customizations", "Notification timers"],
  //   },
  // };

  // const newPrice = new Pricing(newPricing);
  // await newPrice.save();

  let pricing = await Pricing.findOne({ name: "main" });
  return {
    props: { pricing: JSON.parse(JSON.stringify(pricing)) },
  };
}

export default PricesPage;
