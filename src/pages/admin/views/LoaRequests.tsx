import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'

export default class LoaRequests extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <Fade bottom duration={1250} distance="50px">
                <h1>Coming Soon&trade;</h1>
            </Fade>
        )
    }
}
