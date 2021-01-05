import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import logoColor from '../img/logo.png'
import logoLight from '../img/logo-light.png'
import { getFullName, parseJWT } from '../Helpers'

export default function Navigation() {
    const [scroll, setScroll] = useState(false)

    useEffect(() => window.addEventListener('scroll', () => setScroll(window.scrollY > 50)), [])

    return (
        <Navbar id="navbar" className={scroll ? 'navbar-shrink' : ''} expand="xl">
            <Link to="/">
                <Navbar.Brand>
                    <img src={scroll ? logoColor : logoLight} alt="Logo"/>
                    <h6 className={(scroll ? 'text-black' : 'text-white') + ' font-w700 m-0'}>Houston ARTCC</h6>
                </Navbar.Brand>
            </Link>
            <Navbar.Collapse>
                <Nav className={scroll ? 'text-black' : 'text-white'}>
                    <Nav.Link as={Link} to="" className={scroll ? 'text-black' : 'text-white'}>Calendar</Nav.Link>
                    <Nav.Link as={Link} to="/events" className={scroll ? 'text-black' : 'text-white'}>Events</Nav.Link>
                    <NavDropdown className={scroll ? 'text-black' : 'text-white'} title="Pilots" id="nav-dropdown-pilots">
                        <NavDropdown.Item as={Link} to="">Leave Feedback</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="">ARTCC Map</NavDropdown.Item>
                        <NavDropdown.Item href="https://simcharts.info/" target="_blank">Charts</NavDropdown.Item>
                        <NavDropdown.Item href="https://flightaware.com/statistics/ifr-route/" target="_blank">Routes</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown className={scroll ? 'text-black' : 'text-white'} title="Controllers" id="nav-dropdown-controllers">
                        <NavDropdown.Item as={Link} to="/roster">Roster</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="">Staff</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="">IDS</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="">Resources</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/statistics">Statistics</NavDropdown.Item>
                    </NavDropdown>
                    {parseJWT()
                        ?<NavDropdown className={scroll ? 'text-black' : 'text-white'} title={getFullName()} id="nav-dropdown-user">
                            <NavDropdown.Item as={Link} to="">My Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="">Training Center</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin">Administration</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/logout">Log Out</NavDropdown.Item>
                        </NavDropdown>
                        : <Nav.Item as={Link} to="/login" className="ml-4">
                            <Button variant="vatsim">
                                <span className="font-w700">Login with VATSIM</span>
                            </Button>
                        </Nav.Item>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
