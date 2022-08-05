import React from 'react';
import { useEffect } from 'react';
import abi from './components/abi.json';
import Home from './Home.js';
import Rules from './Rules.js';
import About from './About.js';
import Collect from './Collect.js';
import Header from './components/Navigation.js';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";


function Homepage() {
return (
  <div>
  <Header />
  <Home />
  </div>
)
}

function Rulepage() {
  return (
    <div>
    <Header />
    <Rules />
    </div>
  )
  }

  function Aboutpage() {
    return (
      <div>
      <Header />
      <About />
      </div>
    )
    }
    function Collection() {
      return (
        <div>
        <Header />
        <Collect />
        </div>
      )
      }

export default function App() {
  return (
    <div >
    <Routes>
      <Route  path='/' element={<Homepage />} />
    </Routes>
    <Routes>
      <Route  path='/about'  element={<Aboutpage />}/>
    </Routes>
    <Routes>
      <Route  path='/rules'  element={<Rulepage />}/>
    </Routes>
    <Routes>
      <Route  path='/collect'  element={<Collection />}/>
    </Routes>
    
  
  </div>
  );
}