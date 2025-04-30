import React, { useEffect, useState } from 'react';
import { Button, Offcanvas, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faArrowLeft, faRightFromBracket, faClockRotateLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';

function NavbarX() {
    // Custom hook useAuth: İf user login watch the auth state changed
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    // if add the bag any unique item add the navbar count unique item. Get a redux cart store uniqueItem 
    const uniqueItemCount = useSelector((state) => state.cart.uniqueItemCount);

    // If the navigation bar categories area is in mobile view,
    //  it will not be displayed and the canvas view will be used instead.
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const categories = [
        {
            name: 'Men',
            subCategories: ['All Products', 'Clothes', 'Shoes', 'Accessories', 'Coats', 'Boots'],
        },
        {
            name: 'Kids',
            subCategories: ['All Products', 'Clothes', 'Shoes', 'Coats', 'Boots'],
        },
        {
            name: 'Women',
            subCategories: ['All Products', 'Shoes', 'Accessories', 'Coats', 'Boots', 'Dress'],
        },
    ];

    // Close the offcanvas
    const handleCloseOffcanvas = () => {
        setShowOffcanvas(false);
        setCurrentCategory(null);
    };
    // Show the offcanvas
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    // İf main category choosen off the  transfer currentCategory state to this category
    const handleCategoryClick = (category) => {
        setCurrentCategory(category);
    };
    // Back to main category for the return null
    const handleBackToMainMenu = () => {
        setCurrentCategory(null);
    };

    return (
        <>
            <Navbar expand="sm" className='px-2' data-bs-theme='light'>
                <Navbar.Brand href="/">Lorem Shopping</Navbar.Brand>

                <div className="d-flex gap-2 align-items-center order-md-3">
                    {/* Go the bag */}
                    <Link
                        to="/basket"
                    >
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            size="lg"
                            className="p-2"
                        />
                        {uniqueItemCount}
                    </Link>
                    {/* İf user auth with useAuth hook show the logOut and Orders button */}
                    {user ? (
                        <div className="d-flex gap-4 ms-auto">
                            <NavDropdown
                                title={<FontAwesomeIcon icon={faUser} size="lg" className="p-2 g-col-6"
                                />}
                                align={'end'}
                                menuVariant='light'
                            >
                                <NavDropdown.Item
                                    id="navbarScroll"
                                    className="d-flex flex-column gap-3"
                                >
                                    {/* Log Out Button */}
                                    <Button
                                        variant='outline-primary'
                                        className='d-flex w-100 align-items-center justify-content-between'
                                        onClick={logOut}
                                    >
                                        Log Out

                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            size='sm'
                                            className='g-col-6'
                                        />
                                    </Button>
                                    <NavDropdown.Divider />
                                    {/* Orders Button */}
                                    <Button
                                        variant='outline-primary'
                                        className='d-flex w-100 justify-content-between align-items-center'
                                        onClick={() => navigate('/order-history')}>
                                        Orders
                                        <FontAwesomeIcon
                                            icon={faClockRotateLeft}
                                            style={{ color: '#FFD4B3' }}
                                            size='sm'
                                            className='g-col-6'
                                        />
                                    </Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </div>
                    ) :
                        // if user not login show the login page 
                        (
                            <Link
                                to="/login">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    size="lg"
                                    className="p-2"
                                />
                            </Link>
                        )}
                </div>

                {/* Mobile Review show the offcanvas menu instead on dropdown menu */}
                <Navbar.Toggle aria-controls="navbarScroll" onClick={handleShowOffcanvas} placement='end' />
                {isMobile ? (
                    <>
                        <Offcanvas
                            show={showOffcanvas}
                            onHide={handleCloseOffcanvas}
                            placement="start"
                            className="custom-offcanvas"
                        >
                            <Offcanvas.Header closeButton>
                                {currentCategory ? (
                                    <Offcanvas.Title onClick={handleBackToMainMenu} style={{ cursor: 'pointer' }}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Categories
                                    </Offcanvas.Title>
                                ) : (
                                    <Offcanvas.Title>Categories</Offcanvas.Title>
                                )}
                            </Offcanvas.Header>

                            <Offcanvas.Body >
                                <p>New Products and Highlights</p>
                                {!currentCategory ? (
                                    categories.map((category, idx) => (
                                        <div key={idx} className='d-flex justify-content-between align-items-center'>
                                            <h6 onClick={() => handleCategoryClick(category)}>
                                                {category.name}
                                            </h6>
                                            <FontAwesomeIcon icon={faArrowRight} size='xl' className='d-flex' />
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <h6>{currentCategory.name} Categories</h6>
                                        <ul className='list-unstyled'>
                                            {currentCategory.subCategories.map((subCategory, subIdx) => (
                                                <li key={subIdx}>
                                                    <Link
                                                        to={`/category/${currentCategory.name.toLowerCase()}/${subCategory.toLowerCase()}`}
                                                        onClick={handleCloseOffcanvas}
                                                    >
                                                        {subCategory}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Offcanvas.Body>
                        </Offcanvas>
                    </>
                ) : (
                    // Category 
                    <Nav className="mx-auto gap-4">
                        {categories.map((category, index) => (
                            <div key={index} className='dropdown-container'>
                                <NavDropdown
                                    className='w-100'
                                    title={category.name}
                                    drop='center'
                                >
                                    <div className='mega-menu-content'>
                                        {category.subCategories.map((subCategory, subIdx) => (
                                            <div key={`${category.name}-${subIdx}`} className="mega-menu-item" >
                                                <NavDropdown.Item
                                                    className=''
                                                    as={Link}
                                                    to={`/category/${category.name.toLowerCase()}/${subCategory.toLowerCase() ===
                                                        'all products' ? 'all' : subCategory.toLowerCase()}`}
                                                >
                                                    {subCategory}
                                                </NavDropdown.Item>
                                            </div>
                                        ))}
                                    </div>
                                </NavDropdown>
                            </div>
                        ))}
                    </Nav>
                )}
            </Navbar>
        </>
    );
}

export default NavbarX;
