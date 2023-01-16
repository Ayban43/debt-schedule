
const Computation = () => {
    function amortizationSchedule(loanAmount, annualInterestRate, numPayments, interestFrequency, paymentFrequency) {
        var interestRate;
        var payment;
        var remainingBalance = loanAmount;
        var cumulativeInterest = 0;
        var schedule = [];
        var period;
        var periodLabel;
        // calculate interest rate based on frequency
        if (interestFrequency === "annually" && paymentFrequency === "monthly") {
            let q = 12
            let r = annualInterestRate
            let m = 1
            let rdm = r / m
            let qi = q * (Math.pow((1 + rdm), m / q) - 1)

            interestRate = qi / 12;
            payment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
            period = numPayments;
            periodLabel = "month";
        } else if (interestFrequency === "annually" && paymentFrequency === "quarterly") {
            let q = 4
            let r = annualInterestRate
            let m = 1
            let rdm = r / m
            let qi = q * (Math.pow((1 + rdm), m / q) - 1)

            interestRate = qi / 4;
            payment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -numPayments/3)));
            period = numPayments/3;
            periodLabel = "quarter";
        } else if (interestFrequency === "quarterly" && paymentFrequency === "monthly") {
            let q = 12
            let r = annualInterestRate
            let m = 4
            let rdm = r / m
            let qi = q * (Math.pow((1 + rdm), m / q) - 1)

            interestRate = qi / 12;
            payment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
            period = numPayments;
            periodLabel = "month";
        } else if (interestFrequency === "quarterly" && paymentFrequency === "quarterly") {
            interestRate = annualInterestRate / 4;
            payment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
            period = numPayments / 3;
            periodLabel = "quarter";
        } else if (interestFrequency === "monthly" && paymentFrequency === "monthly") {
            interestRate = annualInterestRate / 12;
            payment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -numPayments)));
            period = numPayments;
            periodLabel = "month";
        } else if (interestFrequency === "monthly" && paymentFrequency === "quarterly") {
            let q = 4
            let r = annualInterestRate
            let m = 12
            let rdm = r / m
            let qi = q * (Math.pow((1 + rdm), m / q) - 1)

            interestRate = ((qi / 12) * 3)
            payment = loanAmount * (interestRate / (1 - Math.pow(1 + interestRate, -numPayments / 3)));
            period = numPayments / 3;
            periodLabel = "quarter";
        }
        else {
            throw new Error("Invalid interest frequency. Please use 'annually', 'quarterly', or 'monthly'");
        }
        for (var i = 0; i < period; i++) {
            var interest = remainingBalance * interestRate;
            cumulativeInterest += interest;
            var principal = payment - interest;
            remainingBalance -= principal;
            schedule.push({
                [periodLabel]: i + 1,
                interest: interest,
                cumulativeInterest: cumulativeInterest,
                principal: principal,
                remainingBalance: remainingBalance,
                payment: payment
            });
        }
        return schedule;
    }

    let schedule = amortizationSchedule(18000, .05, 24, "annually", "quarterly")

    console.log(schedule)

}

export default Computation