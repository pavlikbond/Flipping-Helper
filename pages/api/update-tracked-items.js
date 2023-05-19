//import { connectMongo } from "../../utils/connectMongo.js";
import { item, user } from "../../models/schemas.js";

export default async (req, res) => {
  //await connectMongo();
  const { method } = req;
  switch (method) {
    case "PUT":
      try {
        const { userData } = req.body;
        //get user object
        const userObject = await user.findById(userData._id);

        let trackedItems = userData.trackedItems;
        for (let newItem of trackedItems) {
          let oldItem = userObject.trackedItems.find((oldItem) => oldItem.osrs_id === newItem.osrs_id);
          if (oldItem) {
            newItem.lastNotified = oldItem.lastNotified;
          }
        }
        console.log(trackedItems);
        const updatedUser = await user
          .findByIdAndUpdate(userData._id, { trackedItems: userData.trackedItems })
          .then((data) => {
            return data;
          });

        res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
