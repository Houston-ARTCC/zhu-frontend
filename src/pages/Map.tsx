import React, { Component } from 'react'
import { Badge, Button, Container } from 'react-bootstrap'
import Fade from 'react-reveal/Fade'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Header from '../components/Header'
import axiosInstance from '../helpers/axiosInstance'
import { getTheme } from '../helpers/themeManager'

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default
mapboxgl.accessToken = 'pk.eyJ1IjoibWlrZXJvbWEiLCJhIjoiY2szbWI1YWJxMGVudjNjbGp1OGJ5ank4MyJ9.3jZUs_nQCehwmixhAZmKqA'

export default class Map extends Component<any, any> {
    mapContainer =  React.createRef<HTMLDivElement>()
    constructor(props) {
        super(props)
        this.state = {
            metars: [],
        }
        this.mapContainer = React.createRef()
    }

    componentDidMount() {
        this.fetchMETARs()
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: getTheme() === 'dark'
                ? 'mapbox://styles/mikeroma/cknyyool032px17n1ljciyroy'
                : 'mapbox://styles/mikeroma/cknyy7hnt32ch17n1u1d7xon4',
            center: [-95, 29.4],
            zoom: 6
        })
        const smallPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        })
        const fullPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
        })
        map.on('mouseenter', 'houston-artcc-airports', (e) => {
            map.getCanvas().style.cursor = 'pointer'
            fullPopup.remove()
            smallPopup
                .setLngLat(e.features[0].geometry.coordinates.slice())
                .setDOMContent(this.createSmallPopup(e.features[0].properties))
                .addTo(map)
        })
        map.on('mouseleave', 'houston-artcc-airports', () => {
            map.getCanvas().style.cursor = ''
            smallPopup.remove()
        })
        map.on('click', () => fullPopup.remove())
        map.on('click', 'houston-artcc-airports', (e) => {
            map.getCanvas().style.cursor = 'pointer'
            smallPopup.remove()
            fullPopup
                .setLngLat(e.features[0].geometry.coordinates.slice())
                .setDOMContent(this.createDetailPopup(e.features[0].properties))
                .addTo(map)
        })
    }

    fetchMETARs() {
        axiosInstance
            .get('/api/tmu/metar/')
            .then(res => this.setState({ metars: res.data }))
    }

    createSmallPopup(props) {
        let popup = document.createElement('div')
        let contents = <div className="bg-darkblue p-3">
            <div className="d-flex flex-row align-items-center mb-2">
                <Badge className="badge-sm mr-2" variant="white">{props.ICAO}</Badge>
                <h5 className="text-white ml-1 mb-0">{props.Name}</h5>
            </div>
            <p className="text-white font-sm m-0">Click to view more info</p>
        </div>

        ReactDOM.render(contents, popup)
        return popup
    }

    createDetailPopup(props) {
        let metar = this.state.metars.find(metar => metar.station === props.ICAO)
        let popup = document.createElement('div')
        let contents = <div>
            <div className="bg-darkblue p-3 d-flex flex-row align-items-center">
                <Badge className="badge-sm mr-2" variant="white">{props.ICAO}</Badge>
                <h5 className="text-white ml-1 mb-0">{props.Name}</h5>
            </div>
            <div className="p-3">
                <Badge className="badge-sm mb-1 mr-2" variant={
                    metar.flight_rules === 'VFR'
                        ? 'green'
                        : metar.flight_rules === 'MVFR'
                            ? 'primary'
                            : metar.flight_rules === 'IFR'
                                ? 'yellow'
                                : 'red'
                }>{metar.flight_rules}</Badge>
                <a className="link-unstyled" href={'https://simcharts.info/?search=' + props.ICAO} target="_blank"  rel="noreferrer">
                    <Button className="btn-sm" variant="lightgray">View Charts</Button>
                </a>
                <p className="mb-0 font-sm">{metar.raw}</p>
            </div>
        </div>

        ReactDOM.render(contents, popup)
        return popup
    }

    render() {
        return (
            <div>
                <Header title="Map"/>
                <Fade bottom duration={1250} distance="50px">
                    <Container fluid>
                        <div className="position-relative" style={{height: 800}}>
                            <div ref={this.mapContainer} className="mapboxgl-map"/>
                        </div>
                    </Container>
                </Fade>
            </div>
        )
    }
}
