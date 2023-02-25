import { useEffect, useState, useContext, useRef } from 'react'
import CurrencyInput from 'react-currency-input-field'
import DatePickerTw from '../components/DatePickerTw'
import PaymentPerMonth from '../components/PaymentPerMonth'
import PieChartInterestPrincipal from '../components/PieChartInterestPrincipal'
import PieChartLegend from '../components/PieChartLegend'
import RadioButton from '../components/RadioButton'

const MainPage = () => {
  const [title, setTitle] = useState('')
  const [current_balance, setBeginningBalance] = useState(null)
  const [category, setCategory] = useState('')
  const [interest, setInterest] = useState('')
  const [interest_frequency, setInterestFrequency] = useState('')
  const [budgeted_payment, setBudgetedPayment] = useState(null)
  // const [maturity_date, setMaturityDate] = useState({})
  const [payment_frequency, setPaymentFrequency] = useState('')
  const [mat_date, setMatDate] = useState({})
  const [formError, setFormError] = useState(null)
  const [amortizationData, setAmortizationData] = useState(null)
  const [amortizationSchedule, setAmortizationSchedule] = useState(null)

  // const [addData, setAddData] = useState(null)
  // const [sum, setSum] = useState(null)

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  function getNoOfMonths(maturityDate) {
    const date1 = new Date();
    const date2 = new Date(maturityDate);
    const time = Math.abs(date1 - date2);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
    const months = days / 30;
    const maturity_months = Math.round(months);
    return maturity_months;
  }

  // console.log(getNoOfMonths);

  const handleSubmit = (e) => {
    //e.preventDefault();
    const newDebt = { title, current_balance, category, interest, interest_frequency, budgeted_payment, mat_date, payment_frequency };
    // const numberInt = { interest, current_balance }

    setAmortizationData(newDebt);
    setTitle('');
    setCategory('');
    setBeginningBalance('')
    setInterest('')
    setInterestFrequency('')
    setBudgetedPayment('')
    setMatDate({})
    setPaymentFrequency('')
  };

  useEffect(() => {

    if (amortizationData) {
      let maturityDate = null;
      let monthlyPayment = null;
      if (amortizationData) {
        if (amortizationData.mat_date.startDate) {
          maturityDate = amortizationData.mat_date.startDate;
        } else if (amortizationData.budgeted_payment) {
          monthlyPayment = amortizationData.budgeted_payment
        }

        if (maturityDate !== null && amortizationData.budgeted_payment === null) {

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
              periodLabel = "paymentCount";
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
              periodLabel = "paymentCount";
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
              periodLabel = "paymentCount";
            } else if (
              interestFrequency === "Quarterly" &&
              paymentFrequency === "Quarterly"
            ) {
              interestRate = annualInterestRate / 4;
              payment =
                loanAmount *
                (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
              period = numPayments / 3;
              periodLabel = "paymentCount";
            } else if (
              interestFrequency === "Monthly" &&
              paymentFrequency === "Monthly"
            ) {
              interestRate = annualInterestRate / 12;
              payment =
                loanAmount *
                (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
              period = numPayments;
              periodLabel = "paymentCount";
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
              periodLabel = "paymentCount";
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
            amortizationData.current_balance,
            amortizationData.interest / 100,
            getNoOfMonths(maturityDate),
            amortizationData.interest_frequency,
            amortizationData.payment_frequency,
            new Date()
          );

          setAmortizationSchedule(schedule)

        } else if (maturityDate === null && amortizationData.budgeted_payment !== null) {
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
            var startDate = createdAt


            if (interestFrequency === "Monthly" && paymentFrequency === "Monthly") {
              interestRate = annualInterestRate / 12;
              periodLabel = "paymentCount";
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
              periodLabel = "paymentCount";
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
              periodLabel = "paymentCount";
            }

            let latestEndingBalance = 1;
            for (var i = 0; latestEndingBalance > 0; i++) {
              var interest = remainingBalance * interestRate;
              cumulativeInterest += interest;
              var principal = payment - interest;
              remainingBalance -= principal;
              var currentBalance = i === 0 ? remainingBalance + principal : schedule[i - 1].remainingBalance;
              var paymentDate;
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
            return schedule;
          }

          let schedule = amortizationSchedule(
            amortizationData.current_balance,
            amortizationData.interest / 100,
            amortizationData.budgeted_payment,
            amortizationData.interest_frequency,
            amortizationData.payment_frequency,
            new Date()
          );

          setAmortizationSchedule(schedule)
        }
      }
    }



  }, [amortizationData]);

  let sumByPaymentDate = [];
  if (amortizationSchedule !== null && amortizationSchedule !== undefined) {
    sumByPaymentDate = Object.entries(
      amortizationSchedule.reduce((acc, curr) => {
        const paymentDate = curr.paymentDate;
        if (acc[paymentDate]) {
          acc[paymentDate].payment += curr.payment;
          acc[paymentDate].interest += curr.interest;
          acc[paymentDate].principal += curr.principal;
        } else {
          acc[paymentDate] = {
            payment: curr.payment,
            interest: curr.interest,
            principal: curr.principal
          };
        }
        return acc;
      }, {})
    );
  }

  const finalArray = sumByPaymentDate.map(([date, value]) => {
    return { ...value, date };
  });

  finalArray.sort((a, b) => new Date(a.date) - new Date(b.date));

  let totalInterest = 0;
  let totalPrincipal = 0;
  for (let i = 0; i < finalArray.length; i++) {
    totalInterest += finalArray[i].interest;
    totalPrincipal += finalArray[i].principal;
  }

  const totalInterestPrincipal = [{ "name": "Interest", "value": totalInterest }, { "name": "Principal", "value": totalPrincipal }]


  console.log(amortizationSchedule)
  console.log(sumByPaymentDate)

  // let maturityDate = null;
  // let monthlyPayment = null;
  // if (amortizationData) {
  //   if (amortizationData.mat_date.startDate) {
  //     maturityDate = amortizationData.mat_date.startDate;
  //   } else if (amortizationData.budgeted_payment) {
  //     monthlyPayment = amortizationData.budgeted_payment
  //   }


  //   if (maturityDate !== null && amortizationData.budgeted_payment === null) {

  //     function amortizationSchedule(
  //       loanAmount,
  //       annualInterestRate,
  //       numPayments,
  //       interestFrequency,
  //       paymentFrequency,
  //       createdAt
  //     ) {
  //       var interestRate;
  //       var payment;
  //       var remainingBalance = loanAmount;
  //       var cumulativeInterest = 0;
  //       var schedule = [];
  //       var period;
  //       var periodLabel;
  //       var startDate = createdAt;

  //       // calculate interest rate based on frequency
  //       if (interestFrequency === "Annually" && paymentFrequency === "Monthly") {
  //         let q = 12;
  //         let r = annualInterestRate;
  //         let m = 1;
  //         let rdm = r / m;
  //         let qi = q * (Math.pow(1 + rdm, m / q) - 1);

  //         interestRate = qi / 12;
  //         payment =
  //           loanAmount *
  //           (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
  //         period = numPayments;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Annually" &&
  //         paymentFrequency === "Quarterly"
  //       ) {
  //         let q = 4;
  //         let r = annualInterestRate;
  //         let m = 1;
  //         let rdm = r / m;
  //         let qi = q * (Math.pow(1 + rdm, m / q) - 1);

  //         interestRate = qi / 4;
  //         payment =
  //           loanAmount *
  //           (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
  //         period = numPayments / 3;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Quarterly" &&
  //         paymentFrequency === "Monthly"
  //       ) {
  //         let q = 12;
  //         let r = annualInterestRate;
  //         let m = 4;
  //         let rdm = r / m;
  //         let qi = q * (Math.pow(1 + rdm, m / q) - 1);

  //         interestRate = qi / 12;
  //         payment =
  //           loanAmount *
  //           (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
  //         period = numPayments;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Quarterly" &&
  //         paymentFrequency === "Quarterly"
  //       ) {
  //         interestRate = annualInterestRate / 4;
  //         payment =
  //           loanAmount *
  //           (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
  //         period = numPayments / 3;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Monthly" &&
  //         paymentFrequency === "Monthly"
  //       ) {
  //         interestRate = annualInterestRate / 12;
  //         payment =
  //           loanAmount *
  //           (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
  //         period = numPayments;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Monthly" &&
  //         paymentFrequency === "Quarterly"
  //       ) {
  //         let q = 4;
  //         let r = annualInterestRate;
  //         let m = 12;
  //         let rdm = r / m;
  //         let qi = q * (Math.pow(1 + rdm, m / q) - 1);

  //         interestRate = (qi / 12) * 3;
  //         payment =
  //           loanAmount *
  //           (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
  //         period = numPayments / 3;
  //         periodLabel = "paymentCount";
  //       }
  //       // else {
  //       //     throw new Error("Invalid interest frequency. Please use 'Annually', 'Quarterly', or 'Monthly'");
  //       // }
  //       for (var i = 0; i < period; i++) {
  //         var interest = remainingBalance * interestRate;
  //         cumulativeInterest += interest;
  //         var principal = payment - interest;
  //         remainingBalance -= principal;

  //         if (paymentFrequency === "Monthly") {

  //           if (i === 0) {
  //             var currentBalance = loanAmount
  //             var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
  //           } else {
  //             var currentBalance = schedule[i - 1].remainingBalance
  //             var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
  //           }
  //           schedule.push({
  //             [periodLabel]: i + 1,
  //             interest: interest,
  //             cumulativeInterest: cumulativeInterest,
  //             principal: principal,
  //             remainingBalance: remainingBalance,
  //             payment: payment,
  //             currentBalance: currentBalance,
  //             paymentDate: paymentDate,
  //           });
  //         } else {

  //           if (i === 0) {
  //             var currentBalance = loanAmount
  //             var paymentDate = getFirstDayOfNextMonth(startDate, i + 1)
  //           } else {
  //             var currentBalance = schedule[i - 1].remainingBalance
  //             var paymentDate = getFirstDayOfPlusThreeMonth(schedule[i - 1].paymentDate)
  //           }
  //           schedule.push({
  //             [periodLabel]: i + 1,
  //             interest: interest,
  //             cumulativeInterest: cumulativeInterest,
  //             principal: principal,
  //             remainingBalance: remainingBalance,
  //             payment: payment,
  //             currentBalance: currentBalance,
  //             paymentDate: paymentDate,
  //           });
  //         }
  //       }
  //       return schedule;


  //     }

  //     let schedule = amortizationSchedule(
  //       amortizationData.current_balance,
  //       amortizationData.interest / 100,
  //       getNoOfMonths(maturityDate),
  //       amortizationData.interest_frequency,
  //       amortizationData.payment_frequency,
  //       new Date()
  //     );

  //   } else if (maturityDate === null && amortizationData.budgeted_payment !== null) {
  //     function amortizationSchedule(
  //       loanAmount,
  //       annualInterestRate,
  //       monthlyPayment,
  //       interestFrequency,
  //       paymentFrequency,
  //       createdAt
  //     ) {

  //       var interestRate;
  //       var payment = monthlyPayment;
  //       var remainingBalance = loanAmount;
  //       var cumulativeInterest = 0;
  //       var schedule = [];
  //       var period;
  //       var periodLabel;
  //       var startDate = createdAt


  //       if (interestFrequency === "Monthly" && paymentFrequency === "Monthly") {
  //         interestRate = annualInterestRate / 12;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Quarterly" &&
  //         paymentFrequency === "Monthly"
  //       ) {
  //         let q = 12;
  //         let r = annualInterestRate;
  //         let m = 4;
  //         let rdm = r / m;
  //         let qi = q * (Math.pow(1 + rdm, m / q) - 1);

  //         interestRate = qi / 12;
  //         periodLabel = "paymentCount";
  //       } else if (
  //         interestFrequency === "Annually" &&
  //         paymentFrequency === "Monthly"
  //       ) {
  //         let q = 12;
  //         let r = annualInterestRate;
  //         let m = 1;
  //         let rdm = r / m;
  //         let qi = q * (Math.pow(1 + rdm, m / q) - 1);

  //         interestRate = qi / 12;
  //         periodLabel = "paymentCount";
  //       }

  //       let latestEndingBalance = 1;
  //       for (var i = 0; latestEndingBalance > 0; i++) {
  //         var interest = remainingBalance * interestRate;
  //         cumulativeInterest += interest;
  //         var principal = payment - interest;
  //         remainingBalance -= principal;
  //         var currentBalance = i === 0 ? remainingBalance : schedule[i - 1].remainingBalance;
  //         var paymentDate;
  //         if (currentBalance < payment) {
  //           principal = currentBalance;
  //           interest = currentBalance * interestRate;
  //           payment = principal + interest;
  //           cumulativeInterest = schedule[i - 1].cumulativeInterest + interest;
  //           remainingBalance = 0;

  //           schedule.push({
  //             [periodLabel]: i + 1,
  //             interest: interest,
  //             cumulativeInterest: cumulativeInterest,
  //             principal: principal,
  //             remainingBalance: remainingBalance,
  //             payment: payment,
  //             currentBalance: currentBalance,
  //             paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
  //           });

  //           latestEndingBalance = remainingBalance;

  //         } else {
  //           schedule.push({
  //             [periodLabel]: i + 1,
  //             interest: interest,
  //             //cumulativeInterest: cumulativeInterest,
  //             principal: principal,
  //             remainingBalance: remainingBalance,
  //             payment: payment,
  //             currentBalance: currentBalance,
  //             paymentDate: getFirstDayOfNextMonth(startDate, i + 1),
  //           });

  //           latestEndingBalance = remainingBalance;
  //         }
  //       }
  //       return schedule;
  //     }

  //     let schedule = amortizationSchedule(
  //       amortizationData.current_balance,
  //       amortizationData.interest / 100,
  //       amortizationData.budgeted_payment,
  //       amortizationData.interest_frequency,
  //       amortizationData.payment_frequency,
  //       new Date()
  //     );


  //   } else {
  //     console.log("Choose only one")
  //   }

  // }


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

  return (
    <div className="container-page justify-center bg-gradient-to-b from-slate-50 to-slate-300 p-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="grid container grid-cols-1 lg:grid-cols-2 gap-6 p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-center shadow-md sm:rounded-lg">
          <div className="grid gap-3  border p-5 rounded-lg">
            <div className="grid w-full gap-3 md:grid-cols-2">
              <div className="relative z-0 w-full group">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none" placeholder=" " required />
              </div>

              <div className="relative z-0 w-full mb-6 group">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none">
                  <option hidden>Choose a category</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Credit Card Loan">Credit Card Loan</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Other Loan">Other Loan</option>
                </select>
              </div>


              <div className="grid w-full gap-3 md:grid-cols-2">
                <div className="relative z-0 w-full mb-6 group">
                  <label htmlFor="current_balance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Balance:</label>
                  <CurrencyInput
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    id="current_balance"
                    decimalsLimit={2}
                    prefix="$"
                    defaultValue={null}
                    value={current_balance}
                    required
                    onValueChange={(value) => setBeginningBalance(value)}
                  />
                </div>

                <div className="relative z-0 w-full mb-6 group">
                  <label htmlFor="interest" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interest Rate:</label>
                  <CurrencyInput
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    id="interest"
                    decimalsLimit={2}
                    suffix="%"
                    value={interest}
                    disableGroupSeparators={true}
                    required
                    onValueChange={(value) => setInterest(value)}
                  />
                </div>
              </div>


              <div className="relative z-0 w-full mb-6 group">
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Compound Frequency:</div>
                <div className="grid w-full gap-2 md:grid-cols-3 p-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                  <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <RadioButton
                      id="Monthly"
                      value="Monthly"
                      name="interest_radio"
                      checked={interest_frequency === 'Monthly'}
                      onChange={(e) => setInterestFrequency(e.target.value)}
                      label="Monthly"
                    />
                  </ul>
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <RadioButton
                      id="Quarterly"
                      value="Quarterly"
                      name="interest_radio"
                      checked={interest_frequency === 'Quarterly'}
                      label="Quarterly"
                      onChange={(e) => setInterestFrequency(e.target.value)}
                    />
                  </ul>
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <RadioButton
                      id="Annually"
                      value="Annually"
                      name="interest_radio"
                      checked={interest_frequency === 'Annually'}
                      label="Annually"
                      onChange={(e) => setInterestFrequency(e.target.value)}
                    />
                  </ul>
                </div>
              </div>

              <div className="relative z-0 w-full mb-6 group">
                <div className=" mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose one:</div>
                <div className="grid w-full mr-10 items-center mb-2 pl-5">
                  {/* <div className=" mb-2 text-sm font-medium text-gray-900 dark:text-white"> - Maturity Date:</div> */}

                  <DatePickerTw
                    primaryColor={"amber"}
                    useRange={false}
                    asSingle={true}
                    minDate={new Date()}
                    value={mat_date}
                    id="maturity_date"
                    onChange={(date) => {
                      if (date) {
                        setMatDate(date);
                      }
                    }}
                  />


                </div>

                <div className="grid w-full mr-10 items-center pl-5">
                  {/* <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> - Budgeted Monthly Payment:</div> */}
                  <CurrencyInput
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                    id="budgeted_payment"
                    decimalsLimit={2}
                    prefix="$"
                    value={budgeted_payment}
                    placeholder="Budgeted Monthly Payment"
                    onValueChange={(value) => setBudgetedPayment(value)}

                  />
                </div>

              </div>

              <div className="relative z-0 w-full mb-6 group">
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Frequency:</div>
                <div className="grid w-full gap-2 md:grid-cols-2 p-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <RadioButton
                      value="Monthly"
                      label="Monthly"
                      name="payment_frequency"
                      id="payment_monthly"
                      checked={payment_frequency === 'Monthly'}
                      onChange={(e) => setPaymentFrequency(e.target.value)}
                    />
                  </ul>
                  <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <RadioButton
                      value="Quarterly"
                      label="Quarterly"
                      name="payment_frequency"
                      id="payment_quarterly"
                      checked={payment_frequency === 'Quarterly'}
                      onChange={(e) => setPaymentFrequency(e.target.value)}
                    />
                  </ul>
                </div>
              </div>


              <button onClick={handleSubmit} className="col-span-2 add_debt_button w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create Schedule</button>

              {formError && <p className="error">{formError}</p>}

            </div>
          </div>
        </div>

        <div className="p-6 shadow-md sm:rounded-lg">
          {amortizationData && (
            <div className="bg-slate-50 sm:rounded-lg mb-5 grid grid-cols-3 gap 3 border-b-2">
              <div className="text-sm text-gray-900">
                <div>Title: <span className="font-semibold">{amortizationData.title}</span></div>
                <div>Category: <span className="font-semibold">{amortizationData.category}</span></div>
                <div>Current Balance: <span className="font-semibold">${amortizationData.current_balance}</span></div>
              </div>
              <div className="text-sm text-gray-900">
                <div>Interest: <span className="font-semibold">{amortizationData.interest}%</span></div>
                <div>Compound Freq: <span className="font-semibold">{amortizationData.interest_frequency}</span></div>
                <div>Interest Freq: <span className="font-semibold">{amortizationData.payment_frequency}</span></div>
              </div>
              <div className="text-sm text-gray-900">
                <div>Maturity Date.: <span className="font-semibold">{amortizationData.mat_date.startDate}</span></div>
                <div>Budgeted Mo. Payment: <span className="font-semibold">{amortizationData.budgeted_payment && amortizationData.budgeted_payment}</span></div>
              </div>

              {/* <p>
                Title: {amortizationData.title}, Category: {amortizationData.category}, Current Balance: {amortizationData.current_balance}
              </p> */}
            </div>
          )}
          {finalArray && (
            <>
              <div className="grid grid-cols-2 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700 min-h-[200px]">
                <div>
                  <PaymentPerMonth object={finalArray} />
                </div>

                <div>
                  <PieChartInterestPrincipal object={totalInterestPrincipal} />
                  <PieChartLegend object={totalInterestPrincipal} />
                </div>

              </div>

            </>
          )}
        </div>

        <div className="flex col-span-2 justify-center shadow-md sm:rounded-lg">
          {amortizationSchedule && (
            <div className="">
              <h2 className="pb-5 text-xl font-medium text-gray-500">Debt Amortization Schedule</h2>
              <table className="debts w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3"></th>
                    <th scope="col" className="px-6 py-3">Payment Date</th>
                    <th scope="col" className="px-6 py-3">Current Balance</th>
                    <th scope="col" className="px-6 py-3">Monthly Payment</th>
                    <th scope="col" className="px-6 py-3">Principal</th>
                    <th scope="col" className="px-6 py-3">Interest</th>
                    <th scope="col" className="px-6 py-3">Ending Balance</th>
                    <th scope="col" className="px-6 py-3">Cumulative Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.length < 1 ? (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td colSpan={7}>NO Data yet!</td>
                    </tr>
                  ) : (
                    amortizationSchedule.map((info, ind) => {
                      return (
                        <tr className="odd:bg-white even:bg-slate-50 border-b dark:bg-gray-800 dark:border-gray-700" key={ind}>
                          <td className="px-6 py-4">{ind + 1}</td>
                          <td className="px-6 py-4">{info.paymentDate}</td>
                          <td className="px-6 py-4">{numberFormat(info.currentBalance)}</td>
                          <td className="px-6 py-4">{numberFormat(info.payment)}</td>
                          <td className="px-6 py-4">{numberFormat(info.principal)}</td>
                          <td className="px-6 py-4">{numberFormat(info.interest)}</td>
                          <td className="px-6 py-4">{numberFormat(info.remainingBalance)}</td>
                          <td className="px-6 py-4">{numberFormat(info.cumulativeInterest)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>

  )
}

export default MainPage