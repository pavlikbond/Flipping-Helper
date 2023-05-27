//import { connectMongo } from "../../utils/connectMongo.js";
import { User } from "models/schemas.js";

export default async (req, res) => {
  //await connectMongo();
  const { method } = req;
  switch (method) {
    case "PUT":
      try {
        const { userData } = req.body;
        //get User object
        const userObject = await User.findById(userData._id);

        let trackedItems = userData.trackedItems;
        for (let newItem of trackedItems) {
          let oldItem = userObject.trackedItems.find((oldItem) => oldItem.osrs_id === newItem.osrs_id);
          if (oldItem) {
            newItem.lastNotified = oldItem.lastNotified;
          }
        }
        const updatedUser = await User.findByIdAndUpdate(userData._id, { trackedItems: userData.trackedItems })
          .then(function () {
            console.log("Data inserted"); // Success
          })
          .catch(function (error) {
            console.log(error); // Failure
          });

        res.status(200).json({ success: true });
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
