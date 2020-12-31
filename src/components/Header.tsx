import React from 'react'

export default function Header({title, subtitle = ''}) {
    return (
        <div className="bg-darkblue header">
            <h1 className="text-white">{title}</h1>
            <h3 className="text-white font-w300">{subtitle}</h3>
        </div>
    )
}
