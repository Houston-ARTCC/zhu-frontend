import { getCID } from '../../helpers/auth'
import Header from '../../components/Header'
import { Container } from 'react-bootstrap'
import EventScoreTable from '../../components/EventScoreTable'
import Fade from 'react-reveal/Fade'
import React from 'react'

export default function EventScores() {
    return (
        <>
            <Header title="Event Scores"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <EventScoreTable cid={getCID()}/>
                </Container>
            </Fade>
        </>
    )
}