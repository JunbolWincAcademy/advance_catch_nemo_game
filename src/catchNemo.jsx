import { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

export const CatchNemo = () => {
  const [fishPosition, setFishPosition] = useState(50);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(400);
  const [catchCount, setCatchCount] = useState(0);
  const [message, setMessage] = useState('');
  const [gamePaused, setGamePaused] = useState(false); // New state to control game pause

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        // Only move the fish if the game is not paused
        setFishPosition((prevPosition) => {
          let newPosition = prevPosition + 5 * direction;
          if (newPosition >= 95 || newPosition <= 5) {
            setDirection(-direction);
          }
          return newPosition;
        });
      }
    }, speed);

    return () => clearInterval(interval);
  }, [direction, speed, gamePaused]); // Include gamePaused in the dependency array

  const handleFishClick = () => {
    if (!gamePaused) {
      // Ignore clicks if the game is paused
      setCatchCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 1) {
          setMessage('You caught Nemo once!');
        } else if (newCount === 2) {
          setMessage('You caught Nemo twice!');
        } else if (newCount === 3) {
          setMessage('You caught Nemo 3 times, well done! Game Over!');
          setGamePaused(true); // Pause the game
          setFishPosition(50); // Reset fish to center
          setTimeout(() => {
            setSpeed(400);
            setCatchCount(0);
            setDirection(1);
            setMessage('');
            setGamePaused(false); // Resume the game after 5 seconds
          }, 3000); // 5-second pause before resetting for a new game
          return newCount;
        }

        // Double the speed of the fish by halving the interval time for the first two catches
        if (newCount < 3) {
          setSpeed((prevSpeed) => Math.max(prevSpeed / 2, 25));
        }

        return newCount;
      });
    }
  };

  return (
    <>
      <Box w="600px" h="300px" bg="lightblue" position="relative" overflow="hidden" display="flex" justifyContent="center" alignItems="center">
        <Text mb="10rem" fontSize="xl" textAlign="center">
          {message}
        </Text>
        <Box
          onClick={handleFishClick}
          as="span"
          position="absolute"
          left={`${fishPosition}%`}
          cursor="pointer"
          userSelect="none"
          fontSize="60px"
          transform={direction === -1 ? 'scaleX(1)' : 'scaleX(-1)'}
        >
          🐠
        </Box>
      </Box>
    </>
  );
};
