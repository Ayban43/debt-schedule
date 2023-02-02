import supabase from '../config/supabaseClient'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RadioButton from '../components/RadioButton'

import CurrencyInput from 'react-currency-input-field';
import RadioInputs from '../components/RadioInputs'

// import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useContext } from 'react';
import { SupabaseContext } from '..';
import 'flowbite-datepicker';
import { useEffect } from 'react';
import DatePickerTw from '../components/DatePickerTw';


const CreateDebt = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [current_balance, setBeginningBalance] = useState(null)
  const [category, setCategory] = useState('')
  const [interest, setInterest] = useState('')
  const [interest_frequency, setInterestFrequency] = useState('')
  const [budgeted_payment, setBudgetedPayment] = useState(null)
  // const [maturity_date, setMaturityDate] = useState({
  //   startDate: null,
  //   endDate: null
  // })
  const [maturity_date, setMaturityDate] = useState({})
  const [payment_frequency, setPaymentFrequency] = useState('')
  const [mat_date ,setMatDate] = useState({})
  // const [minimum_payment, setMinimumPayment] = useState(null)

  const [formError, setFormError] = useState(null)

  const queryResults = useContext(SupabaseContext)

  const profile_id = queryResults.id

  // const handleValueChange = (value) => {
  //   setMaturityDate(value);
  //   setMatDate(value.startDate)
  //   console.log(maturity_date,' - ',mat_date)
  // };

  useEffect(() => {
    if (mat_date) {
      setMatDate(mat_date);
      setMaturityDate(mat_date.startDate);
    }
  }, [mat_date]);

  

  const handleSubmit = async (e) => {
    e.preventDefault()

    // if (!title || !current_balance) {
    //   setFormError('Please fill in all the fields correctly.')
    //   return
    // }



    const { data, error, status } = await supabase
      .from('debts')
      .insert([{ title, current_balance, category, interest, interest_frequency, maturity_date, budgeted_payment, payment_frequency, profile_id }]).single()

    if (status == 201) {
      console.log(data)
      setFormError(null)
      navigate('/debt')
    } else {
      console.log(error)
      console.log(budgeted_payment)
      setFormError('Please fill in all the fields correctly.')
    }
  }

  console.log(maturity_date,' - ',mat_date)


  return (
    <div className="container-page bg-gradient-to-b from-gray-100 to-gray-300 grid grid-cols-1 justify-items-center shrink-0 pt-5 pb-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          {"Input debt information"}
        </div>
        <form onSubmit={handleSubmit}>

          <div className="grid gap-3 mb-6 border p-5 rounded-lg">
            <div className="grid w-full gap-3 md:grid-cols-2">
              <div className="relative z-0 w-full mb-6 group">
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

            <div className="relative z-0 w-full mb-6 group">
              <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose one:</div>
              <div className="grid w-full gap-3 md:grid-cols-2 mr-10 items-center mb-2 pl-5">
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> - Maturity Date:</div>

                <DatePickerTw
                  useRange={false}
                  asSingle={true}
                  value={mat_date}
                  id="maturity_date"
                  onChange={(date) => {
                    if (date) {
                      setMatDate(date);
                    }
                  }}
                />


              </div>

              <div className="grid w-full gap-3 md:grid-cols-2 mr-10 items-center pl-5">
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> - Budgeted Monthly Payment:</div>
                <CurrencyInput
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
                  id="budgeted_payment"
                  decimalsLimit={2}
                  prefix="$"
                  value={budgeted_payment}
                  onValueChange={(value) => setBudgetedPayment(value)}
                  
                />
              </div>

              {/* <DatePickerFlow /> */}

            </div>
            <hr></hr>
            <div className="relative z-0 w-full mb-6 group">
              <button className="add_debt_button w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Create</button>
            </div>



            {formError && <p className="error">{formError}</p>}

          </div>

        </form>

      </div>
    </div >
  )


}

export default CreateDebt