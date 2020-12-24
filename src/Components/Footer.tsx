import React from 'react'

export default function Footer() {
    return (
        <div className="bg-dark-gray text-center p-5">
            <h5 className="text-white font-w300 mb-3"><b className="font-w500">Copyright 2020</b> Virtual Houston ARTCC. All Rights Reserved.</h5>
            <div className="d-flex justify-content-center" id="footer-links">
                <h6 className="text-light-gray font-w300">VATSIM</h6>
                <h6 className="text-light-gray font-w300">→</h6>
                <h6 className="text-light-gray font-w300">VATUSA</h6>
                <h6 className="text-light-gray font-w300">→</h6>
                <h6 className="text-light-gray font-w300">Privacy Policy</h6>
                <h6 className="text-light-gray font-w300">→</h6>
                <h6 className="text-light-gray font-w300">Feedback</h6>
                <h6 className="text-light-gray font-w300">→</h6>
                <h6 className="text-light-gray font-w300">Discord</h6>
                <h6 className="text-light-gray font-w300">→</h6>
                <h6 className="text-light-gray font-w300">GitHub</h6>
            </div>
        </div>
    )
}
