import { connectMongo } from "src/utils/connectMongo.js";
import { User, ItemCombo } from "models/schemas.js";
import Container from "@mui/material/Container";
import { getAuth } from "@clerk/nextjs/server";
import { CombosPage } from "src/components/tracker/combos/CombosPage.jsx";
export default function ComboPage({ mongoUser, combos }) {
  return (
    <Container maxWidth="lg" className="my-6">
      <CombosPage mongoUser={mongoUser} combos={combos} />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const { userId } = getAuth(ctx.req);
  await connectMongo();

  let mongoUser = await User.findOne({ clerkId: userId });
  const combos = await ItemCombo.find({});
  return {
    props: {
      mongoUser: JSON.parse(JSON.stringify(mongoUser)),
      combos: JSON.parse(JSON.stringify(combos)),
    },
  };
}
