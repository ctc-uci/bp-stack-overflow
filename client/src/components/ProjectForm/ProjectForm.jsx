import './ProjectForm.css';
import React, { useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as emailjs from 'emailjs-com';

const schema = Yup.object().shape({
  fromName: Yup.string()
    .min(2, '*Names must have at least 2 characters')
    .max(100, "*Names can't be longer than 100 characters")
    .required('*Name is required'),
  org: Yup.string()
    .max(100, "*Organization Name can't be longer than 100 characters")
    .required('*Organization Name is required'),
  email: Yup.string()
    .email('*Must be a valid email address')
    .max(100, "*Names can't be longer than 100 characters")
    .required('*Email is required'),
  projectName: Yup.string()
    .max(100, "*Project Name can't be longer than 100 characters")
    .required('*Project Name is required'),
  projectDesc: Yup.string()
    .max(500, "*Project Description can't be longer than 500 characters")
    .required('*Project Description is required'),
});

function ProjectForm() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={values => {
        console.log('values', values);
        emailjs
          .send('service_8df5nsq', 'template_vnugtuo', values, 'HRp4nelN42ICeNJkU')
          .then(() => {
            console.log('email sent');
          });
      }}
      initialValues={{
        fromName: '',
        org: '',
        email: '',
        projectName: '',
        projectDesc: '',
      }}
    >
      {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
        <div className="ProjectForm">
          {console.log(values)}
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm={3}>
                Name
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="fromName"
                  value={values.fromName}
                  onChange={handleChange}
                  isValid={touched.fromName && !errors.fromName}
                  className={touched.fromName && errors.fromName ? 'error' : null}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formOrganization">
              <Form.Label column sm={3}>
                Organization
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter organization"
                  name="org"
                  value={values.org}
                  onChange={handleChange}
                  isValid={touched.org && !errors.org}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formEmail">
              <Form.Label column sm={3}>
                Email Address
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.email}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formProjectName">
              <Form.Label column sm={3}>
                Project Name
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter project name"
                  name="projectName"
                  value={values.projectName}
                  onChange={handleChange}
                  isValid={touched.projectName && !errors.projectName}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formProjectDescription">
              <Form.Label column sm={3}>
                Project Description
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter project description"
                  name="projectDesc"
                  value={values.projectDesc}
                  onChange={handleChange}
                  isValid={touched.projectDesc && !errors.projectDesc}
                />
              </Col>
            </Form.Group>

            <button type="submit" className="btn ctc-btn float-end">
              Submit
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default ProjectForm;
