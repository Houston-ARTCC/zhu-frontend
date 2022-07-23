import React, { useEffect, useState } from 'react'
import { Button, Collapse, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import logoLight from '../img/logo-light.png'
import logoColor from '../img/logo.png'
import { getCID, getFullName, isAuthenticated, isMember, isStaff } from '../helpers/auth'

export default function Navigation() {
    const [scroll, setScroll] = useState(false)
    const [mobileNav, setMobileNav] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState('')
    const location = useLocation()

    useEffect(() => window.addEventListener('scroll', () => setScroll(window.scrollY > 50)), [])
    useEffect(() => window.addEventListener('resize', () => {
        setMobileNav(false)
        document.documentElement.classList.remove('no-scroll')
    }), [])
    useEffect(() => {
        setMobileNav(false)
        document.documentElement.classList.remove('no-scroll')
    }, [location])

    return (
        <Navbar id="navbar" className={scroll ? 'navbar-shrink' : ''} expand="xl">
            <Link to="/">
                <Navbar.Brand>
                    <img src={scroll || mobileNav ? logoColor : logoLight} alt="Logo"/>
                    <h6 className={(scroll || mobileNav ? 'text-black' : 'text-white') + ' font-w700 m-0'}>Houston ARTCC</h6>
                </Navbar.Brand>
            </Link>
            <Navbar.Collapse>
                <Nav className={scroll ? 'text-black' : 'text-white'}>
                    <Nav.Link as={Link} to="/calendar" className={scroll ? 'text-black' : 'text-white'}>Calendar</Nav.Link>
                    <NavDropdown className={scroll ? 'text-black' : 'text-white'} title="Events" id="nav-dropdown-events">
                        <NavDropdown.Item as={Link} to="/events">Events</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/events/support">Request Support</NavDropdown.Item>
                        {isMember() && <NavDropdown.Item as={Link} to="/events/scores">Event Scores</NavDropdown.Item>}
                        {isStaff() &&
                            <>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item as={Link} to="/events/new">New Event</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/events/presets">Position Presets</NavDropdown.Item>
                            </>
                        }
                    </NavDropdown>
                    <NavDropdown className={scroll ? 'text-black' : 'text-white'} title="Pilots" id="nav-dropdown-pilots">
                        <NavDropdown.Item as={Link} to="/feedback">Leave Feedback</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/map">ARTCC Map</NavDropdown.Item>
                        <NavDropdown.Item href="https://flightaware.com/statistics/ifr-route/" target="_blank" rel="noreferrer">Routes</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown className={scroll ? 'text-black' : 'text-white'} title="Controllers" id="nav-dropdown-controllers">
                        <NavDropdown.Item as={Link} to="/roster">Roster</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/staff">Staff</NavDropdown.Item>
                        <NavDropdown.Item href="https://vzhuids.net" target="_blank" rel="noreferrer">IDS</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/resources">Resources</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/statistics">Statistics</NavDropdown.Item>
                    </NavDropdown>
                    {isAuthenticated()
                        ?<NavDropdown className={scroll ? 'text-black' : 'text-white'} title={getFullName()} id="nav-dropdown-user">
                            {isMember()
                                ? <>
                                    <NavDropdown.Item as={Link} to={'/roster/' + getCID()}>My Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/training">Training Center</NavDropdown.Item>
                                </>
                                : <NavDropdown.Item as={Link} to="/visit">Visit Houston</NavDropdown.Item>
                            }
                            <NavDropdown.Divider/>
                            {isStaff() &&
                                <NavDropdown.Item as={Link} to="/admin">Administration</NavDropdown.Item>
                            }
                            <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item as={Link} to="/logout">Log Out</NavDropdown.Item>
                        </NavDropdown>
                        : <Nav.Item as={Link} to={{ pathname: '/login', state: { from: location }}} className="ml-4">
                            <Button variant="vatsim">
                                <span className="font-w700">Login with VATSIM</span>
                            </Button>
                        </Nav.Item>
                    }
                </Nav>
            </Navbar.Collapse>
            <button className="navbar-toggle" onClick={() => {
                mobileNav
                    ? document.documentElement.classList.remove('no-scroll')
                    : document.documentElement.classList.add('no-scroll')
                setMobileNav(!mobileNav)
            }}>
                <div className={'hamburger' + (mobileNav ? ' active' : '')}>
                    <span/>
                    <span/>
                    <span/>
                </div>
            </button>
            <div className={'mobile-nav-container' + (mobileNav ? ' active' : '')}>
                <div className={'mobile-nav' + (mobileNav ? ' active' : '')}>
                    <h6><Link className="text-darkblue font-w700" to="/calendar">Calendar</Link></h6>
                    {isMember()
                        ? <>
                            <h6 className="text-darkblue font-w700 mt-4" onClick={() => setActiveDropdown(activeDropdown === 'events' ? '' : 'events')}>Events</h6>
                            <Collapse in={activeDropdown === 'events'}>
                                <div>
                                    <h6><Link className="text-gray" to="/events">Events</Link></h6>
                                    <h6><Link className="text-gray" to="/events/scores">Event Scores</Link></h6>
                                    {isStaff() &&
                                        <>
                                            <h6><Link className="text-gray" to="/events/new">New Event</Link></h6>
                                            <h6><Link className="text-gray" to="/events/presets">Position Presets</Link></h6>
                                        </>
                                    }
                                </div>
                            </Collapse>
                        </>
                        : <h6 className="mt-4"><Link className="text-darkblue font-w700" to="/events">Events</Link></h6>
                    }
                    <h6 className="text-darkblue font-w700 mt-4" onClick={() => setActiveDropdown(activeDropdown === 'pilots' ? '' : 'pilots')}>Pilots</h6>
                    <Collapse in={activeDropdown === 'pilots'}>
                        <div>
                            <h6><Link className="text-gray" to="/feedback">Leave Feedback</Link></h6>
                            <h6><Link className="text-gray" to="/map">ARTCC Map</Link></h6>
                            <h6><a className="text-gray" href="https://flightaware.com/statistics/ifr-route/" target="_blank" rel="noreferrer">Routes</a></h6>
                        </div>
                    </Collapse>
                    <h6 className="text-darkblue font-w700 mt-4" onClick={() => setActiveDropdown(activeDropdown === 'controllers' ? '' : 'controllers')}>Controllers</h6>
                    <Collapse in={activeDropdown === 'controllers'}>
                        <div>
                            <h6><Link className="text-gray" to="/roster">Roster</Link></h6>
                            <h6><Link className="text-gray" to="/staff">Staff</Link></h6>
                            <h6><a className="text-gray" href="https://vzhuids.net" target="_blank" rel="noreferrer">IDS</a></h6>
                            <h6><Link className="text-gray" to="/resources">Resources</Link></h6>
                            <h6><Link className="text-gray" to="/statistics">Statistics</Link></h6>
                        </div>
                    </Collapse>
                    {isAuthenticated()
                        ? <>
                            <h6 className="text-darkblue font-w700 mt-4">{getFullName()}</h6>
                            {isMember()
                                ? <>
                                    <h6><Link className="text-gray" to={'/roster/' + getCID()}>My Profile</Link></h6>
                                    <h6><Link className="text-gray" to="/training">Training Center</Link></h6>
                                </>
                                : <h6><Link to="/visit">Visit Houston</Link></h6>
                            }
                            {isStaff() &&
                                <h6><Link className="text-gray" to="/admin">Administration</Link></h6>
                            }
                            <h6><Link className="text-gray" to="/dashboard">Dashboard</Link></h6>
                            <h6><Link className="text-gray" to="/logout">Log Out</Link></h6>
                        </>
                        : <Link to={{ pathname: '/login', state: { from: location }}}>
                            <Button variant="vatsim" className="mt-4">
                                <span className="font-w700 font-sm">Login with VATSIM</span>
                            </Button>
                        </Link>
                    }
                </div>
                <div className="mobile-nav-padding" onClick={() => {
                    setMobileNav(false)
                    document.documentElement.classList.remove('no-scroll')
                }}/>
            </div>
        </Navbar>
    )
}
