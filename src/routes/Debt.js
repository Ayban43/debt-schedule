import supabase from '../config/supabaseClient'
import { useEffect, useState, useContext } from 'react'
import '../components/Table.css'
import ButtonLink from '../components/ButtonLink'
import { Link } from 'react-router-dom'
import { VscTable } from "react-icons/vsc";
import LoadingSpinner from '../components/LoadingSpinner'
import { SupabaseContext } from '..'
import NotLoggedInPage from './NotLoggedInPage'


const Debt = () => {
    const queryResults = useContext(SupabaseContext)
    const profile_id = queryResults.id
    console.log(profile_id)

    const [debts, setDebts] = useState([]);
    const [fetchError, setFetchError] = useState(null)
    const [state, setState] = useState({ status: 'loading' });

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);

    useEffect(() => {
        const fetchDebts = async () => {
            const { data, error } = await supabase
                .from('debts')
                .select()
                .eq('profile_id', profile_id)
                .order('id', { ascending: false })
            setState({ status: 'loaded' });
            if (error) {
                setFetchError('Could not fetch data')
                setDebts(null)
                console.log(error)
            }
            if (data) {
                setDebts(data);
                setFetchError(null)
            }
        }
        fetchDebts()
    }, [])

    if (state.status === 'loading') {
        return <LoadingSpinner />
    }

    if (profile_id === undefined || profile_id === null) {
        return <NotLoggedInPage />
    }

    return (
        <div className="container-page bg-gradient-to-b from-gray-100 to-gray-300" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className="page debt">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <ButtonLink />
                    <table className="debts w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3"></th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Current Balance</th>
                                <th scope="col" className="px-6 py-3">Interest Rate</th>
                                <th scope="col" className="px-6 py-3">Compound Frequency</th>
                                <th scope="col" className="px-6 py-3">Maturity Date</th>
                                <th scope="col" className="px-6 py-3">Budgeted Monthly Payment</th>
                                <th scope="col" className="px-6 py-3">Payment Frequency</th>
                                <th scope="col" className="px-6 py-3">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debts.length < 1 ?
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={10}>NO Data yet!</td>
                                </tr> :
                                debts.map((info, ind) => {
                                    return (

                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={ind}>
                                            <td className="px-6 py-4">{ind + 1}</td>
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{info.title}</td>
                                            <td className="px-6 py-4">{numberFormat(info.current_balance)}</td>
                                            <td className="px-6 py-4">{info.interest}%</td>
                                            <td className="px-6 py-4">{info.interest_frequency}</td>
                                            <td className="px-6 py-4">{info.maturity_date}</td>
                                            <td className="px-6 py-4">{numberFormat(info.budgeted_payment)}</td>
                                            <td className="px-6 py-4">{info.payment_frequency}</td>
                                            <td className="px-6 py-4">
                                                <Link to={"/" + info.id}>
                                                    <VscTable />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );





}

export default Debt

