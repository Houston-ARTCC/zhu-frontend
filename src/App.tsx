import React, { useEffect, useState } from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import { Button, Nav, Navbar, NavbarBrand } from 'react-bootstrap'
import logoLight from './img/logo-light.png'
import logoColor from './img/logo.png'
import Footer from './Components/Footer'
import RouterSwitch from './Components/RouterSwitch'
import { getFullName, parseJWT } from './Helpers'

export default function App() {
    const [scroll, setScroll] = useState(false);

    useEffect(() => window.addEventListener('scroll', () => setScroll(window.scrollY > 50)), [])

    return (
        <BrowserRouter>
            <Navbar id="navbar" className={scroll ? 'navbar-shrink' : ''}>
                <NavbarBrand>
                    <img src={scroll ? logoColor : logoLight} alt="Logo"/>
                    <h6 className={(scroll ? 'text-black' : 'text-white') + ' font-w700 m-0'}>Houston ARTCC</h6>
                </NavbarBrand>
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
            <RouterSwitch/>
            <Footer/>
        </BrowserRouter>
    );
}

