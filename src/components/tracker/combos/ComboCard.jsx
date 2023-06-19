import { addCommas, isObjectEmpty } from "@/src/utils/utilities";
import Divider from "@mui/material/Divider";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ComboEdit from "./ComboEdit";

export const ComboCard = ({ combo, prices, deleteCombo, allItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [editing, setEditing] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const calculateProfit = () => {
    let profit = 0;
    combo.parts.forEach((part) => {
      profit += prices[part.osrs_id] ? prices[part.osrs_id].low : 0;
    });
    profit = (prices[combo.product.osrs_id].high * 0.99 - profit).toFixed(0);
    return profit;
  };

  // const calculateCost = () => {
  //   let cost = 0;
  //   combo.parts.forEach((part) => {
  //     cost += prices[part.osrs_id] ? prices[part.osrs_id].low : 0;
  //   });
  //   return cost;
  // };

  return (
    <div className="rounded-md shadow bg-slate-200 flex flex-col">
      <div className="rounded-t-md px-4 py-2 bg-slate-500 mb-4 flex justify-between">
        <h2 className=" text-slate-50 font-medium">{combo.name}</h2>
        <IconButton
          className="text-slate-100"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <SettingsIcon fontSize="large" />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              setEditing(true);
              handleClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem onClick={handleClose}>Delete</MenuItem>
          <MenuItem onClick={handleClose}>Cancel</MenuItem>
        </Menu>
      </div>
      {editing ? (
        <ComboEdit combo={combo} prices={prices} setEditing={setEditing} allItems={allItems} />
      ) : (
        <div className="p-4 flex flex-col justify-between flex-1">
          <div className="grid gap-6 md:grid-cols-2 text-sm md:text-base">
            {/* <Image src="https://picsum.photos/100" width={100} height={100} /> */}
            <div className="">
              <h3 className="mb-2 text-center">Components</h3>
              <ComponentsTable rows={combo.parts} prices={prices} priceType="Low" />
            </div>
            <div>
              <h3 className="mb-2 text-center">Item</h3>
              <ComponentsTable rows={[combo.product]} prices={prices} priceType="High" />
            </div>
          </div>
          {!isObjectEmpty(prices) && (
            <div>
              <Divider className="mt-4 mb-2" />
              <div className="">
                {/* <div className="p-2">
                <h4 className="whitespace-nowrap font-normal">Components</h4>
                <p className="text-base md:text-xl font-semibold text-slate-600">{addCommas(calculateCost() || "")}</p>
              </div>
              <div className="p-2">
                <h4 className="whitespace-nowrap font-normal">Item</h4>
                <p className="text-base md:text-xl font-semibold text-slate-600">
                  {prices[combo.product.osrs_id] ? addCommas(prices[combo.product.osrs_id].high) : "N/A"}
                </p>
              </div> */}
                <div
                  className={`rounded p-2 flex gap-2 justify-between ${
                    calculateProfit() < 0 ? "bg-red-200" : "bg-emerald-200"
                  }`}
                >
                  <h4 className="">
                    Profit <span className="text-xs text-slate-500">(after tax)</span>
                  </h4>
                  <p className={`text-base md:text-xl font-semibold`}> {addCommas(calculateProfit() || "")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ComponentsTable = ({ rows, prices, priceType }) => {
  const getPrice = (id) => {
    if (priceType === "Low") {
      return prices[id] ? addCommas(prices[id].low) : "N/A";
    } else {
      return prices[id] ? addCommas(prices[id].high) : "N/A";
    }
  };

  const componentsCost = () => {
    let cost = 0;
    rows.forEach((part) => {
      cost += prices[part.osrs_id] ? prices[part.osrs_id].low : 0;
    });
    return cost;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">{priceType} Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((part, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Link
                    href={`https://prices.runescape.wiki/osrs/item/${part.osrs_id}`}
                    target="_blank"
                    className="text-sky-600 underline"
                  >
                    {part.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{getPrice(part.osrs_id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {priceType === "Low" && !isObjectEmpty(prices) && (
        <div className="text-right mt-2 p-2">
          <p>
            <span>{"Total: "}</span> <span className="font-medium text-lg">{addCommas(componentsCost())}</span>
          </p>
        </div>
      )}
    </>
  );
};
