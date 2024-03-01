import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { CatchNemo } from './catchNemo';
import { Center} from '@chakra-ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Center>
        <CatchNemo />
      </Center>
    </>
  );
}

export default App;
