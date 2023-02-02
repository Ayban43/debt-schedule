import AmortizationSchedule from "../outputs/AmortizationSchedule";

const ViewDebt = () => {
  return(
    <div className = "page viewDebt container-page bg-gradient-to-b from-gray-100 to-gray-300" style={{minHeight: 'calc(100vh - 80px)'}}>
      {/* <MonthlyInterest /> */}
      {/* <QuarterlyInterest /> */}
    <AmortizationSchedule />
    {/* <BudgetedPayment /> */}
    </div>
  )
}
  

export default ViewDebt;
