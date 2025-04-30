import React, { useEffect, useRef, useState } from 'react'
import '../css/Card.css'
import { Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import { Button, ButtonGroup, Alert, Row, Col, Accordion, Card, CardGroup, Container } from 'react-bootstrap'
import 'swiper/css';
import 'swiper/css/navigation'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faGlobe, faStar, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../store/Firebase'
import { useMemo } from 'react'

function ProductPageCard({ productDetails }) {
  // Product size ,color , variant choosen for the add to bag
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const thumbswiper = useRef(null)
  // İf true or false return message submit with add to bag button
  const [cartMessage, setCartMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false)

  // Get redux function
  const dispatch = useDispatch();
  // React-Router Dom Link
  const navigate = useNavigate();
  // Query URL
  const [searchParams] = useSearchParams();
  //  Get current page url info
  const location = useLocation();

  // İf change size,color and variant change the url choosen info
  const updateUrl = (size, color) => {
    const searchParams = new URLSearchParams(location.search)
    let shouldNavigate = false;
    if (size && size !== 'null') {
      searchParams.set('size', size);
      setSelectedSize(size);
      shouldNavigate = true;
    } else {
      searchParams.delete('size')
    }
    if (color && color !== 'null') {
      searchParams.set('color', color)
      setSelectedColor(color)
      shouldNavigate = true;
    } else {
      searchParams.delete('color')
    }
    if (shouldNavigate) {
      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      }, { replace: true })
    }
  }
  // bag or orders page clicked the product get a url query to same size,color,variant
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectSizeUrl = searchParams.get('size');
    const selectColorUrl = searchParams.get('color');
    if (selectSizeUrl && selectSizeUrl !== 'null') {
      setSelectedSize(selectSizeUrl)
    } else {
      searchParams.delete('size')
    }
    if (selectColorUrl && selectColorUrl !== 'null') {
      const variant = productDetails.variants.find(v => v.color === selectColorUrl)
      setSelectedColor(selectColorUrl);
      if (variant) {
        setSelectedColor(selectColorUrl)
        setSelectedVariant(variant)
      } else {
        setCartMessage('Selected variant is not avaible')
      }
    } else {
      searchParams.delete('color')
    }
  }, [searchParams])

  // Default opened product page choosen variant
  useEffect(() => {
    if (selectedColor !== productDetails.variants.color) {
      const defaultColor = productDetails.variants[0].color;
      setSelectedColor(defaultColor)
      navigate({
        pathname: location.pathname,
        search: `?size=${selectedSize}&color=${defaultColor}`,
      }, { replace: true });
    }
  }, [productDetails.variants, navigate, location.pathname]);
  console.log(selectedColor)
  // Choose size method
  const handleSize = (size) => {
    setSelectedSize(size);
    setCartMessage("");
    updateUrl(size, selectedColor)

  }
  // Choose color methot
  const handleColor = (color) => {
    const variant = productDetails.variants.find(variant => variant.color === color);
    setSelectedColor(color);
    setSelectedVariant(variant);
    setCartMessage('');
    updateUrl(selectedSize, color)
  };

  // Add bag 
  const handleAddToCart = () => {
    // İf not size and color return error message
    if (!selectedSize) {
      setCartMessage('Please choose a size')
      return;
    }
    if (!selectedColor) {
      setCartMessage('Please choose a color')
      return
    }
    // Select variant with sizes
    const selectedVariant = productDetails.variants.find((variant) => {
      return (
        variant.color === selectedColor &&
        productDetails.sizes
      );
    });
    // İf selectedVariant not null add to bag
    if (selectedVariant) {
      // variantId = uuid4 
      const variantId = selectedVariant.variantId
      dispatch(addToCart({
        name: productDetails.name,
        id: variantId,
        size: selectedSize,
        slug: productDetails.slug,
        color: selectedColor,
        price: productDetails.price,
        thumbnail: selectedVariant.thumbnail
      }))
      // Product name size and color add to message
      setCartMessage(`Product ${productDetails.name}- ${selectedSize} - ${selectedColor} size add to cart succesfully`);
      // if successfull show alert will be run 
      setShowAlert(true)
      // İf successful true 3 seconds message to stayed
      setTimeout(() => {
        setShowAlert(false);
      }, 3000)

    } else {
      // Error message
      setCartMessage(`The selected size : ${selectedSize} and color : ${selectedColor} combination is out of stock.`);
      // if failaure show alert boolean:t
      setShowAlert(true)
      // In case of failure, a message is sent that will pause for 2.3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 2300)
    }
  }

  // Return Swiper Slide with useMemo
  const imageSlides = useMemo(() => {
    return productDetails.variants
      .filter(item => item.color === selectedColor)
      .map((items) => items.imageUrl.map((url, imgIdx) => (
        <SwiperSlide key={imgIdx}  >
          <img src={url} alt={`Index ${imgIdx + 1}`} style={{ height: '100%', width: '100%' }} />
        </SwiperSlide>

      )));
  }, [selectedColor, productDetails.variants]);

  // İf color equal choosen color return stock
  const stocks = productDetails.variants.filter(
    item => item.color === selectedColor)
    .map(stock => stock)
  // Five stars structe rating
  const rating = 4.7;
  const starArray = [...Array(5).keys()].map(i => i + 1);
  // Xs to XXL order
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  // Return sizes with useMemo if no stock to button disabled
  const avaibleSizes = useMemo(() => {
    return stocks.map(stockItem => {
      return Object.entries(stockItem.stock)
        .sort(([sizeA], [sizeB]) => sizeOrder.indexOf(sizeA) - sizeOrder.indexOf(sizeB))
        .map(([size, stock]) => {
          return (
            <div key={size} >
              <Button
                disabled={stock === 0}
                className='w-100'
                variant={selectedSize === size
                  ? "primary"
                  : stock === 0
                    ? "outline-secondary"
                    : 'outline-primary'}
                onClick={() => handleSize(size)}
              >
                {size}
              </Button>
            </div>
          );
        });
    });
  }, [stocks, selectedSize, handleSize]);

  // Same category fetch 
  const [relatedProducts, setRelatedProducts] = useState([])

  async function fetchRelatedProducts(categoryId, subCategories) {
    const q = query(collection(db, 'products'),
      where('productsObj.categoryId', '==', categoryId),
      where('productsObj.subCategories', '==', subCategories))
    const querySnapshot = await getDocs(q)
    const relatedList = querySnapshot.docs.map(doc => doc.data())
    return relatedList;
  }

  useEffect(() => {
    async function getRelatedProducts() {
      const products = await fetchRelatedProducts(productDetails.categoryId, productDetails.subCategories, selectedColor);
      setRelatedProducts(products);
    }
    getRelatedProducts();
  }, [productDetails.categoryId]);

  const productMap = relatedProducts.map(item => item.productsObj)
  const randomPRoducts = productMap.sort(() => 0.5 - Math.random()).slice(0, 4)

  // Related product  with same category using useMemo
  const relatedListJsx = useMemo(() => {
    return randomPRoducts.map((product, pIdx) =>
    (
      <CardGroup key={pIdx} >
        <Card className=' rounded'>
          {/* // İf click cursor pointor go to product page */}
          <Card.Img
            src={product.thumbnail}
            className='border rounded'
            onClick={() => navigate(`/product/${product.slug}`)}
          />
          <Card.Body className='w-100'>
            <div className='d-flex justify-content-between'>
              <p className='text-custom'>{product.subCategories}</p>
              {/* 5 stars structure */}
              {starArray.map((iStar, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  size='sm'
                  color={rating >= iStar ? 'orange' : 'primary'}
                />
              ))}
            </div>
            <p className='w-100'>{product.name}</p>
            <p className='d-inline text-danger'>${product.price}</p>
          </Card.Body>
        </Card>
      </CardGroup>
    )
    )
  }, [randomPRoducts])

  return (
    <Container >
      <Row className='mt-3'>
        {/* Left Place - Product Images */}
        <Col sm={12} md={6} lg={6} >
          <Swiper
            modules={[Navigation, Thumbs, Scrollbar]}
            thumbs={{ swiper: thumbswiper.current }}
            navigation={true}
            slidesPerView={1}
            spaceBetween={30}
            className='w-75'
          >
            {imageSlides}
          </Swiper>
          <Swiper
            onSwiper={(swiper) => (thumbswiper.current = swiper)}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress
            className="mt-3 "
          >
            {imageSlides}

          </Swiper>
        </Col>

        {/* Right side - Product Information and Options */}
        <Col sm={12} md={6} lg={6} className="d-flex flex-column mt-3">
          {/* Product header and features */}
          <div className="product-details mb-3">
            <h3 className="font-weight-bold">{productDetails.name}</h3>
            {starArray.map((i, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                color={rating >= i ? 'orange' : 'lightgrey'}
              />
            ))}
            <h4 className='mt-2 p-2 text-custom'>${productDetails.price} </h4>
            <h5>10% discount in cart!</h5>
          </div>

          {/* Variants Options */}
          <div className="mb-3">
            <p>Variants:</p>
            <ul className='d-flex gap-3'>
              {productDetails.variants.map((item, index) => (
                <div key={index}>
                  <img
                    src={item.thumbnail}
                    alt={`Thumbnail`}
                    className=" img-fluid"
                    style={{ width: '60px', height: '80px', cursor: 'pointer' }}
                    onClick={() => handleColor(item.color)}
                  />
                </div>
              ))}
            </ul>
          </div>

          <div className='mt-3'>
            <p className="mb-2"><strong>Size:</strong></p>
            <div className='d-flex flex-wrap '>
              <ButtonGroup className="gap-3 w-75 ">
                {avaibleSizes}
              </ButtonGroup>
            </div>
          </div>
          {/* Price and Add Basket Button*/}
          <div className="mt-2">
            <Button
              className='w-75 p-3'
              variant="warning" onClick={handleAddToCart}>
              Add
            </Button>
          </div>
          {/* İf success or error get ErrorMessage  */}
          {showAlert && (
            <Alert className='mt-3'
              variant={selectedSize ? 'success' : 'danger'}
              onClose={() => setShowAlert(false)}
              dismissible >
              {cartMessage}
            </Alert>
          )}
          <div>

            {/* Accordion for Product Features */}
            <Accordion defaultActiveKey={0} className='mt-3'>
              <Accordion.Item eventKey='0'>
                <Accordion.Header>Product Features</Accordion.Header>
                <Accordion.Body className='h-100' >
                  <ol className='d-flex flex-column gap-4'>
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.quam sequi
                      sapiente voluptates,
                    </li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Doloremque quam sequi sapiente voluptates, explicabo qui quaerat!
                      Et quos quis.
                    </li>
                    <li>Doloremque quam sequi sapiente voluptates, explicabo qui quaerat!
                      Et quos quis iure, corrupti magnam nostrum velit, ullam non provident</li>
                    <li>Doloremque quam sequi sapiente voluptates, explicabo qui quaerat!
                      Et quos quis iure, corrupti magnam nostrum velit, ullam non provident</li>
                  </ol>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>


          <ul className='d-flex flex-column gap-3 mt-4 list-unstyled '>
            <li><FontAwesomeIcon icon={faGlobe} size='2xl' /> Shipping World Wide</li>
            <li><FontAwesomeIcon icon={faCreditCard} size='xl' /> 100% Secured Payment</li>
            <li><FontAwesomeIcon icon={faUserTie} size='2xl' /> Made by Professionals </li>
          </ul>
        </Col>
        {/* Related Products Section */}
        <h3>Related Products</h3>
        <div className='related-container'>
          {relatedListJsx}
        </div>

      </Row >
    </Container>
  )
}

export default ProductPageCard