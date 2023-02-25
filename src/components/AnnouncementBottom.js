import React from 'react'

const AnnouncementBottom = () => {
    return (
        <div class="fixed inset-x-0 bottom-0">
            <div class="bg-indigo-600 px-4 py-3 text-white">
                <p class="text-center text-sm font-medium">
                    Need to record and track multiple debts? 
                    <a href="/login" className="ml-2 inline-block underline">
                        Click here to login
                    </a>
                </p>
            </div>
        </div>
    )
}

export default AnnouncementBottom