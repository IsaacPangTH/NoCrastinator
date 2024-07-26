import React from "react";
import {
  LocalizationProvider,
  DateTimePicker,
  DatePicker,
  TimePicker,
  renderTimeViewClock,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

export default function DtPicker({ type, label, id, name, value, onChange, onClear, required }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {type === "DateTime" && (
        <DateTimePicker
          label={label}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          ampm={false}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          slotProps={{
            textField: {
              required: required,
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
              required: { required },
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
          ampm={false}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
          slotProps={{
            textField: {
              required: { required },
              clearable: true,
              format: "HH:mm",
            },
          }}
        />
      )}
    </LocalizationProvider>
  );
}
