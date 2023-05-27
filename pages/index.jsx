import * as React from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export default function Index() {
  return (
    <Container maxWidth="md" className="my-6">
      <main className="text-center mt-24">
        <h1 className="text-slate-600 md:text-5xl md:leading-relaxed">
          Start Making Money with Our Powerful Flipping Tool
        </h1>
        <h3 className="my-6 text-slate-500 text-2xl">Try for free. No credit card needed</h3>
        <div className="flex gap-2 w-fit mx-auto my-8">
          <Link href="/sign-in" passHref>
            <Button size="large" variant="outlined" color="secondary">
              Login
            </Button>
          </Link>
          <Link href="/sign-up" passHref>
            <Button size="large" variant="contained" color="secondary">
              Sign Up
            </Button>
          </Link>
        </div>
      </main>
    </Container>
  );
}
