import React from 'react';
import TopNavigationBar from './components/TopNavigationBar';
import Footer from './components/Footer';
const layout = ({
  children
}) => {
  return <>
      <TopNavigationBar />
      {children}
      <Footer className='pt-5 bg-light' />
    </>;
};
export default layout;
