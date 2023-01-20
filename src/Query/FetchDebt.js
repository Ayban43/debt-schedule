import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import supabase from "../config/supabaseClient";
import React from 'react'
import PaymentPerMonth from "../components/PaymentPerMonth";
import SelectDebt from "../components/SelectDebt";

const FetchDebt = () => {
  const [datas, setDatas] = useState('');
  const navigate = useNavigate();
  const [createdAt, setCreatedAt] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [beginningBalance, setBeginningBalance] = useState("");
  const [interest, setInterest] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("");
  const [interestFrequency, setInterestFrequncy] = useState("");
  const [description, setDescription] = useState("");

  const [amortizationData, setAmortizationData] = useState([]);
  const [selected, setSelected] = useState([]);


  const selectedId = selected.map(item => item.value)

  useEffect(() => {
    const fetchDebt = async () => {
      const { data, error } = await supabase
        .from("debts")
        .select()
         .in('id', selectedId)
      //  .not('maturity_date', 'is', null)
      //   .is('maturity_date',null)

      if (error) {
        navigate("/debt-schedule/", { replace: true });
        console.log(error);
      }
      if (data) {
        setDatas(data)
        setCreatedAt(data.created_at);
        setMaturityDate(data.maturity_date);
        setBeginningBalance(data.beginning_balance);
        setInterest(data.interest);
        setMonthlyPayment(data.budgeted_payment);
        setPaymentFrequency(data.payment_frequency);
        setInterestFrequncy(data.interest_frequency);
        setDescription(data.description);

        let amortData = data.map(debt => {
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

            return amortizationSchedule(debt.beginning_balance, debt.interest / 100, getNoOfMonths(debt.created_at, debt.maturity_date), debt.interest_frequency, debt.payment_frequency, debt.created_at);

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

            return amortizationSchedule(debt.beginning_balance, debt.interest / 100, debt.budgeted_payment, debt.interest_frequency, debt.payment_frequency, debt.created_at);

          }
        });

        setAmortizationData(amortData);
      }
    };
    fetchDebt();
  }, [navigate]);

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



  // console.log(finalArray)


  return (
    <div>
      {/* <SelectDebt selected={selected} setSelected={setSelected} /> */}
      {/* <PaymentPerMonth object={finalArray} /> */}
    </div>

  )


  // return (
  //     <ChildComponent data={data} updateData={setData} />
  // );
}

export default FetchDebt

