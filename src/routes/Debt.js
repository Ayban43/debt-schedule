import supabase from '../config/supabaseClient'
import { useEffect, useState, useContext, useRef } from 'react'
import '../components/Table.css'
import ButtonLink from '../components/ButtonLink'
import { Link } from 'react-router-dom'
import { VscTable } from "react-icons/vsc";
import { RiDeleteBin2Line } from "react-icons/ri";
import LoadingSpinner from '../components/LoadingSpinner'
import { SupabaseContext } from '..'
import NotLoggedInPage from './NotLoggedInPage'
import ExportExcel from '../components/ExportExcel'
import * as htmlToImage from 'html-to-image';
import NoData from '../components/NoData'


const Debt = () => {
    const queryResults = useContext(SupabaseContext)
    const profile_id = queryResults.id

    const domEl = useRef(null);

    const downloadImage = async () => {

        const filter = (node: HTMLElement) => {
            const exclusionClasses = ['remove-me', 'secret-div'];
            return !exclusionClasses.some((classname) => node.classList?.contains(classname));
        }

        const dataUrl = await htmlToImage.toPng(domEl.current, { quality: 1, filter: filter });

        // download image
        const link = document.createElement('a');
        // link.download = category + '(' + title + ')' + '.png';
        link.download = 'Debts.png';
        link.href = dataUrl;
        link.click();
    };

    const [debts, setDebts] = useState([]);
    // const [fetchError, setFetchError] = useState(null)
    const [state, setState] = useState({ status: 'loading' });
    const [showModal, setShowModal] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);

    function handleDeleteClick(event) {
        const rowId = event.target.dataset.rowId;
        setRowIdToDelete(rowId);
        setShowModal(true);
    }

    function handleConfirmDelete() {
        if (rowIdToDelete) {
            supabase
                .from('debts')
                .delete()
                .eq('id', rowIdToDelete)
                .then(response => {
                    // Handle success
                    console.log('Row deleted successfully:', response);
                    document.querySelector(`[data-row-id="${rowIdToDelete}"]`).closest('tr').remove();
                })
                .catch(error => {
                    // Handle error
                    console.error('Error deleting row:', error);
                })
                .finally(() => {
                    setShowModal(false);
                });
        }
    }

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
                // setFetchError('Could not fetch data')
                setDebts(null)
                console.log(error)
            }
            if (data) {
                setDebts(data);
                // setFetchError(null)
            }
        }
        fetchDebts()
    }, [profile_id])

    if (state.status === 'loading') {
        return <LoadingSpinner />
    }

    if (profile_id === undefined || profile_id === null) {
        return <NotLoggedInPage />
    }

    const wscols = [
        { wch: 15 },
        { wch: 13 },
        { wch: 10 },
        { wch: 18 },
        { wch: 11 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
    ];

    return (
        <div className="container-page grid justify-center bg-gradient-to-b from-slate-50 to-slate-300 p-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className="grid p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="page debt max-w-7xl">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                        {showModal && (
                            // <div className="fixed inset-0 z-50 flex items-center justify-center">
                            //     <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            //     <div className="bg-white rounded-lg shadow-lg p-8">
                            //         <h2 className="text-lg font-medium mb-4">Are you sure?</h2>
                            //         <div className="flex justify-end">
                            //             <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmDelete}>Delete</button>
                            //             <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                            //         </div>
                            //     </div>
                            // </div>
                            <div id="confirm-modal" tabIndex="-1" className="fixed z-100 p-4 -inset-x-10 flex items-center justify-center">
                                <div className="relative w-full h-full max-w-md md:h-auto">
                                    <div className="relative bg-slate-100 rounded-lg shadow-xl dark:bg-gray-700">
                                        <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                                            <svg onClick={() => setShowModal(false)} aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                        <div className="p-6 text-center">
                                            <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this debt?</h3>
                                            <button onClick={handleConfirmDelete} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                                Yes, I'm sure
                                            </button>
                                            <button onClick={() => setShowModal(false)} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <ButtonLink />
                            <div className="flex p-2 gap-1 secret-div">
                                <svg className="hover:cursor-pointer hover:w-[42px] hover:h-[42px]" onClick={downloadImage} width="40px" height="40px" viewBox="-6.4 -6.4 76.80 76.80" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" strokeWidth="0.00064"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fillRule="evenodd" clipRule="evenodd"> <path d="M5.125.042c-2.801 0-5.072 2.273-5.072 5.074v53.841c0 2.803 2.271 5.073 5.072 5.073h45.775c2.801 0 5.074-2.271 5.074-5.073v-38.604l-18.904-20.311h-31.945z" fill="#49C9A7"></path> <path d="M55.977 20.352v1h-12.799s-6.312-1.26-6.129-6.707c0 0 .208 5.707 6.004 5.707h12.924z" fill="#37BB91"></path> <path d="M37.074 0v14.561c0 1.656 1.104 5.791 6.104 5.791h12.799l-18.903-20.352z" opacity=".5" fill="#ffffff"></path> </g> <path d="M10.119 53.739v-20.904h20.906v20.904h-20.906zm18.799-18.843h-16.691v12.6h16.691v-12.6zm-9.583 8.384l3.909-5.256 1.207 2.123 1.395-.434.984 5.631h-13.082l3.496-3.32 2.091 1.256zm-3.856-3.64c-.91 0-1.649-.688-1.649-1.538 0-.849.739-1.538 1.649-1.538.912 0 1.65.689 1.65 1.538 0 .85-.738 1.538-1.65 1.538z" fillRule="evenodd" clipRule="evenodd" fill="#ffffff"></path> </g></svg>
                                <ExportExcel
                                    csvData={debts}
                                    fileName={"debts"}
                                    wscols={wscols}
                                />
                            </div>
                        </div>

                        {debts.length < 1 ?

                            <div className="mt-5">
                                <NoData />
                            </div>
                            :
                            <div>
                                <table id="domEl" ref={domEl} className="debts w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                                            <th scope="col" className="px-6 py-3 secret-div text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {debts.map((info, ind) => {
                                            return (
                                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={ind}>
                                                    <td className="px-6 py-4">{ind + 1}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{info.title}</td>
                                                    <td className="px-6 py-4">{numberFormat(info.current_balance)}</td>
                                                    <td className="px-6 py-4">{info.interest}%</td>
                                                    <td className="px-6 py-4">{info.interest_frequency}</td>
                                                    <td className="px-6 py-4">{info.maturity_date}</td>
                                                    <td className="px-6 py-4">{numberFormat(info.budgeted_payment)}</td>
                                                    <td className="px-6 py-4">{info.payment_frequency}</td>
                                                    <td className="px-6 py-4 secret-div grid grid-cols-2">
                                                        <Link to={"../debt/" + info.id}>
                                                            {/* <VscTable /> */}
                                                            <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</span>
                                                        </Link>
                                                        <div>
                                                            {/* <RiDeleteBin2Line />
                                                         */}
                                                            {/* <span onClick={event => deleteRow(event)} data-row-id={info.id} className="hover:cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</span> */}
                                                            <span onClick={handleDeleteClick} data-row-id={info.id} className="hover:cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline">Remove</span>

                                                        </div>


                                                    </td>
                                                </tr>
                                            )
                                        })

                                        }

                                    </tbody>
                                </table>
                            </div>

                        }


                    </div>
                </div>
            </div>
        </div>
    );





}

export default Debt

