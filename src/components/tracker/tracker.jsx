import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import Trigger from "src/components/tracker/trigger";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const Tracker = ({ mongoUser, items, limit }) => {
  let [trackedItems, setTrackedItems] = useState(mongoUser.trackedItems);
  let [alerts, setAlerts] = useState([]);
  let [newItem, setNewItem] = useState();
  let [changesMade, setChangesMade] = useState(false);
  let [hideLimitReached, setHideLimitReached] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put("/api/update-tracked-items", { userData: mongoUser });
      return data;
    },
    onSuccess: () => {
      setAlerts([{ severity: "success", message: "Update Successful" }]);
      setChangesMade(false);
    },
    onError: () => {
      setAlerts([{ severity: "error", message: "Update Failed" }]);
    },
  });

  const addItem = () => {
    setChangesMade(true);
    let osrs_id = items.find((item) => item.name === newItem)?.osrs_id;
    if (!osrs_id) {
      setAlerts([{ severity: "error", message: "Item not found" }]);
      return;
    }
    setTrackedItems([
      {
        uuid: uuidv4(),
        name: newItem,
        threshold: 2.5,
        osrs_id: items.find((item) => item.name === newItem).osrs_id,
        lastNotified: 0,
      },
      ...trackedItems,
    ]);
  };

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 5,
  });

  const removeItem = (index) => {
    setChangesMade(true);
    setTrackedItems(trackedItems.filter((item, i) => i !== index));
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col gap-6 mb-8">
        <Trigger mongoUser={mongoUser} />
        <div className="flex gap-4 h-[50px]">
          <Button
            className="w-24 flex gap-4"
            variant={changesMade ? "contained" : "outlined"}
            onClick={mutation.mutate}
          >
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
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex gap-4 ">
            <Autocomplete
              filterOptions={filterOptions}
              onChange={(e, newValue) => {
                setNewItem(newValue);
              }}
              options={items.map((item) => item.name) || []}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="New Item" />}
              disabled={trackedItems.length >= limit}
            />
            <Button variant="outlined" onClick={addItem} disabled={trackedItems.length >= limit}>
              Add
            </Button>
          </div>
          {trackedItems.length >= limit && !hideLimitReached && (
            <Alert
              severity="warning"
              className="shadow"
              onClose={() => {
                setHideLimitReached(true);
              }}
            >
              <Link href="/pricing" className="text-blue-600 underline decoration-2 underline-offset-4 ">
                Upgrade
              </Link>{" "}
              to track more items
            </Alert>
          )}
        </div>
      </div>
      {trackedItems.map((item, index) => {
        return (
          <div key={uuidv4()}>
            <ItemCard
              item={item}
              removeItem={() => {
                removeItem(index);
              }}
              setChangesMade={setChangesMade}
              index={index}
            />
            <Divider />
          </div>
        );
      })}
    </div>
  );
};

export const ItemCard = ({ item, removeItem, setChangesMade, index }) => {
  const [threshold, setThreshold] = useState(item.threshold || 2.5);

  const onUpdateThreshold = (e) => {
    setChangesMade(true);
    //create regex that only allows numbers and a single decimal
    const regex = /^[0-9]*\.?[0-9]*$/;
    //if the input is not a number, don't update the state, don't allow the user to type it
    if (!regex.test(e.target.value)) {
      return;
    }
    setThreshold(e.target.value);
    //update the threshold in the data object
    item.threshold = Number(e.target.value) || 2.5;
  };

  return (
    <div key={item.osrs_id} className="flex gap-1 md:gap-4 w-full my-3 justify-between">
      <h2 className="w-[180px] md:w-1/3 font-semibold text-sm md:text-lg text-slate-500">
        <span className="text-slate-400 font-normal">{index + 1}.</span> {item.name}
      </h2>
      <TextField
        size="small"
        label="Threshold"
        variant="outlined"
        onChange={onUpdateThreshold}
        value={threshold}
        inputProps={{ maxLength: 8, type: "tel" }}
        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
        className="w-1/12 min-w-[80px]"
      />
      <Button className="w-1/12" variant="outlined" color="error" onClick={removeItem}>
        {<CloseIcon className="block sm:hidden" />}
        {<span className="hidden sm:block">Delete</span>}
      </Button>
    </div>
  );
};
