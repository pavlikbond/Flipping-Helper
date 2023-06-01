import React from "react";
import { Pricing, User } from "models/schemas.js";
import PricingPage from "@/src/components/pricing/page";
import { connectMongo } from "utils/connectMongo.js";
import { getAuth } from "@clerk/nextjs/server";
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
  let newPricing = {
    name: "main",
    tier1: {
      name: "Free",
      shortDescription: "Perfect to get started",
      price: "Free",
      action: "Sign up",
      features: ["Track 3 items", "Standard email notifications"],
      priceId: null,
      limit: 3,
    },
    tier2: {
      name: "Basic",
      shortDescription: "Great for casual players",
      price: "2",
      action: "Get started",
      features: ["Track 20 items", "Email customization"],
      priceId: "price_1NAzPlDefQqMLptoEhJvuiGp",
      limit: 20,
    },
    tier3: {
      name: "Pro",
      shortDescription: "Ideal for power traders",
      price: "5",
      action: "Get started",
      features: ["Track unlimited items", "Additional customizations", "Notification scheduler"],
      priceId: "price_1NAzaXDefQqMLptoV0bs1Ene",
      limit: 9999,
    },
  };

  // const newPrice = new Pricing(newPricing);
  // await newPrice.save();

  // Pricing.insertMany([newPricing.tier1, newPricing.tier2, newPricing.tier3])
  //   .then(function () {
  //     console.log("Data inserted"); // Success
  //   })
  //   .catch(function (error) {
  //     console.log(error); // Failure
  //   });

  let pricing = await Pricing.find({});
  return {
    props: { pricing: JSON.parse(JSON.stringify(pricing)), plan: plan },
  };
}

export default PricesPage;
