import TextField from "@mui/material/TextField";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";

export const Tracker = ({ data, items }) => {
  let [trackedItems, setTrackedItems] = useState(data.trackedItems);
  let [waiting, setWaiting] = useState(false);
  let [alerts, setAlerts] = useState([]);
  let [newItem, setNewItem] = useState();
  let [changesMade, setChangesMade] = useState(false);

  const onSave = () => {
    setWaiting(true);
    setAlerts([]);
    data.trackedItems = trackedItems;
    fetch("/api/update-tracked-items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData: data }),
    }).then((res) => {
      setWaiting(false);
      setChangesMade(false);
      if (res.status === 200) {
        setAlerts([{ severity: "success", message: "Successfully updated tracked items" }]);
      } else {
        setAlerts([{ severity: "error", message: "Failed to update tracked items" }]);
      }
      console.log(res);
    });
  };

  const addItem = () => {
    setChangesMade(true);
    setTrackedItems([
      {
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
    //remove by index
    return () => {
      setChangesMade(true);
      setTrackedItems(trackedItems.filter((item, i) => i !== index));
    };
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex gap-4 h-[50px]">
          <Button className="w-24 flex gap-4" variant={changesMade ? "contained" : "outlined"} onClick={onSave}>
            {waiting && <CircularProgress size={24} />}
            Save
          </Button>
          {alerts.map((alert, index) => {
            return (
              <Alert
                onClose={(i) => {
                  setAlerts(alerts.filter((alert, i) => i !== index));
                }}
                key={index}
                severity={alert.severity}
              >
                {alert.message}
              </Alert>
            );
          })}
        </div>
        <div className="flex gap-4">
          <Autocomplete
            filterOptions={filterOptions}
            onChange={(e, newValue) => {
              setNewItem(newValue);
            }}
            options={items.map((item) => item.name) || []}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="New Item" />}
          />
          <Button variant="outlined" onClick={addItem}>
            Add
          </Button>
        </div>
      </div>
      {trackedItems.map((item, index) => {
        return (
          <div key={item.osrs_id}>
            <ItemCard item={item} removeItem={removeItem(index)} setChangesMade={setChangesMade} />
            <Divider />
          </div>
        );
      })}
    </div>
  );
};

export const ItemCard = ({ item, removeItem, setChangesMade }) => {
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
      <h2 className="w-[180px] md:w-1/3 font-semibold text-lg text-slate-500">{item.name}</h2>
      <TextField
        size="small"
        label="Threshold"
        variant="outlined"
        onChange={onUpdateThreshold}
        value={threshold}
        inputProps={{ maxLength: 8 }}
        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
        className="w-1/12 min-w-[70px]"
      />
      <Button className="w-1/12" variant="outlined" color="error" onClick={removeItem}>
        {<CloseIcon className="block sm:hidden" />}
        {<span className="hidden sm:block">Delete</span>}
      </Button>
    </div>
  );
};
