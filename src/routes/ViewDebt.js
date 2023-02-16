import AmortizationSchedule from "../outputs/AmortizationSchedule";

const ViewDebt = () => {

  return (
    <div className="grid justify-center container-page bg-gradient-to-b from-slate-50 to-slate-300 min-w-fit p-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <AmortizationSchedule />
    </div >

  )
}


export default ViewDebt;
