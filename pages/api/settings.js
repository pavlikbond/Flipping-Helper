//not really using this right now. I created a context for this instead

import { connectMongo } from "src/utils/connectMongo";
import { User } from "models/schemas";

export default async (req, res) => {
  //if method is GET, return user based on clerkId
  connectMongo();
  if (req.method === "PUT") {
    const { userId, settings } = req.body;
    await User.findOneAndUpdate({ _id: userId }, { settings: settings }).then((user) => {
      res.status(200).json(user);
    });
  }
};
