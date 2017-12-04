import React from 'react';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = (props) => (
  <div className="App">
    <Header />
    {props.children}
    <Footer />
  </div>
);

App.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default App;
