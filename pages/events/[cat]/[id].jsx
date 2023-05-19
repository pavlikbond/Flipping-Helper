import Image from "next/image";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Page({ data }) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const eventId = router.query?.id;
    try {
      const response = await fetch("/api/email-registration", {
        method: "POST",
        body: JSON.stringify({ email, eventId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="w-[400px] h-[325px] relative">
        <Image alt={data.title} src={data.image} fill style={{ objectFit: "cover" }}></Image>
      </div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button type="submit" variant="contained" color="primary" className="bg-slate-600">
          Register
        </Button>
      </Box>
    </div>
  );
}

export async function getStaticPaths() {
  const data = await import("/data/data.json");
  const { allEvents } = data;
  const paths = allEvents.map((event) => {
    return {
      params: {
        id: event.id,
        cat: event.city,
      },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { allEvents } = await import("/data/data.json");

  const event = allEvents.find((event) => event.id === params.id);
  return {
    props: {
      data: event,
    },
  };
}
