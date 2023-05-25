import Stripe from "stripe";
//grab the email from clerk session
import { User } from "models/schemas";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  //console.log("req", req.body);
  if (req.method === "POST") {
    const { priceId, successURL, cancelURL, userId } = req.body;

    //grab the primary email from Mongo if user logged in
    let email;
    if (userId) {
      let user = await User.findOne({ clerkId: userId });
      if (user) {
        email = user.email;
      }
    }

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successURL,
        cancel_url: cancelURL,
        customer_email: email,
      });
      console.log("session", session);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
