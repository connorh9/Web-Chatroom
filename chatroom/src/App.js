import './App.css';
import WebAppRouter from "./components/nav/WebAppRouter.jsx"
import * as React from 'react';
import { ThemeProvider } from './components/ThemeContext';

function App() {
  return (
    <>
      <ThemeProvider>
        <WebAppRouter/>
      </ThemeProvider>
    </>
  );
}

export default App;
