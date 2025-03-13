import * as yup from 'yup';

export const contactValidationSchema = yup.object().shape({
  contact_number: yup
    .string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number format')
    .required('Contact number is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  address: yup.object().shape({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    postal_code: yup
      .string()
      .matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Invalid postal code format')
      .required('Postal code is required'),
    country: yup.string().required('Country is required'),
  }),
}); 