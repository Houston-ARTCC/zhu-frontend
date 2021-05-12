import { useEffect } from 'react'
import { Container } from 'react-bootstrap'

export default function Header(props) {
    useEffect(() => {
        document.title = 'Houston ARTCC :: ' + props.title
    })

    return (
        <Container fluid className="bg-darkblue header">
            {props.override ? props.override :
                <>
                    <div className="d-none d-md-block">
                        <h1 className="text-white">{props.title}</h1>
                        <h3 className="text-white font-w300">{props.subtitle}</h3>
                    </div>
                    <div className="d-block d-md-none text-center">
                        <h2 className="text-white">{props.title}</h2>
                        <h4 className="text-white font-w300">{props.subtitle}</h4>
                    </div>
                </>
            }
        </Container>
    )
}
