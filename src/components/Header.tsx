import React, { Component } from 'react'

export default class Header extends Component<any> {
    static defaultProps = {
        title: '',
        subitlte: '',
        override: null,
    }

    render() {
        return (
            <div className="bg-darkblue header">
                {this.props.override ? this.props.override :
                    <div>
                        <h1 className="text-white">{this.props.title}</h1>
                        <h3 className="text-white font-w300">{this.props.subtitle}</h3>
                    </div>
                }
            </div>
        )
    }
}
