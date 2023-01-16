
const QuarterlyInterest = () => {

    
    function amortizationSchedule(loanAmount, annualInterestRate, numPayments) {
        // convert annual interest rate to monthly rate
        
        //var monthlyInterestRate = 0.004149425;

        // convert annual interest rate to monthly rate
        //q = 12 if monthly payment
        //q = 4 if quarterly payment
        //m = 4 if interest is compounding quarterly
        //r = annual interest rate
        let q = 12
        let r = annualInterestRate 
        let m = 4
        let rdm = r / m


        let qi = q * (Math.pow((1 + rdm), m / q) - 1)

        var monthlyInterestRate = qi/12
        console.log(monthlyInterestRate)


        // calculate the monthly payment
        var monthlyPayment = loanAmount * (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numPayments)));
        // create an array to store the amortization schedule
        var schedule = [];
        // initialize the remaining balance as the loan amount
        var remainingBalance = loanAmount;
        // loop through the number of payments

        var cumulativeInterest = 0;
        for (var i = 0; i < numPayments; i++) {
          // calculate the interest for the current month
          var interest = remainingBalance * monthlyInterestRate;
          cumulativeInterest += interest;
          // calculate the principal for the current month
          var principal = monthlyPayment - interest;
          // update the remaining balance
          remainingBalance -= principal;
          // add the current month's information to the schedule
          schedule.push({
            month: i + 1,
            monthlyPayment: monthlyPayment,
            interest: interest,
            principal: principal,
            remainingBalance: remainingBalance,
            cumulativeInterest: cumulativeInterest,
          });
        }
        // return the schedule
        return schedule;
      }

      let schedule = amortizationSchedule(18000,.05,24)
      
      console.log(schedule)
      

    }
export default QuarterlyInterest