import { Container } from 'react-bootstrap'
import 'tui-calendar/dist/tui-calendar.css'
import Fade from 'react-reveal/Fade'
import Header from '../components/Header'
import TuiCalendar from '../components/TuiCalendar'

export default function ARTCCCalendar() {
    return (
        <>
            <Header title="Calendar"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <TuiCalendar view="month" isReadOnly={true}/>
                </Container>
            </Fade>
        </>
    )
}
