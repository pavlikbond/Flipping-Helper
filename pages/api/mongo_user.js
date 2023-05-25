import { connectMongo } from "utils/connectMongo";
import { User } from "models/schemas";
export default async (req, res) => {
  //if method is GET, return user based on clerkId
  if (req.method === "GET") {
    //get query param
    const { clerkId } = req.query;
    //connect to mongo
    connectMongo();
    //find user by clerkId
    let user = await User.findOne({ clerkId: clerkId });
    //return user
    res.status(200).json(user);
  }
};
