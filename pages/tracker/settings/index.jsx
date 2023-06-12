import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Container } from "@mui/material";
import { EmailSettings } from "/src/components/tracker/settings/EmailSettings.jsx";
import { TrackingSettings } from "/src/components/tracker/settings/TrackingSettings.jsx";
import { connectMongo } from "src/utils/connectMongo.js";
import { getAuth } from "@clerk/nextjs/server";
import { User } from "models/schemas.js";
const SettingsPage = ({ mongoUser }) => {
  const [alerts, setAlerts] = useState([]);
  const [emailSettings, setEmailSettings] = useState(
    mongoUser?.settings?.email || {
      addHighLow: false,
      addThreshold: false,
      addLink: false,
      addProfit: false,
    }
  );
  const [delay, setDelay] = useState(mongoUser?.settings?.delay || 15);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put("/api/settings", {
        userId: mongoUser._id,
        settings: { delay: delay, email: emailSettings },
      });
      return data;
    },
    onSuccess: () => {
      setAlerts([{ severity: "success", message: "Update Successful" }]);
    },
    onError: () => {
      setAlerts([{ severity: "error", message: "Update Failed" }]);
    },
  });

  return (
    <Container maxWidth="lg" className="min-w-min my-8 grid gap-6">
      <div className="flex gap-4 h-[50px]">
        <Button className="w-24 flex gap-4" variant="contained" onClick={mutation.mutate}>
          {mutation.isLoading ? <CircularProgress size={24} /> : "Save"}
        </Button>
        {alerts.map((alert, index) => {
          return (
            <Alert
              onClose={(i) => {
                setAlerts(alerts.filter((alert, i) => i !== index));
              }}
              key={index}
              severity={alert.severity}
              className="shadow-md"
            >
              {alert.message}
            </Alert>
          );
        })}
      </div>
      <TrackingSettings delay={delay} setDelay={setDelay} />
      <EmailSettings emailSettings={emailSettings} setEmailSettings={setEmailSettings} />
    </Container>
  );
};

export async function getServerSideProps(ctx) {
  const { userId } = getAuth(ctx.req);
  await connectMongo();

  let mongoUser = await User.findOne({ clerkId: userId });
  mongoUser = JSON.parse(JSON.stringify(mongoUser));

  if (mongoUser.plan === "Free") {
    return {
      redirect: {
        destination: "/tracker",
        permanent: false,
      },
    };
  }

  return {
    props: {
      mongoUser,
    },
  };
}

export default SettingsPage;
