import { connectMongo } from "src/utils/connectMongo";
import { User, ItemCombo } from "models/schemas";

export default async (req, res) => {
  //if method is GET, return user based on clerkId
  connectMongo();
  if (req.method === "GET") {
    const combos = await ItemCombo.find({});

    res.status(200).json(combos);
  }
  if (req.method === "POST") {
    const { id, combos } = req.body;
    //find user and update comboItems field with combos
    User.findByIdAndUpdate(id, { comboItems: combos }).then((user) => {
      res.status(200).json(user);
    });
  }
  if (req.method === "PUT") {
    try {
      const { id, combo } = req.body;
      //update specifc combo using the clerk id for the combo which is inside User.comboItems
      const user = await User.findOne({ clerkId: id });
      const itemIndex = user.comboItems.findIndex((item) => item.id === combo.id);

      if (itemIndex !== -1) {
        // Update the item at the specified index
        user.comboItems[itemIndex] = combo;

        // Save the updated user document
        await user.save();

        return res.status(200).send(user);
      } else {
        console.log("Item not found in the array.");
        return res.status(404).send("Item not found in the array.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      return res.status(500).send("Error updating item.");
    }
  }
};
