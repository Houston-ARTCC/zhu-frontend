import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { FaPlus, FaTimes, FaUserTimes } from 'react-icons/all'

type CustomToggleProps = {
    children?: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {}
}

type CustomMenuProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: string
    labeledBy?: string
}

export const EventDropdownToggle = React.forwardRef(
    (props: CustomToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
        <a
            href=""
            ref={ref}
            onClick={e => {
                e.preventDefault()
                if (props.onClick) props.onClick(e)
            }}
        >
            {props.children}
            <span style={{ paddingLeft: '5px' }}>&#x25bc;</span>
        </a>
    )
)

export const EventDropdownMenu = React.forwardRef(
    (props: CustomMenuProps, ref: React.Ref<HTMLDivElement>) => {
        return (
            <div
                ref={ref}
                style={props.style}
                className={props.className}
                aria-labelledby={props.labeledBy}
            >
                <div className="d-flex">
                    <Dropdown.Item className="text-center" eventKey="unassign">
                        <FaUserTimes size={15}/> Unassign
                    </Dropdown.Item>
                    <Dropdown.Item className="text-center" eventKey="delete">
                        <FaTimes size={15}/> Delete
                    </Dropdown.Item>
                </div>
                <Dropdown.Divider/>
                <ul className="list-unstyled">
                    {React.Children.toArray(props.children)}
                    <Dropdown.Divider/>
                    <Dropdown.Item eventKey="manual"><FaPlus size={15}/> Manually Assign</Dropdown.Item>
                </ul>
            </div>
        )
    }
)
