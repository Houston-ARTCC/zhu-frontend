import { Alert } from 'react-bootstrap'

export default function IconAlert(props) {
    return (
        <Alert variant={props.variant} className={'position-unset m-0 ' + props.className} >
            <table>
                <tr>
                    <td className="pb-2 pb-md-1" style={{ width: 10 }}><props.icon className={'fill-' + props.variant + ' mr-2'} size={25}/></td>
                    <td className="pb-2 pb-md-1"><h5 className="mb-0">{props.header}</h5></td>
                </tr>
                <tr>
                    <td className="d-none d-md-table"/>
                    <td colSpan={2}>
                        {props.children}
                    </td>
                </tr>
            </table>
        </Alert>
    )
}