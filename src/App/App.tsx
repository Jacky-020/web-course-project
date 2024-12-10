import { useState } from 'react'
import reactLogo from '/src/assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SideNavbar from '../frontend/components/SideNavbar'
import 'bootstrap/dist/css/bootstrap.min.css'


function App(){
  const [count, setCount] = useState(0);

  return (
    <div className='d-flex'>
        <div className="sidebar">
          <SideNavbar />
        </div>

        <div className="main-content">
          <div>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>

          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App/App.tsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
          </div>
        </div>
    </div>
  );
};

export default App;
