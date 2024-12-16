import SignIn from '@/pages/auth/signin';
import React from 'react'

const LoginModal = ({setShowLoginModal}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1050]">
            <div className="bg-white px-8 py-4 rounded">
                <SignIn />
                <button onClick={() => setShowLoginModal(false)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    )
}

export default LoginModal;
