import { Button, Col, Container, Row } from 'react-bootstrap'
import error from '../../img/error.jpg'
import { useHistory, useLocation } from 'react-router'

export default function Error404() {
    const location = useLocation()
    const history = useHistory()

    return (
        <>
            <Container className="d-flex align-items-center" style={{ paddingTop: 125, paddingBottom: 125 }}>
                <Row>
                    <Col xs={12} md={6} className="d-flex align-items-center mb-5 mb-md-0">
                        <div className="text-center">
                            <h1 className="font-w700 text-black">Well crap,</h1>
                            <h4 className="text-darkblue mb-5 overflow-wrap">looks like <code>zhuartcc.org{location.pathname}</code> was not found...</h4>
                            <Button onClick={() => history.goBack()} variant="darkblue">Back to Safety</Button>
                        </div>
                    </Col>
                    <Col xs={12} md={6} className="mb-5 mb-md-0">
                        <img src={error} alt="Error" width="100%"/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
