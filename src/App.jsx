import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { CatchNemo } from './catchNemo';
import { Center, Flex,Heading } from '@chakra-ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Center flexDir="column">
    <Flex>
    <Heading>Catch</Heading>
    <Heading color="orange">Nemo</Heading>
    </Flex>
    <CatchNemo />
    </Center>
    </>

  );
}

export default App;
