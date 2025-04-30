import { Button, Card } from "react-bootstrap";
import '../css/Card.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
function ProductCard({ productDetails }) {
    // Get the productDetails in thumbnail field 
    const thumbnail = productDetails.thumbnail

    // Five star rating
    const rating = 4.7;
    const startRating = [...Array(5).keys()].map(ix => ix + 1);
    // Random comments count
    const randomRatingNumber = Math.floor(Math.random() * 450) + 1;

    // Check color the variants
    const [variantColor, setVariantColor] = useState([]);
    // İf variants exist return string in the variantCount state
    const [variantCount, setVariantCount] = useState("");

    // İf variants color if greater than two get .length and set variantCount
    useEffect(() => {
        // variants.color map
        const selectColor = Object.values(productDetails.variants).map(item => item.color)
        // variants.color map set in the variantColor
        setVariantColor(selectColor)

        // Get the selectColor.length
        const colorCount = selectColor.length;
        // İf colorCount equal and greater 2 with return ternary operator write variant length
        const variantText = colorCount >= 2 ? `${colorCount} Variants Option` : '';
        setVariantCount(variantText);
    }, []);

    return (
        <Card className="border rounded" border="circle">
            {
                thumbnail &&
                <Card.Img
                    variant="top"
                    src={thumbnail}
                    alt={productDetails.name}
                    className="img-fluid border rounded" />
            }
            {
                // İf not the thumbnail return a default photo 
                !thumbnail &&
                <Card.Img
                    src="https://miro.medium.com/v2/resize:fit:1200/1*y6C4nSvy2Woe0m7bWEn4BA.png" alt="header"
                />
            }
            {/* Five star rating */}
            <Card.Body className="w-100  border-top-0 ">
                <Card.Text >{productDetails.name}</Card.Text>
                <Card.Subtitle className="d-flex">
                    {startRating.map((ix, idx) => (
                        <FontAwesomeIcon
                            key={idx}
                            icon={faStar}
                            size="sm"
                            color={rating >= ix ? 'orange' : 'lightgrey'}
                            className="flex-wrap "
                        />
                    ))}
                    <p className="ms-2">{randomRatingNumber}</p>
                </Card.Subtitle>
                <div className="d-flex flex-column justify-content-between ">
                    <p >{productDetails.price}$</p>
                    <span className=" ms-auto">{variantCount}</span>
                    <Button> See Product
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ProductCard
