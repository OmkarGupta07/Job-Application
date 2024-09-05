import React from 'react';
import './App.css';
import Router from './Routes/router'
import log from 'loglevel';

function App() {
  React.useEffect(() => {
    log.trace('This is a trace log');
    log.debug('This is a debug log');
    log.info('This is an info log');
    log.warn('This is a warning log');
    log.error('This is an error log');
  }, []);
  return (
    <Router />
  );
}

export default App;
