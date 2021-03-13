import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import 'tui-calendar/dist/tui-calendar.css'
import Fade from 'react-reveal/Fade'
import 'moment-timezone'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import TuiCalendar from '../components/TuiCalendar'

export default class ARTCCCalendar extends Component<any, any> {
    render() {
        return (
            <div>
                <Navigation/>
                <Header title="Calendar"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <TuiCalendar view="month" isReadOnly={true}/>
                    </Container>
                </Fade>
            </div>
        )
    }
}
