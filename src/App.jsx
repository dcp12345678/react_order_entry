import React from 'react';
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
  children: React.PropTypes.arrayOf(React.PropTypes.element),
};

export default App;
