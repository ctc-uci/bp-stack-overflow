import React, { useState, useContext } from 'react';
import { Form, Container } from 'react-bootstrap';
import { BACKEND_URL } from '../../pages/Home/Home';
import UserContext from '../UserContext';
import './HelpForm.css';

function HelpForm() {
  const auth = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [desc, setDesc] = useState('');
  const [fya, setFYA] = useState(false);
  const [och, setOCH] = useState(false);
  const [tlp, setTLP] = useState(false);
  const [afc, setAFC] = useState(false);

  async function submitQuestion(e) {
    e.preventDefault();
    const checkedTagsDict = {
      fya,
      och,
      tlp,
      afc,
    };
    const checkedTags = Object.keys(checkedTagsDict).filter(k => checkedTagsDict[k]);
    await fetch(`${BACKEND_URL}/api/makePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: auth.currentUser.uid,
        title: question,
        body: desc,
        tags: checkedTags,
      }),
    });
    alert('Question posted successfully!');
  }
  return (
    <div className="HelpForm">
      <Container className="d-grid h-100 my-5">
        <h1>Help Form</h1>
        <p>Need help? Post a question here!</p>
        <form id="help-form" onSubmit={submitQuestion}>
          <Form.Group className="mb-3" controlId="formQuestion">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your question"
              onChange={e => setQuestion(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Please provide a description"
              onChange={e => setDesc(e.target.value)}
            />
          </Form.Group>

          <fieldset className="mb-3">
            <legend>Tags</legend>
            <Form.Check
              type="checkbox"
              id="fya"
              name="tags"
              label="Find Your Anchor"
              onClick={e => setFYA(e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              id="och"
              name="tags"
              label="OC Habitats"
              onClick={e => setOCH(e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              id="tlp"
              name="tags"
              label="The Literacy Project"
              onClick={e => setTLP(e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              id="afc"
              name="tags"
              label="Abound Food Care"
              onClick={e => setAFC(e.target.checked)}
            />
          </fieldset>

          <button type="submit" className="btn ctc-btn">
            Submit
          </button>
        </form>
      </Container>
    </div>
  );
}

export default HelpForm;
