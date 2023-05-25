import React from "react";
import { Pricing, User } from "models/schemas.js";
import PricingPage from "@/src/components/pricing/page";
import { connectMongo } from "utils/connectMongo.js";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
const PricesPage = ({ pricing, plan }) => {
  return (
    <div>
      <PricingPage pricing={pricing} plan={plan} />
    </div>
  );
};

export async function getServerSideProps({ req }) {
  await connectMongo();
  const { userId } = getAuth(req);
  let plan = "";
  if (userId) {
    let mongoUser = await User.findOne({ clerkId: userId });
    plan = mongoUser.plan;
  }
  console.log("plan", plan);
  console.log("userId", userId);
  // let newPricing = {
  //   name: "main",
  //   tier1: {
  //     name: "Free",
  //     shortDescription: "Perfect to get started",
  //     price: "Free",
  //     action: "Sign up",
  //     features: ["Track 3 items", "Standard email notifications"],
  //     priceId: null,
  //   },
  //   tier2: {
  //     name: "Basic",
  //     shortDescription: "Great for casual players",
  //     price: "2",
  //     action: "Get started",
  //     features: ["Track 20 items", "Email customization"],
  //     priceId: "price_1NAzPlDefQqMLptoEhJvuiGp",
  //   },
  //   tier3: {
  //     name: "Pro",
  //     shortDescription: "Ideal for power traders",
  //     price: "5",
  //     action: "Get started",
  //     features: ["Track unlimited items", "Additional customizations", "Notification scheduler"],
  //     priceId: "price_1NAzaXDefQqMLptoV0bs1Ene",
  //   },
  // };

  // const newPrice = new Pricing(newPricing);
  // await newPrice.save();
  let pricing = await Pricing.findOne({ name: "main" });
  return {
    props: { pricing: JSON.parse(JSON.stringify(pricing)), plan: plan },
  };
}

export default PricesPage;
