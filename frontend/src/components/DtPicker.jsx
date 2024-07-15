import React from "react";
import {
  LocalizationProvider,
  MobileDateTimePicker,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

export default function DtPicker({ type, label, id, name, value, onChange, onClear }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {type === "DateTime" && (
        <MobileDateTimePicker
          orientation="landscape"
          label={label}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              format: "yyyy-MM-dd HH:mm",
            },
          }}
        />
      )}
      {type === "Date" && (
        <DatePicker
          label={label}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              required: true,
              clearable: true,
              format: "yyyy-MM-dd",
              onClear: onClear,
            },
          }}
        />
      )}
      {type === "Time" && (
        <TimePicker
          label={label}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              required: true,
              clearable: true,
              format: "HH:mm",
            },
          }}
        />
      )}
    </LocalizationProvider>
  );
}
