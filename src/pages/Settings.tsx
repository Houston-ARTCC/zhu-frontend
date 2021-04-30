import React, { useState } from 'react'
import Select from 'react-select'
import Fade from 'react-reveal/Fade'
import { Container } from 'react-bootstrap'
import Header from '../components/Header'
import { getTheme, setTheme } from '../helpers/themeManager'

export default function Settings() {
    const [currentTheme, setCurrentTheme] = useState(getTheme())

    const themes = [
        { value: 'default', label: 'Browser Default' },
        { value: 'dark', label: 'Dark Theme' },
        { value: 'light', label: 'Light Theme' },
    ]

    return (
        <>
            <Header title="Settings"/>
            <Fade bottom duration={1250} distance="50px">
                <Container fluid>
                    <Select
                        value={{ value: currentTheme, label: themes.find(theme => theme.value === currentTheme)?.label }}
                        onChange={option => { setTheme(option.value); setCurrentTheme(option.value); }}
                        options={themes}
                    />
                </Container>
            </Fade>
        </>
    )
}
