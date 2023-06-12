import { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Card from "@mui/material/Card";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CardContent } from "@mui/material";
export const TrackingSettings = ({ delay, setDelay }) => {
  let [showInfo, setShowInfo] = useState(false);
  const updateDelay = (direction) => {
    if (direction === "down") {
      delay > 5 && setDelay(delay - 5);
    } else {
      setDelay(delay + 5);
    }
  };

  return (
    <Card className="w-full ">
      <h2 className="text-center py-4 text-3xl">Tracking Settings</h2>
      <CardContent>
        <div className="grid gap-4 text-slate-600">
          <h4 className="text-center">Notification timeout (minutes)</h4>
          <div className="flex gap-2 justify-center ml-8">
            <div className="flex">
              <Button
                variant="outlined"
                className="text-xl"
                onClick={() => {
                  updateDelay("down");
                }}
              >
                <RemoveIcon />
              </Button>
              <div className="w-12 text-center text-2xl">{delay}</div>
              <Button
                variant="outlined"
                onClick={() => {
                  updateDelay("up");
                }}
              >
                <AddIcon />
              </Button>
            </div>
            <IconButton
              aria-label="info"
              size="small"
              onClick={() => {
                setShowInfo(!showInfo);
              }}
            >
              <InfoIcon />
            </IconButton>
          </div>
          {showInfo && (
            <div className="text-sm text-slate-500">
              The amount of time that needs to pass before you get an email for the same item. This is done to prevent
              getting an email for the same item every 5 minutes.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
