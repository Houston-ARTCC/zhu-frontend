import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { format } from 'date-fns'
import Fade from 'react-reveal/Fade'
import axiosInstance from '../../../helpers/axiosInstance'

function secondsToDurationStr(seconds: number) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);

    return `${d} days, ${h}h ${m}m`
}

export default function AdminHome() {
    const [statistics, setStatistics] = useState({
        month: 0,
        year: 0,
    })

    useEffect(() => {
        axiosInstance
            .get('/api/connections/statistics/admin/')
            .then(({ data }) => setStatistics(data))
    })

    return (
        <Fade bottom duration={1250} distance="50px">
            <h1 className="mb-4">Statistics</h1>
            <Row>
                <Col md={12} xl={6}>
                    <Card className="flex-grow-1">
                        <Card.Body>
                            <h4>{format(new Date(), 'MMMM')} Total</h4>
                            <h2>{secondsToDurationStr(statistics.month)}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} xl={6}>
                    <Card className="flex-grow-1">
                        <Card.Body>
                            <h4>{format(new Date(), 'yyyy')} Total</h4>
                            <h2>{secondsToDurationStr(statistics.year)}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fade>
    )
}
