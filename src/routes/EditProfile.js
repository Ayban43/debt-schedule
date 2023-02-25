import React, { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'

const EditProfile = () => {
    const [formError, setFormError] = useState(null)
    const [companyName, setCompanyName] = useState(null)
    const [data, setData] = useState(null);
    const [userEmail, setUserEmail] = useState(null)
    const [inputValue, setInputValue] = useState(data?.company_name || '');
    const [showSuccess, setShowSuccess] = useState(false)


    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value => {
                if (value.data?.user) {
                    setUserEmail(value.data.user.email)
                } else {
                }
            }))
        }
        getUserData();
    }, [])




    useEffect(() => {

        async function fetchData() {
            if (userEmail) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('company_name')
                    .eq('email', userEmail);
                if (error) console.log('Error fetching data:', error);
                else
                    setInputValue(data[0].company_name)
            }
        }
        fetchData();
    }, [userEmail]);

    console.log("hello", inputValue);

    async function handleUpdate() {
        if (userEmail) {
            const { error } = await supabase
                .from('profiles')
                .update({ "company_name": inputValue })
                .eq('email', userEmail);
            if (error) console.log('Error updating data:', error);
            else
                setShowSuccess(true)
        }
    }

    const handleClose = () => {
        setShowSuccess(false);
    };

    return (
        <div className="container-page bg-gradient-to-b from-slate-50 to-slate-300 grid grid-cols-1 justify-items-center shrink-0 pt-5 pb-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className="w-[1000px] p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    {"Edit Profile"}
                    <div className="relative z-0 w-full mb-6 group mt-5">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name:</label>
                        <input type="text" id="title" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none" placeholder=" " required />
                    </div>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleUpdate}>Update</button>
                </div>

                {showSuccess &&
                    <div id="toast-success" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Check icon</span>
                        </div>
                        <div className="ml-3 text-sm font-normal">Item moved successfully.</div>
                        <button onClick={handleClose} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
                            <span className="sr-only" >Close</span>
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default EditProfile