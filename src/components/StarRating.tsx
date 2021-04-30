import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { IoStar, IoStarOutline } from 'react-icons/all'

export default function StarRating({ onChange }) {
    const [rating, setRating] = useState(1)

    function handleStarClick(i) {
        setRating(i + 1)
        onChange(i + 1)
    }

    return (
        <div>
            <Form.Control required hidden type="number" name="rating" value={rating}/>
            {[...Array(5)].map((x, i) => {
                return (
                    i >= rating
                        ? <IoStarOutline
                            key={i}
                            size={30}
                            className="mr-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleStarClick(i)}
                        />
                        : <IoStar
                            key={i}
                            size={30}
                            className="mr-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleStarClick(i)}
                        />
                )
            })}
        </div>
    )
}