import path from "path";
import fs from "fs";
import * as EmailValidator from "email-validator";
function buildPath(...args) {
  return path.join(process.cwd(), ...args);
}

function extractData(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export default function handler(req, res) {
  const { method } = req;
  const filePath = buildPath("data", "data.json");
  const { events_categories, allEvents } = extractData(filePath);
  if (!allEvents) {
    res.status(404).json({ message: "No events found" });
  }

  if (method === "POST") {
    const { email, eventId } = req.body;
    //make sure email is a valid email address with correct format
    if (!EmailValidator.validate(email)) {
      res.status(422).json({ message: "Invalid email address" });
      return;
    }

    const newAllEvents = allEvents.map((event) => {
      if (event.id === eventId) {
        if (event.emails_registered.includes(email)) {
          res.status(409).json({ message: `You have already registered for email: ${email}` });
          return event;
        }
        return {
          ...event,
          emails_registered: [...event.emails_registered, email],
        };
      }
      return event;
    });

    fs.writeFileSync(filePath, JSON.stringify({ events_categories, allEvents: newAllEvents }));

    res.status(200).json({ message: `You have been registered successfully for email: ${email}` });
  }
}
