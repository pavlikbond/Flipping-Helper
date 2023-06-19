import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { ComboCard } from "./ComboCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as uuidv4 } from "uuid";
import { wait } from "@/src/utils/wait";
export const CombosPage = ({ mongoUser, combos }) => {
  const comboAutoComplete = useRef("");
  const [alerts, setAlerts] = useState([]);
  const [trackedCombos, setTrackedCombos] = useState([]);
  const timeChecked = useRef(0);
  const [prices, setPrices] = useState({});
  const [autoCom, setAutoCom] = useState("");
  const [edit, setEdit] = useState(false);

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });

  //get list of items from runescape api
  const getAllItems = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data } = await axios.get("https://prices.runescape.wiki/api/v1/osrs/mapping");
      console.log(data);
      return data;
    },
  });

  useEffect(() => {
    if (mongoUser && mongoUser.comboItems?.length) {
      const alphabetizeCombos = (combos) => {
        return combos.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (b.name < a.name) {
            return 1;
          }
          return 0;
        });
      };
      setTrackedCombos(alphabetizeCombos(mongoUser.comboItems));
    }
  }, [combos]);

  const updateCombos = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/combos", { id: mongoUser._id, combos: trackedCombos });
      return data;
    },
    onSuccess: () => {
      setAlerts([{ severity: "success", message: "Update Successful" }]);
    },
    onError: (e) => {
      console.log(e);
      setAlerts([{ severity: "error", message: "Update Failed" }]);
    },
  });

  const getCurrentPrices = useMutation({
    mutationFn: async () => {
      await wait(1000);
      const { data } = await axios.get("https://prices.runescape.wiki/api/v1/osrs/latest");
      return data;
    },
    onSuccess: (data) => {
      setPrices(data.data);
    },
  });

  const getOptions = () => {
    let comboNames = combos.map((combo) => combo.name);
    //sort alphabetically and return
    return comboNames.sort((a, b) => {
      if (a < b) return -1;
      if (b < a) return 1;
      return 0;
    });
  };

  const addItem = () => {
    if (!comboAutoComplete.current) {
      return;
    }
    let comboName = comboAutoComplete.current;
    let foundCombo = combos.find((combo) => combo.name === comboName);
    if (foundCombo) {
      //check for duplicates
      if (trackedCombos.find((combo) => combo.name === comboName)) {
        setAlerts([{ severity: "error", message: "Combo already being tracked" }]);
        return;
      }
      setTrackedCombos([{ id: uuidv4(), ...foundCombo }, ...trackedCombos]);
    }
    setAutoCom("");
  };

  const deleteCombo = (id) => {
    setTrackedCombos(trackedCombos.filter((combo) => combo.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Autocomplete
            value={autoCom}
            filterOptions={filterOptions}
            onChange={(e, newValue) => {
              comboAutoComplete.current = newValue;
              setAutoCom(newValue);
            }}
            options={getOptions() || []}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Common combinations" />}
          />
          <Button variant="outlined" onClick={addItem}>
            Add
          </Button>
        </div>
        <div className="flex gap-2 h-12">
          <Button className="w-24 flex gap-4" variant={"contained"} onClick={updateCombos.mutate}>
            {updateCombos.isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
          <Button variant="outlined" onClick={getCurrentPrices.mutate}>
            {getCurrentPrices.isLoading ? <CircularProgress size={24} /> : " Get current prices"}
          </Button>
        </div>
        <div>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        {trackedCombos.map((combo, index) => {
          return (
            <ComboCard combo={combo} key={index} prices={prices} deleteCombo={deleteCombo} allItems={getAllItems} />
          );
        })}
      </div>
    </div>
  );
};
