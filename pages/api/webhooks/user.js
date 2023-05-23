import { Webhook } from "svix";
import { buffer } from "micro";
import { User } from "models/schemas.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const secret = process.env.WEBHOOK_SECRET;

export default async (req, res) => {
  console.log("webhook triggered");
  const payload = (await buffer(req)).toString();
  const headers = req.headers;

  const wh = new Webhook(secret);
  let msg;
  try {
    msg = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({});
  }

  // Do something with the message...

  console.log(msg);
  console.log(msg.data?.email_addresses);
  const eventType = msg.type;
  if (eventType === "user.created") {
    const userData = msg.data;
    console.log(userData);
    createUser(userData);
  }
  if (eventType === "user.updated") {
    const mongoUser = await User.findOne({ clerkId: msg.data.id });
    let email = msg.data.email_addresses.find((email) => email.id === msg.data?.primary_email_address_id).email_address;
    if (email && mongoUser.email !== email) {
      mongoUser.email = email;
      mongoUser.save();
      console.log("email updated");
    }
  }
  res.json({});
};

//function that takes Clerk user data and creates a user in the MongoDB database using the user model and mongoose
function createUser(userData) {
  const newUser = new User({
    clerkId: userData.id,
    email: userData.email_addresses[0].email_address,
    trackedItems: [],
  });
  newUser
    .save()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
