import { Alert, Col } from 'react-bootstrap'
import { RiErrorWarningLine } from 'react-icons/all'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer>
            <div className="d-flex justify-content-center mb-5">
                <Col xs={10} xl={6} className="position-unset">
                    <Alert variant="primary" className="position-unset d-flex m-0">
                        {/* TODO: Fix icon scaling on mobile devices. */}
                        <div><RiErrorWarningLine className="fill-primary mr-3" size={25}/></div>
                        <p className="m-0">
                            <b>Disclaimer!</b> All information on this website is for flight simulation use only and is not to be used for
                            real world navigation or flight. This site is not affiliated with ICAO, the FAA, the actual Houston ARTCC, or
                            any other real world aerospace entity.
                        </p>
                    </Alert>
                </Col>
            </div>
            <div className="bg-darkgray text-center p-4 p-xl-5">
                <h5 className="text-white font-w400 mb-3">&copy; 2021, Virtual Houston ARTCC. All Rights Reserved.</h5>
                <div className="d-flex flex-wrap justify-content-center" id="footer-links">
                    <a href="https://vatsim.net" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">VATSIM</h6></a>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <a href="https://vatusa.net" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">VATUSA</h6></a>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <Link to="/privacy"><h6 className="text-lightgray font-w300">Privacy Policy</h6></Link>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <Link to="/feedback"><h6 className="text-lightgray font-w300">Feedback</h6></Link>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <a href="https://discord.gg/Ag2cdZz" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">Discord</h6></a>
                    <h6 className="text-lightgray font-w300">→</h6>
                    <a href="https://github.com/Houston-ARTCC" target="_blank" rel="noreferrer"><h6 className="text-lightgray font-w300">GitHub</h6></a>
                </div>
            </div>
        </footer>
    )
}