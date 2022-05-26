import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectForm from '../components/ProjectForm/ProjectForm';

function ProjectSubmission() {
  return (
    <div style={{ minHeight: '70vh' }}>
      <Container className="d-grid h-100 mt-5">
        <h2>Project Ideas Form</h2>
        <ProjectForm />
      </Container>
    </div>
  );
}

export default ProjectSubmission;
