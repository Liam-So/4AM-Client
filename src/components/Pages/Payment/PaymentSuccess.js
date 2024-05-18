import React from 'react'
import Topbar from "../../Topbar/Topbar";
import Check from '../../../images/success.png';

function PaymentSuccess() {
    return (
        <div>
            <Topbar transparent={true} />
            <div className="flex items-center w-full justify-center" style={{height: '71vh'}}>
            <div className="max-w-xs">
                <div className="bg-white shadow-xl rounded-lg py-3">
                    <div className="photo-wrapper p-2">
                        <img className="w-32 h-32 rounded-full mx-auto" src={Check} alt="check"/>
                    </div>
                    <div className="p-2">
                        <h3 className="text-center text-xl text-gray-900 font-medium leading-8 ">You are registered!</h3>
                        <div className="text-center text-gray-400 text-s font-semibold">
                            <p>You should receive a confirmation email shortly. Looking forward to seeing you at the 4AM Camp!</p>
                        </div>

                        <div className="pt-12 text-center text-gray-400 text-s font-semibold">
                            <p>Be sure to check out our social media accounts for future updates.</p>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
        </div>
    )
}

export default PaymentSuccess
