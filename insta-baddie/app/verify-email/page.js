import React from 'react';
import Nav from '../nav';

const VerifyEmailPage = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const contentStyle = {
    textAlign: 'center',
  };

  const paragraphStyle = {
    fontSize: '18px',
    color: 'white',
  };

  return (
    <main>
    <Nav/>
    <div style={containerStyle}>
      <div style={contentStyle}>
        <p style={paragraphStyle}>Please verify your email and refresh to continue.</p>
      </div>
    </div>
    </main>
  );
};

export default VerifyEmailPage;