import React from 'react'
import { useState } from 'react';


const ProgressBar = (props) => {
    const { object } = props;

    const [{ name: Paid, value: PaidValue },
        { name: Unpaid, value: UnpaidValue },
        { name: PercentPaid, value: PercentPaidValue },
        { name: PercentUnpaid, value: PercentUnpaidValue }] = object;

    let percentString = PercentPaidValue + "%";

    console.log({ PercentPaidValue })

    if (isNaN(PercentPaidValue)) {
        return (
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Progress bar</h5>
        )
    } else {
        return (
            <div>
                <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Progress bar</h5>
                {/* <div>
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className="h-6 bg-blue-600 text-xs font-medium text-blue-100 text-end p-0.5 leading-5 rounded-full" style={{ width: `${percentString}` }}></div>
                    </div>
                </div>
                <div>
                    {PercentPaidValue.toFixed(2)}%
                </div> */}

                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-600 bg-sky-200">
                                Payment
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-base font-semibold inline-block text-sky-600">
                                {PercentPaidValue.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-6 mb-2 text-xs flex rounded bg-sky-200">
                        <div style={{ width: `${percentString}` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500"></div>
                    </div>
                </div>

            </div>
        )
    }


}

export default ProgressBar