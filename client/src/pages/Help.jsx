import React from 'react';
import { Container } from 'react-bootstrap';
import HelpForm from '../components/HelpForm/HelpForm';

function Help() {
  return (
    <div>
      <Container fluid className="vh 100">
        <HelpForm />
      </Container>
    </div>
  );
}

export default Help;
