import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Nav, Navbar, NavbarBrand } from 'react-bootstrap'
import logoColor from '../img/logo.png'
import logoLight from '../img/logo-light.png'
import { getFullName, parseJWT } from '../Helpers'

export default function Navigation() {
    const [scroll, setScroll] = useState(false)

    useEffect(() => window.addEventListener('scroll', () => setScroll(window.scrollY > 50)), [])

    return (
        <Navbar id="navbar" className={scroll ? 'navbar-shrink' : ''}>
            <Link to="/">
                <NavbarBrand>
                    <img src={scroll ? logoColor : logoLight} alt="Logo"/>
                    <h6 className={(scroll ? 'text-black' : 'text-white') + ' font-w700 m-0'}>Houston ARTCC</h6>
                </NavbarBrand>
            </Link>
            <Nav>
                <Nav.Link className={scroll ? 'text-black' : ''}>Calendar</Nav.Link>
                <Nav.Link className={scroll ? 'text-black' : ''}>Events</Nav.Link>
                <Nav.Link className={scroll ? 'text-black' : ''}>Pilots</Nav.Link>
                <Nav.Link className={scroll ? 'text-black' : ''}>Controllers</Nav.Link>
                {parseJWT()
                    ? <Nav.Link className={scroll ? 'text-black' : ''}>{getFullName()}</Nav.Link>
                    : <Nav.Item className="ml-4">
                        <Link to="/login">
                            <Button variant="vatsim">
                                <span className="font-w700">Login with VATSIM</span>
                            </Button>
                        </Link>
                    </Nav.Item>
                }
            </Nav>
        </Navbar>
    )
}
