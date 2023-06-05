import Stripe from "stripe";
//grab the email from clerk session
import { buffer } from "micro";
import { User, Pricing } from "models/schemas";
import { connectMongo } from "src/utils/connectMongo";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  await connectMongo();
  console.log("webhook activated");
  const sig = request.headers["stripe-signature"];
  const buf = await buffer(request);
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.log(err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log("event", event);
  // Handle the event
  switch (event.type) {
    case "customer.created":
      const customerCreated = event.data.object;
      // Then define and call a function to handle the event customer.created
      await User.findOneAndUpdate({ email: customerCreated.email }, { stripeId: customerCreated.id }).then((user) => {
        console.log("user", user);
      });
      response.status(200).json({ received: true });
      break;
    case "customer.deleted":
      const customerDeleted = event.data.object;
      // Then define and call a function to handle the event customer.deleted
      break;
    case "customer.updated":
      // Then define and call a function to handle the event customer.updated

      break;
    case "customer.subscription.created":
      try {
        const customerSubscriptionCreated = event.data.object;
        console.log("customerSubscriptionCreated", customerSubscriptionCreated);
        let priceId = customerSubscriptionCreated.items.data[0].price.id;
        let pricings = await Pricing.find({});
        let plan = pricings.find((pricing) => pricing.priceId === priceId)?.name || "Free";
        await User.findOneAndUpdate({ stripeId: customerSubscriptionCreated.customer }, { plan: plan }).then((user) => {
          console.log("user", user);
        });
      } catch (error) {
        console.log(error);
      }
      response.status(200).json({ received: true });
      break;
    case "customer.subscription.deleted":
      try {
        const customerSubscriptionDeleted = event.data.object;
        console.log("customerSubscriptionDeleted", customerSubscriptionDeleted);
        //let priceId = customerSubscriptionDeleted.items.data[0].price.id;
        // let pricing = await Pricing.findOne({ name: "main" });
        // let plan = pricing.tier2.priceId === priceId ? "Basic" : pricing.tier3.priceId === priceId ? "Pro" : "Free";
        await User.findOneAndUpdate({ stripeId: customerSubscriptionDeleted.customer }, { plan: "Free" }).then(
          (user) => {
            console.log("user", user);
          }
        );
      } catch (error) {
        console.log(error);
      }
      response.status(200).json({ received: true });

      // Then define and call a function to handle the event customer.subscription.deleted
      break;
    case "customer.subscription.paused":
      const customerSubscriptionPaused = event.data.object;
      // Then define and call a function to handle the event customer.subscription.paused
      break;
    case "customer.subscription.resumed":
      const customerSubscriptionResumed = event.data.object;
      // Then define and call a function to handle the event customer.subscription.resumed
      break;
    case "customer.subscription.updated":
      try {
        const customerSubscriptionUpdated = event.data.object;
        console.log("customerSubscriptionUpdated", customerSubscriptionUpdated);
        let priceId = customerSubscriptionUpdated.items.data[0].price.id;
        let pricings = await Pricing.find({});
        let plan = pricings.find((pricing) => pricing.priceId === priceId)?.name || "Free";
        await User.findOneAndUpdate({ stripeId: customerSubscriptionUpdated.customer }, { plan: plan }).then((user) => {
          console.log("user", user);
        });
      } catch (error) {
        console.log(error);
      }
      response.status(200).json({ received: true });
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}
