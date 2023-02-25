import Datepicker from "react-tailwindcss-datepicker";

const DatePickerTw = ({ value, onChange, useRange, asSingle, minDate, primaryColor }) => {

    return (
        <Datepicker

            inputClassName={"bg-gray-50 border border-gray-300 focus:outline-none"}
            useRange={useRange}
            asSingle={asSingle}
            value={value}
            onChange={onChange}
            minDate={minDate}
            primaryColor={primaryColor}
            startFrom={new Date()}
            displayFormat={"MM/DD/YYYY"}
            placeholder={"Maturity Date"}

        />
    )
}

export default DatePickerTw