import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required(),
  org: Yup.string().required(),
  email: Yup.string().required(),
  projectName: Yup.string().required(),
  projectDesc: Yup.string().required(),
});

function ProjectForm() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        name: '',
        org: '',
        email: '',
        projectName: '',
        projectDesc: '',
      }}
    >
      {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
        <div className="ProjectForm">
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm={3}>
                Name
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isValid={touched.name && !errors.name}
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
