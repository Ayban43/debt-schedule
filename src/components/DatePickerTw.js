import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DatePickerTw = ({ value, onChange, useRange, asSingle }) => {

    return (
        <Datepicker
            inputClassName={"bg-gray-50 border border-gray-300 focus:outline-none"}
            useRange={useRange}
            asSingle={asSingle}
            value={value}
            onChange={onChange}
            startFrom={new Date()}
            displayFormat={"MM/DD/YYYY"}
            placeholder={"Please select a date"}
        />
    )
}

export default DatePickerTw