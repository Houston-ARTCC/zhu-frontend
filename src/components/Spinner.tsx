import React from 'react'
import './Spinner.css'

export default function Spinner({size = 60}) {
    return (
        <div className="spinner" style={{width: size, height: size}}>
            <div className="double-bounce1"/>
            <div className="double-bounce2"/>
        </div>
    )
}