import React from 'react';
import EditProfile from './components/EditProfile';
import LinkedAccount from './components/LinkedAccount';
import SocialMedia from './components/SocialMedia';
import EmailChange from './components/EmailChange';
import PasswordChange from './components/PasswordChange';
import { Row } from 'react-bootstrap';
export const metadata = {
  title: 'Edit Profile'
};
const EditProfilePage = () => {
  return <>
      <EditProfile />
      {/* <Row className="g-4 mt-3">
        <LinkedAccount />
        <SocialMedia />
        <EmailChange />
        <PasswordChange />
      </Row> */}
    </>;
};
export default EditProfilePage;
