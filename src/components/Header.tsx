import { useEffect } from 'react'
import { Container } from 'react-bootstrap'

export default function Header({ title = '', subtitle = '', override = null}) {
    useEffect(() => {
        document.title = 'Houston ARTCC :: ' + title
    })

    return (
        <Container fluid className="bg-darkblue header">
            {override ? override :
                <>
                    <div className="d-none d-md-block">
                        <h1 className="text-white">{title}</h1>
                        <h3 className="text-white font-w300">{subtitle}</h3>
                    </div>
                    <div className="d-block d-md-none text-center">
                        <h2 className="text-white">{title}</h2>
                        <h4 className="text-white font-w300">{subtitle}</h4>
                    </div>
                </>
            }
        </Container>
    )
}
