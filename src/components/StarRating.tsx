import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { IoStar, IoStarOutline } from 'react-icons/all'

export default class StarRating extends Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            rating: 1
        }
    }

    handleStarClick(i) {
        this.setState({ rating: i + 1 })
        this.props.onChange(i + 1)
    }

    render() {
        return (
            <div>
                <Form.Control required hidden type="number" name="rating" value={this.state.rating}/>
                {[...Array(5)].map((x, i) => {
                    return (
                        i >= this.state.rating
                            ? <IoStarOutline
                                key={i}
                                size={30}
                                className="mr-1"
                                style={{ cursor: 'pointer' }}
                                onClick={this.handleStarClick.bind(this, i)}
                            />
                            : <IoStar
                                key={i}
                                size={30}
                                className="mr-1"
                                style={{ cursor: 'pointer' }}
                                onClick={this.handleStarClick.bind(this, i)}
                            />
                    )
                })}
            </div>
        )
    }
}