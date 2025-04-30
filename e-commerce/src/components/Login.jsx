import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button, Card, Col, Row } from 'react-bootstrap'; // Bootstrap Layout
import { useState } from 'react';
import { auth, provider } from '../store/Firebase';
import '../css/Card.css'; // Styling dosyası
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

const LoginPage = () => {
    // İf user login and not log out get a localstorage user item inside the user state
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const navigate = useNavigate();

    // Validation Schema Yup
    const LoginValidationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Required Field'),
        password: Yup.string().min(8, 'Password character must be less than 8').required('Required Field'),
    });

    // İnitial Values
    const initialValues = {
        email: '',
        password: '',
    };

    // Google login with Firebase with Popup provider
    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            setUser(user);
        } catch (error) {
            console.log('Error Google Login: ', error);
        }
    };

    // Form login with Firebase
    const handleLogin = async (values) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            setUser(user)
        } catch (error) {
            const errorCode = error.code;
            if (errorCode === 'auth/user-not-found') {
                alert('User not found');
            } else if (errorCode === 'auth/wrong-password') {
                alert('Wrong Password');
            }
        }
    };

    return (
        <Row className=" align-items-center min-vh-100"> {/* Vertical center */}
            <Col md={6} lg={12} className='d-flex w-100'> {/* Responsive width */}
                <Card border="white" className="card-login w-100 ">
                    <Row className="g-4"> {/* Grid layout for two sections */}
                        {/* Left  Side - Register Form */}
                        <Col md={6} lg={6} className="p-5 xls ">

                            <Formik validationSchema={LoginValidationSchema} initialValues={initialValues} onSubmit={handleLogin}>
                                {({ handleSubmit }) => (
                                    <Form
                                        onSubmit={handleSubmit}>
                                        <h3>Login</h3>
                                        <div>
                                            <label htmlFor="email">E-mail</label>
                                            <Field type="email" id="email" name="email" className="form-control mb-3" />
                                            <ErrorMessage name="email" component="div" style={{ color: 'red' }} className="error-message" />
                                        </div>
                                        <div>
                                            <label htmlFor="password">Password</label>
                                            <Field type="password" id="password" name="password" className="form-control mb-3" />
                                            <ErrorMessage name="password" component="div" style={{ color: 'red' }} className="error-message" />
                                        </div>
                                        <Button type="submit" variant="outline-primary" className="w-100 mb-3">Sign In</Button>

                                        <div className="text-center">or</div>

                                        <div className='d-flex  mt-3'>
                                            <Button
                                                onClick={handleGoogleSignIn}
                                                className='bg-light mx-auto text-dark border rounded'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faGoogle} size='2xl'
                                                    style={{ color: "#74C0FC", }}
                                                    className='ms-2'
                                                />
                                                <span className='ms-2'>
                                                    Sign in With Google
                                                </span>
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Col>

                        {/* Right Side - Purple background */}
                        <Col md={6} lg={6}
                            className="d-flex flex-column justify-content-center bg-gradient-primary border rounded p-5">
                            <h3 className="text-white">Welcome Back</h3>
                            <p>Simply Create your account by clicking the Signup Button</p>
                            <Link to="/register">
                                <Button variant="outline-light">Sign Up</Button>
                            </Link>
                        </Col>

                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;
