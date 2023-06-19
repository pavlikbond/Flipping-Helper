import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAllItems } from "@/src/hooks/useAllItems";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const ComboEdit = ({ combo, allItems, setEditing }) => {
  const [parts, setParts] = useState(JSON.parse(JSON.stringify(combo.parts)));
  const [product, setProduct] = useState({ ...combo.product });
  let { userId } = useAuth();

  const deleteItem = (index) => {
    setParts(parts.filter((part, i) => i !== index));
  };

  const addBlankPart = () => {
    setParts([...parts, { name: "", osrs_id: 0 }]);
  };

  const save = () => {
    combo.parts = parts;
    combo.product = product;
    updateCombo.mutate();
    setEditing(false);
  };

  const updateCombo = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put("/api/combos", { id: userId, combo: combo });
      return data;
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <div className="p-4">
      <div className="grid gap-4">
        <div>
          <h2 className="mb-2 text-center">Components</h2>
          <div className="grid gap-2">
            {parts.map((part, index) => {
              return <ItemCard key={index} item={part} index={index} deleteItem={deleteItem} allItems={allItems} />;
            })}

            <Button variant="contained" onClick={addBlankPart}>
              Add Component
            </Button>
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-center">Item</h2>
          <ItemCard item={product} index={0} deleteItem={() => {}} allItems={allItems} allowDelete={false} />
        </div>
      </div>
      <Divider className="my-3" />
      <div className="flex justify-end gap-4">
        <Button className="" variant="outlined" onClick={() => setEditing(false)}>
          Cancel
        </Button>
        <Button className="" variant="contained" onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
};

const ItemCard = ({ item, index, deleteItem, allItems, allowDelete = true }) => {
  const { data, isLoading, isError } = allItems;
  const [editing, setEditing] = useState(!!!item.name);
  const cardClasses = "flex justify-between items-center rounded-md shadow bg-slate-50 p-2";
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 25,
  });

  if (editing)
    return (
      <div key={index} className={cardClasses}>
        <Autocomplete
          filterOptions={filterOptions}
          onChange={(e, newValue) => {
            item.name = newValue;
            item.osrs_id = data.find((item) => item.name === newValue).id;
            setEditing(false);
          }}
          options={data.map((item) => item.name) || []}
          className="w-full md:w-80"
          renderInput={(params) => <TextField {...params} label="New Item" />}
        />
        <IconButton
          onClick={() => {
            if (!item.name) deleteItem(index);
            else setEditing(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
    );
  else
    return (
      <div key={index} className={cardClasses}>
        <p className="">{item.name}</p>
        <div>
          <IconButton onClick={() => setEditing(true)}>
            <EditIcon />
          </IconButton>
          {allowDelete && (
            <IconButton className="ml-3" onClick={() => deleteItem(index)}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      </div>
    );
};

const ProductCard = ({ item }) => {
  return <div>{item.name}</div>;
};

export default ComboEdit;
