import React from 'react';
import { Container } from 'react-bootstrap';
import HelpForm from '../components/HelpForm/HelpForm';

function Help() {
  return (
    <div>
      <Container style={{ minHeight: '70vh' }}>
        <HelpForm />
      </Container>
    </div>
  );
}

export default Help;
