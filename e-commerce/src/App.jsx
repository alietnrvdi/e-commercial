import React, { useState } from 'react';
import './App.css'
import { Outlet } from 'react-router-dom';
import NavbarX from './components/NavbarX'
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
function App() {
  return (
    <>
      <NavbarX />
      <main className='container-fluid'>
        <div className='content'>
          <Outlet />
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default App
