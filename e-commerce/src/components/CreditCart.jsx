import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { ErrorMessage, Field, Formik } from 'formik'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import * as Yup from 'yup'
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { addCreditCard } from '../store/creditCartSlice'

function CreditCart({ onBackToOffCanvasMenuA }) {
    // State for the date picker
    const [startDate, setStartDate] = useState(null)
    // creditCartSlice redux with dispath
    const dispatch = useDispatch()
    // Necessary field for schema
    const validationSchema = Yup.object({
        cardNumber: Yup.string()
            .required('Required')
            .matches(/^[0-9]{16}$/, `Must be exactly 16 digits`),
        expirationDate: Yup.string()
            .required('Experation date is required')
            .matches(/^(0[1-9]|1[2])/g, 'Months 1 or 12 must be between')
            .matches(/\d{2}$/, 'Years field must be 2 digits'),
        cvc: Yup.string()
            .required('CVC is required')
            .matches(/^[0-9]{3}$/, `CVC must be 3 digits`),
        cardholderName: Yup.string()
            .required('Cardholder name is required')
            .matches(/^[a-zA-Z\s]+$/, 'Cardholder name must only contain letters and spaces'),
    })

    return (
        <Formik
            initialValues={{
                cardNumber: '',
                expirationDate: '',
                cvc: '',
                cardholderName: '',
            }}
            // Add validation schema
            validationSchema={validationSchema}
            onSubmit={(values) => {
                // Add redux store credit card
                dispatch(addCreditCard(values))
                // Back the previously off canvas menu
                onBackToOffCanvasMenuA()
            }}
        >
            {({ handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}
                    className='form-control'
                >
                    <h2>New Cart</h2>
                    {/* Card number input field */}
                    <Field
                        name="cardNumber"
                        type="text"
                        maxLength="16"
                        placeholder="Kart Numarası"
                        values={values.cardNumber}
                        className="w-100 mb-2 form-control"
                    />
                    {/* İf Error state will be return message  */}
                    <ErrorMessage name="cardNumber" component="div" className='d-flex text-danger' />

                    {/* ExpirationDate input field with inline formatting */}
                    <div className='d-flex form-group'>
                        <Field name="expirationDate">
                            {({ field, form }) => (
                                <DatePicker
                                    maxLength='5'
                                    className="form-control"
                                    selected={startDate}
                                    onChange={(date) => {
                                        // Choosen date add the startDate state
                                        setStartDate(date);
                                        form.setFieldValue('expirationDate', format(date, 'MM/yy'));
                                    }}
                                    dateFormat="MM/yy"
                                    showMonthYearPicker
                                    placeholderText="MM/YY"
                                >
                                    <ErrorMessage name="expirationDate" component="div" className='d-flex text-danger' />
                                </DatePicker>

                            )}
                        </Field>

                        {/* CVC input field */}
                        <Field
                            name='cvc'
                            maxLength='3'
                            placeholder='CVC'
                            className='d-flex w-50 ms-1 form-control'
                        />
                        <ErrorMessage name="cvc" component="div" className='d-flex text-danger' />

                    </div>
                    {/* Cardholder's Name input field */}
                    <Field name="cardholderName"
                        placeholder='Cardholder Name'
                        className='w-100 mt-2 form-control'
                    />
                    <ErrorMessage name="cardholderName" component="div" className='d-flex text-danger' />

                    {/* Card Save Button */}
                    <Button
                        type='submit'
                        size='lg'
                        variant='warning'
                        className='w-100 mt-3 form-control'
                    >
                        Save Card
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default CreditCart