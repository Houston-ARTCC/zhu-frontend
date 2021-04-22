import { Badge } from 'react-bootstrap'

export default function EventScoreBadge({ score, large=false }) {
    let color

    if (score < 65) color = 'red'
    else if (score < 90) color = 'yellow'
    else color = 'green'

    return <Badge variant={color + ' rounded' + (large ? ' badge-lg' : '')}>{score}%</Badge>
}
