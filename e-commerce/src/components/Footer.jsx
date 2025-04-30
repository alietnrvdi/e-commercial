import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMapLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

function Footer() {
    return (
        <footer>
            <Row className='d-flex justify-content-center'>
                <Col md={4} lg={3} >
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW9uofUkidGKW0_bZklKhW3g1pr7A7QM5i5w&s"
                        className='img-fluid' width={60} height={60} alt="Logo" />
                    <p className='w-50'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </Col>

                <Col md={4} lg={3} className='d-flex '>
                    <div className='mt-1 me-2'>
                        <FontAwesomeIcon icon={faPhone} style={{ color: "#FFD43B", }} />
                    </div>
                    <div>
                        <h3>Phone</h3>
                        <p>+90 333 111 54 35
                            <br />
                            +90 555 333 12 11</p>
                    </div>
                </Col>
                <Col md={4} lg={3} className='d-flex justify-content-center'>
                    <div className='mt-1 me-2'>
                        <FontAwesomeIcon icon={faMapLocationDot} style={{ color: "#FFD43B", }} />
                    </div>
                    <div>
                        <h3>Adderess</h3>
                        <address>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur.
                            İstanbul, Turkey
                        </address>
                    </div>
                </Col>
            </Row>

            <Col lg={12} md={12} className="d-flex justify-content-center gap-3 ">
                <p >©2024 Lorem. All Rights Reserved.</p>
                <nav className='d-flex gap-2 '>
                    <a href='/'><FontAwesomeIcon icon={faFacebook} size={'xl'} /></a>
                    <a href="/"><FontAwesomeIcon icon={faTwitter} size='xl' /></a>
                    <a href="/"><FontAwesomeIcon icon={faInstagram} size='xl' /></a>
                </nav>
            </Col>
        </footer>
    );
}

export default Footer;