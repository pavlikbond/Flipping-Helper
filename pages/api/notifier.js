import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { Item, User } from "models/schemas";
import { connectMongo } from "utils/connectMongo";

export default async (req, res) => {
  await connectMongo();
  let data = await fetch("https://prices.runescape.wiki/api/v1/osrs/latest")
    .then((response) => response.json())
    .then(async (data) => {
      //console.log(data);
      return data;
    });
  //get all users
  let users = await User.find({ tracking: true }).exec();
  for (let user of users) {
    let trackedItems = user.trackedItems;
    let items = await Item.find({ name: { $in: trackedItems.map((item) => item.name) } }).exec();
    let valueItems = [];
    for (let item of items) {
      let [key, value] = Object.entries(data.data).find(([key, value]) => {
        return item.osrs_id === Number(key);
      });
      let low = value.low;
      let high = value.high;
      let percentDifference = ((high - low) / low) * 100;
      //round to 2 decimal places
      percentDifference = Math.round(percentDifference * 100) / 100;

      let itemPercentDifference = trackedItems.find((trackedItem) => trackedItem.name === item.name).threshold || 2.5;

      low = low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      high = high.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      let report = `${item.name} ${percentDifference}% low: ${low} high: ${high} threshold: ${itemPercentDifference}%`;
      console.log(report);

      if (percentDifference > itemPercentDifference) {
        //check trackedItems if lastNotified unix timestamp is more than 15 minutes ago and call notify
        let trackedItem = trackedItems.find((trackedItem) => trackedItem.name === item.name);
        //if lastNotified is more than 15 minutes ago
        if (trackedItem.lastNotified < Date.now() - 15 * 60 * 1000) {
          //update user's lastNotified for that specific item
          user.trackedItems.find((trackedItem) => trackedItem.name === item.name).lastNotified = Date.now();
          valueItems.push(report);
        }
      }
    }
    if (valueItems.length > 0) {
      user.markModified("trackedItems");
      await user.save();
      notify(valueItems, user.email);
    } else {
      console.log("\nNo items to notify");
    }
  }
};

function notify(valueItems, email) {
  console.log("sending email for:\n" + valueItems.join("\n"));
  let transporter = nodemailer.createTransport({
    service: "yahoo",
    auth: {
      user: process.env.YAHOO_EMAIL,
      pass: process.env.YAHOO_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.YAHOO_EMAIL,
    to: email,
    subject: "OSRS Helper",
    text: new Date().toLocaleString() + "\n" + valueItems.join("\n"),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

mongoose.connection.close().catch((err) => console.log(err));
