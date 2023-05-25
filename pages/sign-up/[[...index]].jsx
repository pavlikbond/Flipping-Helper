import { SignUp } from "@clerk/nextjs";
import Box from "@mui/material/Box";
export default function Page() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" className="mt-12">
      <SignUp />
    </Box>
  );
}
