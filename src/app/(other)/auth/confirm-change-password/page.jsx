import React from 'react';
import ForgotPassword from './components/ConfirmChangePassword';
import { Col, Row } from 'react-bootstrap';
import ConfirmChangePassword from './components/ConfirmChangePassword';

const ConfirmEmail = () => {
  return <Col xs={12} lg={6} className="d-flex justify-content-center">
    <Row className="my-5">
      <Col sm={10} xl={12} className="m-auto">
        <h1 className="fs-2">Verify Your Identity to Proceed</h1>
        <h5 className="fw-light mb-4">Click the button below to confirm your identity and continue with resetting your password.</h5>
        <ConfirmChangePassword />
      </Col>
    </Row>
  </Col>;
};
export default ConfirmEmail;
