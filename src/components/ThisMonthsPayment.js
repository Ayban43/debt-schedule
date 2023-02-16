import React from 'react'

const ThisMonthsPayment = (props) => {
    const { object } = props;

    const payment = object?.payment

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: "code"
        }).format(value).replace("USD", "")
            .trim();

    if (payment) {
        return (
            <>
                <h5 className="mb-3 text-xl font-medium text-gray-500 dark:text-gray-400">This month's payment</h5>
                <div className="mb-3">
                    <span className="text-2xl text-gray-700 font-semibold">$</span>
                    <span className="text-4xl text-gray-700 font-extrabold tracking-tight">{numberFormat(object?.payment)}</span>
                </div>

                <div className="mb-3">
                    <div className="mb-2 grid grid-cols-1 justify-items-end">
                        <div>
                            <span className="pr-5 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                Principal:
                            </span>
                            <span className="text-base text-gray-700 font-semibold">$</span>
                            <span className="text-lg text-gray-700 font-semibold">{numberFormat(object?.principal)}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 justify-items-end">

                        <div>
                            <span className="pr-5 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                Interest:
                            </span>
                            <span className="text-base text-gray-700 font-semibold">$</span>
                            <span className="text-lg text-gray-700 font-semibold">{numberFormat(object?.interest)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 justify-items-center">
                    <div>
                        <span className="pr-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                            Due on:
                        </span>
                        <span className="text-lg text-gray-700 font-semibold underline">
                            {object?.date}
                        </span>

                    </div>

                </div>

            </>
        )
    } else {
        return (
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">This month's payment</h5>
        )
    }

}

export default ThisMonthsPayment