import supabase from '../config/supabaseClient'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RadioButton from '../components/RadioButton'

import CurrencyInput from 'react-currency-input-field';
import RadioInputs from '../components/RadioInputs'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import moment from 'moment'

const CreateDebt = () => {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [beginning_balance, setBeginningBalance] = useState(null)
  const [category, setCategory] = useState('')
  const [interest, setInterest] = useState('')
  const [interest_frequency, setInterestFrequency] = useState('')
  const [budgeted_payment, setBudgetedPayment] = useState(null)
  const [maturity_date, setMaturityDate] = useState(null)
  const [payment_frequency, setPaymentFrequency] = useState('')
  const [minimum_payment, setMinimumPayment] = useState(null)

  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // if (!description || !beginning_balance) {
    //   setFormError('Please fill in all the fields correctly.')
    //   return
    // }



    const { data, error, status } = await supabase
      .from('debts')
      .insert([{ description, beginning_balance, category, interest, interest_frequency,maturity_date,budgeted_payment,payment_frequency,minimum_payment }]).single()

    if (status == 201) {
      console.log(data)
      setFormError(null)
      navigate('/debt-schedule/debt')
    } else {
      console.log(error)
      console.log(budgeted_payment)
      setFormError('Please fill in all the fields correctly.')
    }
  }

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>


        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="payment_frequency-label">Category: </div>
        <select className="custom-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value=""></option>
          <option value="Business Loan">Business Loan</option>
          <option value="Credit Card Loan">Credit Card Loan</option>
          <option value="Mortgage">Mortgage</option>
          <option value="Personal Loan">Personal Loan</option>
          <option value="Other Loan">Other Loan</option>
        </select>




        <label htmlFor="beginning_balance">Beginning Balance:</label>
        <CurrencyInput
          id="beginning_balance"
          decimalsLimit={2}
          prefix="$"
          defaultValue={null}
          value={beginning_balance}
          required
          onValueChange={(value) => setBeginningBalance(value)}
        />

        <label htmlFor="interest">Interest:</label>
        <CurrencyInput
          id="interest"
          decimalsLimit={2}
          suffix="%"
          value={interest}
          disableGroupSeparators={true}
          maxLength={4}
          required
          onValueChange={(value) => setInterest(value)}
        />

        <div className="radio-button">
          <div className="interest_frequency-label">Interest Frequency: </div>
          <RadioButton
            value="Monthly"
            label="Monthly"
            id="Monthly"
            required
            name="interest_radio"
            checked={interest_frequency === 'Monthly'}
            onChange={(e) => setInterestFrequency(e.target.value)}
          />
          <label htmlFor="Monthly">Monthly</label>

          <RadioButton
            value="Daily"
            label="Daily"
            id="Daily"
            name="interest_radio"
            checked={interest_frequency === 'Daily'}
            onChange={(e) => setInterestFrequency(e.target.value)}
          />
          <label htmlFor="Daily">Daily</label>

          <RadioButton
            value="Quarterly"
            label="Quarterly"
            id="Quarterly"
            name="interest_radio"
            checked={interest_frequency === 'Quarterly'}
            onChange={(e) => setInterestFrequency(e.target.value)}
          />
          <label htmlFor="Quarterly">Quarterly</label>

          <RadioButton
            value="Annually"
            label="Annually"
            id="Annually"
            name="interest_radio"
            checked={interest_frequency === 'Annually'}
            onChange={(e) => setInterestFrequency(e.target.value)}
          />
          <label htmlFor="Annually">Annually</label>
        </div>

        <label htmlFor="maturity_date">Maturity Date: </label>
        <DatePicker
          selected={maturity_date}
          showYearDropdown
          showMonthDropdown
          scrollableMonthYearDropdown
          yearDropdownItemNumber={10}
          id="maturity_date"
          minDate={new Date("01-01-2022")}
          placeholderText={'Choose one between Budgeted Monthly Payment or Maturity Date'}
          onChange={date => setMaturityDate(date)}
        />

        <label htmlFor="budgeted_payment">Budgeted Monthly Payment:</label>
        <CurrencyInput
          id="budgeted_payment"
          decimalsLimit={2}
          prefix="$"
          value={budgeted_payment}
          placeholder='Choose one between Budgeted Monthly Payment or Maturity Date'
          onValueChange={(value) => setBudgetedPayment(value)}
        />

        <div className="radio-button">
          <div className="payment_frequency-label">Payment Frequency: </div>
          <RadioButton
            value="Monthly"
            label="Monthly"
            required
            name = "payment_frequency"
            id="payment_monthly"
            checked={payment_frequency === 'Monthly'}
            onChange={(e) => setPaymentFrequency(e.target.value)}
          />
          <label htmlFor="payment_monthly">Monthly</label>

          <RadioButton
            value="Quarterly"
            label="Quarterly"
            name = "payment_frequency"
            id = "payment_quarterly"
            checked={payment_frequency === 'Quarterly'}
            onChange={(e) => setPaymentFrequency(e.target.value)}
          />
          <label htmlFor="payment_quarterly">Quarterly</label>
        </div>

        <label htmlFor="minimum_payment">Minimum Monthly Payment:</label>
        <CurrencyInput
          id="minimum_payment"
          decimalsLimit={2}
          prefix="$"
          value={minimum_payment}
          placeholder='Optional'
          onValueChange={(value) => setMinimumPayment(value)}
        />

        <button className="add_debt_button">Create</button>

        {formError && <p className="error">{formError}</p>}
      </form>

    </div>
  )


}

export default CreateDebt