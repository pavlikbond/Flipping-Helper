//not really using this right now. I created a context for this instead

import { connectMongo } from "src/utils/connectMongo";
import { User } from "models/schemas";

export default async (req, res) => {
  //if method is GET, return user based on clerkId
  connectMongo();
  if (req.method === "GET") {
    //get query param
    const { clerkId } = req.query;
    //connect to mongo
    //find user by clerkId
    let user = await User.findOne({ clerkId: clerkId });
    //return user
    res.status(200).json(user);
  } else if (req.method === "PUT") {
    const { clerkId, tracking } = req.body;
    await User.findOneAndUpdate({ clerkId: clerkId }, { tracking: tracking }).then((user) => {
      res.status(200).json(user);
    });
  }
};
