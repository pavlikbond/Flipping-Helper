import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const Trigger = () => {
  let [pageLoaded, setPageLoaded] = useState(false);
  let { userId } = useAuth();
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (pageLoaded) {
      fetch("/api/mongo_user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracking: checked, clerkId: userId }),
      })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
    setPageLoaded(true);
  }, [checked]);
  return (
    <div className="bg-slate-200 rounded shadow py-2 px-8 w-full md:w-fit border-solid border border-slate-600 flex flex-col justify-center">
      <h2 className="text-slate-700 text-center">Tracking</h2>
      <div className="flex-gap-2 mx-auto">
        <span className={`${!checked ? "text-slate-600" : "text-slate-400"} font-semibold text-lg`}>Off</span>
        <IOSSwitch
          sx={{ m: 1 }}
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
        <span className={`${checked ? "text-slate-600" : "text-slate-400"} font-semibold text-lg`}>On</span>
      </div>
    </div>
  );
};

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "rgb(203 213 225)" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

export default Trigger;
