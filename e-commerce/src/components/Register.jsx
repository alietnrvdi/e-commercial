import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../css/Card.css'
import { auth } from '../store/Firebase';

function Register() {
    // Validatoin schema for register form
    const validationSchema = Yup.object({
        email: Yup.string()
            .required('Required Field')
            .test('is-email', 'Invalid email', (value) => {
                if (value) {
                    return value.includes('@') ? Yup.string().email().isValidSync(value) : true
                }
                return true
            }),
        password: Yup.string()
            .min(8, 'Password character must be less than 8')
            .matches(/[a-z]/, 'Password requires at least one lowercase character')
            .matches(/[A-Z]/, 'Password requires at least one uppercase character')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Şifre en az bir özel karakter içermeli')
            .required('Required Password'),
        rePassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password must be matched')
            .required('Password repeat required')
    })

    const initialValues = {
        email: '',
        password: '',
        rePassword: ''
    }
    // Form register field
    const handleSubmit = async (values) => {
        try {
            // using firebase component for register (createUserWithEmailAndPassword)
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
            const user = userCredential.user
        } catch (error) {
            // İn the case failaure error message
            console.log('Kayıtta Hata', error.message)
        }
    }

    return (
        <Row className='align-items-center min-vh-100'>
            <Col md={8} lg={12} className='w-100 d-flex mx-auto'>
                <div className="border mx-auto w-50 h-100">
                    <Row className='g-4'>
                        <Col md={6} lg={6} className='h-100'>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                <Form className='p-5' >
                                    <h2 >Register</h2>

                                    <div >
                                        <label htmlFor='E-mail'>E-mail</label>
                                        <Field type='email'
                                            id='email'
                                            name="email"
                                            className='form-control '
                                        />
                                        <ErrorMessage name="email" component="div" style={{ color: 'red' }} className="error-message" />
                                    </div>
                                    <div>
                                        <label htmlFor='password'>Password</label>
                                        <Field type='password'
                                            id='password'
                                            name="password"
                                            className='form-control '
                                        />
                                        <ErrorMessage name="password" component="div" style={{ color: 'red' }} className="error-message" />
                                    </div>
                                    <div>
                                        <label htmlFor='Re-password'>Re-password</label>
                                        <Field type='password'
                                            id='rePassword'
                                            name="rePassword"
                                            className='form-control'
                                        />
                                        <ErrorMessage name="rePassword" component="div" style={{ color: 'red' }} className="error-message" />
                                    </div>
                                    <div className='d-flex justify-content-center  mt-3'>
                                        <Button type='submit' s>
                                            Register
                                        </Button>
                                    </div>

                                </Form>

                            </Formik>
                        </Col>

                        <Col md={6} lg={6}
                            className="d-flex flex-column justify-content-center bg-gradient-primary border rounded p-5">
                            <div>
                                <div className='mt-3'>
                                    <Link to={"/login"}>
                                        <Button>Do you have a account?</Button>
                                    </Link>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </div>

            </Col>
        </Row>

    )
}

export default Register