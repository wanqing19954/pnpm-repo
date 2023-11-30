import './index.css';
import { isBlank, getCounter } from 'common';

function App() {
  const counter = getCounter(1, 2);
  return (
    <>
      <p>Counter - {counter}</p>
      <p>undefined isBlank - {isBlank(undefined) ? 'true' : 'false'}</p>
      <p>false isBlank - {isBlank(false) ? 'true' : 'false'}</p>
      <p>true isBlank - {isBlank(true) ? 'true' : 'false'}</p>
      <p>Empty object isBlank - {isBlank({}) ? 'true' : 'false'}</p>
    </>
  );
}

export default App;
