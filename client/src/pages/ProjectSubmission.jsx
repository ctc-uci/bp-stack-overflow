import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectForm from '../components/ProjectForm/ProjectForm';

function ProjectSubmission() {
  return (
    <div>
      <Container fluid className="vh 100">
        <ProjectForm />
      </Container>
    </div>
  );
}

export default ProjectSubmission;
