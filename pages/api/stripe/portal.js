import Stripe from "stripe";
//grab the email from clerk session
import { User } from "models/schemas";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  //get stripeId from User model using clerkId
  let user = await User.findOne({ clerkId: req.body.userId });
  if (user) {
    let customerId = user.stripeId;
    let portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: req.body.returnURL,
    });
    res.status(200).json(portalSession);
  }
}
