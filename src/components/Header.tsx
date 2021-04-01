import React, { Component } from 'react'

export default class Header extends Component<any> {
    static defaultProps = {
        title: '',
        subitlte: '',
        override: null,
    }

    componentDidMount() {
        document.title = 'Houston ARTCC :: ' + this.props.title
    }

    componentDidUpdate() {
        document.title = 'Houston ARTCC :: ' + this.props.title
    }

    render() {
        return (
            <div className="bg-darkblue header">
                {this.props.override ? this.props.override :
                    <>
                        <div className="d-none d-md-block">
                            <h1 className="text-white">{this.props.title}</h1>
                            <h3 className="text-white font-w300">{this.props.subtitle}</h3>
                        </div>
                        <div className="d-block d-md-none text-center">
                            <h2 className="text-white">{this.props.title}</h2>
                            <h4 className="text-white font-w300">{this.props.subtitle}</h4>
                        </div>
                    </>
                }
            </div>
        )
    }
}
