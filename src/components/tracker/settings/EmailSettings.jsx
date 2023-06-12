import { useState } from "react";
import { CardContent, Card } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { pink, teal, cyan, purple } from "@mui/material/colors";
import EmailIcon from "@mui/icons-material/Email";

export const EmailSettings = ({ emailSettings, setEmailSettings }) => {
  const previewItems = [
    {
      name: "Ancestral robe top",
      high: 166000000,
      low: 160000000,
      link: "https://prices.runescape.wiki/osrs/21021",
      threshold: 2.5,
      priceDifferencePercent: function () {
        return (((this.high - this.low) / this.low) * 100).toFixed(2);
      },
    },
    {
      name: "Ancestral robe bottom",
      high: 140000000,
      low: 135000000,
      link: "https://prices.runescape.wiki/osrs/21024",
      threshold: 2.5,
      priceDifferencePercent: function () {
        return (((this.high - this.low) / this.low) * 100).toFixed(2);
      },
    },
  ];

  const checkboxes = {
    addHighLow: {
      color: purple[300],
      label: "Add high/low prices",
      tailwindColor: "purple-200 bg-opacity-70",
    },
    addThreshold: {
      color: cyan[300],
      label: "Add your threshold",
      tailwindColor: "cyan-200 bg-opacity-70",
    },
    addLink: {
      color: pink[300],
      label: 'Add link to "prices.runescape.wiki"',
      tailwindColor: "pink-200 bg-opacity-70",
    },
    addProfit: {
      color: teal[300],
      label: "Add profit per item (after taxes)",
      tailwindColor: "teal-200 bg-opacity-70",
    },
  };

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const updateSettings = (event) => {
    setEmailSettings({
      ...emailSettings,
      [event.target.name]: event.target.checked,
    });
  };
  return (
    <div>
      <Card className="w-full text-slate-600">
        <h2 className="text-center py-4 text-3xl flex justify-center items-center gap-2">
          <EmailIcon className="text-4xl" /> <span className="inline-block">Email Settings</span>
        </h2>
        <CardContent>
          <FormGroup className="grid md:grid-cols-2">
            {Object.entries(emailSettings).map(([key, value], index) => {
              return (
                <EmailCheckbox
                  key={key}
                  checked={value}
                  updateSettings={updateSettings}
                  name={key}
                  color={checkboxes[key].color}
                  label={checkboxes[key].label}
                />
              );
            })}
          </FormGroup>
          <div className="mt-6">
            <h4 className="my-2 text-xl">Preview</h4>
            <div className="rounded py-2 px-4 bg-slate-100 grid gap-2">
              {previewItems.map((item, index) => {
                let low = addCommas(item.low);
                let high = addCommas(item.high);
                let profit = addCommas(item.high * 0.99 - item.low);
                return (
                  <div key={index}>
                    {index + 1}. <span>{item.name + `: ${item.priceDifferencePercent()}%`}</span>
                    {emailSettings.addHighLow && (
                      <span
                        className={`inline-block px-2 py-1 rounded m-1 bg-${checkboxes.addHighLow.tailwindColor}`}
                      >{` Low: ${low} High: ${high}`}</span>
                    )}
                    {emailSettings.addThreshold && (
                      <span
                        className={`inline-block px-2 py-1 rounded m-1 bg-${checkboxes.addThreshold.tailwindColor}`}
                      >{` Threshold: ${item.threshold}%`}</span>
                    )}
                    {emailSettings.addLink && (
                      <span
                        className={`inline-block px-2 py-1 rounded m-1 text-sm md:text-base bg-${checkboxes.addLink.tailwindColor}`}
                      >{` ${item.link}`}</span>
                    )}
                    {emailSettings.addProfit && (
                      <span
                        className={`inline-block px-2 py-1 rounded m-1 bg-${checkboxes.addProfit.tailwindColor}`}
                      >{` Profit: ${profit}`}</span>
                    )}
                    {Object.entries(emailSettings).map(([key, value], index) => {
                      return <span key={key}></span>;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const EmailCheckbox = ({ checked, updateSettings, name, color, label }) => {
  return (
    <FormControlLabel
      className="text-4xl"
      control={
        <Checkbox
          size="large"
          checked={checked}
          name={name}
          onClick={updateSettings}
          sx={{
            color: color,
            "&.Mui-checked": {
              color: color,
            },
            "& .MuiSvgIcon-root": { fontSize: 28 },
          }}
        />
      }
      label={<span className="text-base md:text-lg ">{label}</span>}
    />
  );
};
