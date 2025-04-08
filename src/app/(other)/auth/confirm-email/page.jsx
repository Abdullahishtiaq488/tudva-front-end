import React from 'react';
import ForgotPassword from './components/VerifyEmail';
import { Col, Row } from 'react-bootstrap';
import VerifyEmail from './components/VerifyEmail';

const ConfirmEmail = () => {
  return <Col xs={12} lg={6} className="d-flex justify-content-center">
    <Row className="my-5">
      <Col sm={10} xl={12} className="m-auto">
        <h1 className="fs-2">Verify Your Email</h1>
        <h5 className="fw-light mb-4">Click the button below to verify your email address and activate your account.</h5>
        <VerifyEmail />
      </Col>
    </Row>
  </Col>;
};
export default ConfirmEmail;
