import { getAuth } from "@clerk/nextjs/server";

export default async (req, res) => {
  console.log("user");

  const { userId } = getAuth();
  console.log(userId);
  return res.status(200).json({ success: true });
};
