import React, { useState, useEffect, useContext } from 'react';
import { MultiSelect } from "react-multi-select-component";
import supabase from "../config/supabaseClient";
import PaymentPerMonth from './PaymentPerMonth';
import { SupabaseContext } from '..';
import ".."
import "./SelectDebt.css"
import ThisMonthsPayment from './ThisMonthsPayment';
import PieChartInterestPrincipal from './PieChartInterestPrincipal';


const SelectDebt = () => {
    const queryResults = useContext(SupabaseContext)
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);

    const [datas, setDatas] = useState('');
    // const navigate = useNavigate();
    const [createdAt, setCreatedAt] = useState("");
    const [maturityDate, setMaturityDate] = useState("");
    const [beginningBalance, setBeginningBalance] = useState("");
    const [interest, setInterest] = useState("");
    const [monthlyPayment, setMonthlyPayment] = useState("");
    const [paymentFrequency, setPaymentFrequency] = useState("");
    const [interestFrequency, setInterestFrequncy] = useState("");
    const [title, setTitle] = useState("");

    const [amortizationData, setAmortizationData] = useState([]);

    function getNoOfMonths(from, to) {
        const createdDate = from
        const maturityDate = to
        const date1 = new Date(createdDate);
        const date2 = new Date(maturityDate);
        const time = Math.abs(date1 - date2);
        const days = Math.ceil(time / (1000 * 60 * 60 * 24));
        const months = days / 30;
        const maturity_months = Math.round(months);
        return maturity_months;
    }

    function getFirstDayOfNextMonth(from, adden) {
        const date = new Date(from);
        var d = new Date(date.getFullYear(), date.getMonth() + adden, 1);

        var datestring =
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            ("0" + d.getDate()).slice(-2) +
            "/" +
            d.getFullYear();

        return datestring;
    }

    function getFirstDayOfPlusThreeMonth(from) {
        const date = new Date(from);
        var d = new Date(date.getFullYear(), date.getMonth() + 3, 1);

        var datestring =
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            ("0" + d.getDate()).slice(-2) +
            "/" +
            d.getFullYear();

        return datestring;
    }

    const handleChange = async (selected) => {
        //console.log(selected)
        setSelected(selected);
        var selectedId = selected.map(item => item.value)
        //console.log(selectedId)
        try {
            const res = await supabase
                .from('debts')
                .select('*')
                .in('id', selectedId)
            if (res.data) {
                setDatas(res.data)
                setCreatedAt(res.data.created_at);
                setMaturityDate(res.data.maturity_date);
                setBeginningBalance(res.data.current_balance);
                setInterest(res.data.interest);
                setMonthlyPayment(res.data.budgeted_payment);
                setPaymentFrequency(res.data.payment_frequency);
                setInterestFrequncy(res.data.interest_frequency);
                setTitle(res.data.title);

                let amortData = res.data.map(debt => {
                    if (debt.maturity_date !== null) {
                        function amortizationSchedule(
                            loanAmount,
                            annualInterestRate,
                            numPayments,
                            interestFrequency,
                            paymentFrequency,
                            createdAt
                        ) {
                            var interestRate;
                            var payment;
                            var remainingBalance = loanAmount;
                            var cumulativeInterest = 0;
                            var schedule = [];
                            var period;
                            var periodLabel;
                            var startDate = createdAt;

                            // calculate interest rate based on frequency
                            if (interestFrequency === "Annually" && paymentFrequency === "Monthly") {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 1;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
                                period = numPayments;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Annually" &&
                                paymentFrequency === "Quarterly"
                            ) {
                                let q = 4;
                                let r = annualInterestRate;
                                let m = 1;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 4;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
                                period = numPayments / 3;
                                periodLabel = "quarter";
                            } else if (
                                interestFrequency === "Quarterly" &&
                                paymentFrequency === "Monthly"
                            ) {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 4;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
                                period = numPayments;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Quarterly" &&
                                paymentFrequency === "Quarterly"
                            ) {
                                interestRate = annualInterestRate / 4;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
                                period = numPayments / 3;
                                periodLabel = "quarter";
                            } else if (
                                interestFrequency === "Monthly" &&
                                paymentFrequency === "Monthly"
                            ) {
                                interestRate = annualInterestRate / 12;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
                                period = numPayments;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Monthly" &&
                                paymentFrequency === "Quarterly"
                            ) {
                                let q = 4;
                                let r = annualInterestRate;
                                let m = 12;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = (qi / 12) * 3;
                                payment =
                                    loanAmount *
                                    (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
                                period = numPayments / 3;
                                periodLabel = "quarter";
                            }
                            // else {
                            //     throw new Error("Invalid interest frequency. Please use 'Annually', 'Quarterly', or 'Monthly'");
                            // }
                            for (var i = 0; i < period; i++) {
                                var interest = remainingBalance * interestRate;
                                cumulativeInterest += interest;
                                var principal = payment - interest;
                                remainingBalance -= principal;
                                if (paymentFrequency === "Monthly") {
                                    if (i === 0) {
                                        var currentBalance = loanAmount
                                        var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
                                    } else {
                                        var currentBalance = schedule[i - 1].remainingBalance
                                        var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
                                    }
                                    schedule.push({
                                        [periodLabel]: i + 1,
                                        interest: interest,
                                        cumulativeInterest: cumulativeInterest,
                                        principal: principal,
                                        remainingBalance: remainingBalance,
                                        payment: payment,
                                        currentBalance: currentBalance,
                                        paymentDate: paymentDate,
                                    });
                                } else {

                                    if (i === 0) {
                                        var currentBalance = loanAmount
                                        var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
                                    } else {
                                        var currentBalance = schedule[i - 1].remainingBalance
                                        var paymentDate = getFirstDayOfPlusThreeMonth(schedule[i - 1].paymentDate)
                                    }
                                    schedule.push({
                                        [periodLabel]: i + 1,
                                        interest: interest,
                                        cumulativeInterest: cumulativeInterest,
                                        principal: principal,
                                        remainingBalance: remainingBalance,
                                        payment: payment,
                                        currentBalance: currentBalance,
                                        paymentDate: paymentDate,
                                    });
                                }
                            }
                            return schedule;
                        }

                        let schedule = amortizationSchedule(
                            beginningBalance,
                            interest / 100,
                            getNoOfMonths(),
                            interestFrequency,
                            paymentFrequency,
                            createdAt,
                        );

                        return amortizationSchedule(debt.current_balance, debt.interest / 100, getNoOfMonths(debt.created_at, debt.maturity_date), debt.interest_frequency, debt.payment_frequency, debt.created_at);

                    }
                    /*  Budgeted Payment*/
                    else {
                        function amortizationSchedule(
                            loanAmount,
                            annualInterestRate,
                            monthlyPayment,
                            interestFrequency,
                            paymentFrequency,
                            createdAt
                        ) {
                            var interestRate;
                            var payment = monthlyPayment;
                            var remainingBalance = loanAmount;
                            var cumulativeInterest = 0;
                            var schedule = [];
                            var period;
                            var periodLabel;
                            var startDate = createdAt;

                            if (interestFrequency === "Monthly" && paymentFrequency === "Monthly") {
                                interestRate = annualInterestRate / 12;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Quarterly" &&
                                paymentFrequency === "Monthly"
                            ) {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 4;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                periodLabel = "month";
                            } else if (
                                interestFrequency === "Annually" &&
                                paymentFrequency === "Monthly"
                            ) {
                                let q = 12;
                                let r = annualInterestRate;
                                let m = 1;
                                let rdm = r / m;
                                let qi = q * (Math.pow(1 + rdm, m / q) - 1);

                                interestRate = qi / 12;
                                periodLabel = "month";
                            }

                            let latestEndingBalance = 1;
                            for (var i = 0; latestEndingBalance > 0; i++) {
                                var interest = remainingBalance * interestRate;
                                cumulativeInterest += interest;
                                var principal = payment - interest;
                                remainingBalance -= principal;
                                var currentBalance =
                                    i === 0 ? loanAmount : schedule[i - 1].remainingBalance;
                                var paymentDate;

                                if (paymentFrequency === "Monthly") {
                                    if (currentBalance < payment) {
                                        principal = currentBalance;
                                        interest = currentBalance * interestRate;
                                        payment = principal + interest;
                                        cumulativeInterest = schedule[i - 1].cumulativeInterest + interest;
                                        remainingBalance = 0;

                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;

                                    } else {
                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;
                                    }
                                } else {
                                    if (currentBalance < payment) {
                                        principal = currentBalance;
                                        interest = currentBalance * interestRate;
                                        payment = principal + interest;
                                        cumulativeInterest = schedule[i - 1].cumulativeInterest + interest;
                                        remainingBalance = 0;

                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;

                                    } else {
                                        schedule.push({
                                            [periodLabel]: i + 1,
                                            interest: interest,
                                            cumulativeInterest: cumulativeInterest,
                                            principal: principal,
                                            remainingBalance: remainingBalance,
                                            payment: payment,
                                            currentBalance: currentBalance,
                                            paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
                                        });

                                        latestEndingBalance = remainingBalance;
                                    }
                                }

                            }
                            return schedule;
                        }

                        let schedule = amortizationSchedule(
                            beginningBalance,
                            interest / 100,
                            monthlyPayment,
                            interestFrequency,
                            paymentFrequency
                        );

                        return amortizationSchedule(debt.current_balance, debt.interest / 100, debt.budgeted_payment, debt.interest_frequency, debt.payment_frequency, debt.created_at);

                    }
                });

                setAmortizationData(amortData);

            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await supabase.from('debts').select('*').eq('profile_id', queryResults.id)
                setOptions(res.data.map(item => {
                    return {
                        label: item.title,
                        value: item.id
                    }
                }));
            } catch (e) {
                console.log(e)
            }
        }
        fetchData();
    }, []);

    const sumByPaymentDate = Object.entries(amortizationData.reduce((acc, subArray) => {
        return subArray.reduce((innerAcc, curr) => {
            if (innerAcc[curr.paymentDate]) {
                innerAcc[curr.paymentDate].payment += curr.payment;
                innerAcc[curr.paymentDate].interest += curr.interest;
                innerAcc[curr.paymentDate].principal += curr.principal;
            } else {
                innerAcc[curr.paymentDate] = {
                    payment: curr.payment,
                    interest: curr.interest,
                    principal: curr.principal
                };
            }
            return innerAcc;
        }, acc);
    }, {}));

    const finalArray = sumByPaymentDate.map(([date, value]) => {
        return { ...value, date };
    });

    finalArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    let currentDate = new Date();

    // Get the current month and year
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let currentPayment;
    let totalInterest = 0;
    let totalPrincipal = 0;

    for (let i = 0; i < finalArray.length; i++) {
        let paymentDate = new Date(finalArray[i].date);
        let paymentMonth = paymentDate.getMonth();
        let paymentYear = paymentDate.getFullYear();

        if (currentMonth === paymentMonth && currentYear === paymentYear) {
            currentPayment = finalArray[i];
        }

        totalInterest += finalArray[i].interest;
        totalPrincipal += finalArray[i].principal;
    }

    const thisMonthsPayment = currentPayment
    const totalInterestPrincipal = [{ "name": "Interest", "value": totalInterest }, { "name": "Principal", "value": totalPrincipal }]


    return (
        <>
            <div className="w-full p-10">
                <MultiSelect
                    options={options}
                    value={selected}
                    onChange={handleChange}
                    labelledBy="Select"
                />
            </div>
            <hr></hr>

            <div className="grid lg:grid-cols-3 sm:grid-cols-1 pr-10 pl-10 pb-10 gap-5 items-start">
                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <ThisMonthsPayment object={thisMonthsPayment} />
                </div>
                <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <PieChartInterestPrincipal object={totalInterestPrincipal} />
                    
                </div>

                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <PaymentPerMonth object={finalArray} />
                </div>

            </div>
        </>


    );
};

export default SelectDebt;