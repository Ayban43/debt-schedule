import React from 'react'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

// currency formatter
const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

const PaymentPerMonth = (props) => {
    const { object } = props;

    // console.log(object)
    return (
        <div>
            <h3>Total payment & interest per month</h3>

            <LineChart
                width={1100}
                height={400}
                data={object}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                    formatter={value => formatter.format(value).slice(0, 10)}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="payment"
                    stroke="#8884d8"
                    activeDot={{ r: 1 }}
                />
                <Line
                    type="monotone"
                    dataKey="interest"
                    stroke="#82ca9d"
                />
            </LineChart>
        </div>
    )
}

export default PaymentPerMonth