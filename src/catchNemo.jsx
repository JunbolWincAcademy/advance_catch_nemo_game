// Importing useState and useEffect hooks from React
import { useState, useEffect } from 'react';
// Importing Box and Text components from Chakra UI
import { Center, Flex, Box, Text, Heading, Button } from '@chakra-ui/react';

export const CatchNemo = () => {
  const [gameActive, setGameActive] = useState(false); // ✅ New state to control game activation
  // State for tracking fish's horizontal position, starting at 50%
  const [fishPosition, setFishPosition] = useState(45);
  // State to track fish's direction: 1 for right, -1 for left
  const [direction, setDirection] = useState(1);
  // State to track the speed of fish's movement (interval in ms)
  const [speed, setSpeed] = useState(500);
  // State to track how many times the fish has been caught
  const [catchCount, setCatchCount] = useState(0);
  // State to display messages to the user
  const [message, setMessage] = useState('');
  // State to control game pause
  const [gamePaused, setGamePaused] = useState(false);
  //✅ State array to manage multiple bubbles, each with size, opacity, and an ID
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    if (!gameActive) {
      return; // Exit early if the game isn't active
    }
    // Interval for moving the fish, as previously described
    const fishMovementInterval = setInterval(() => {
      if (!gamePaused) {
        setFishPosition((prevPosition) => {
          let newPosition = prevPosition + 5 * direction;
          if (newPosition >= 80 || newPosition <= 5) {
            setDirection(-direction);
          }
          return newPosition;
        });
      }
    }, speed);

    // Interval for adding new bubbles
    const bubbleCreationInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        // Adjust this threshold as desired
        const bubbleStartPosition = fishPosition - (direction === 1 ? -17 : 7);
        setBubbles((currentBubbles) => [...currentBubbles, { id: Math.random(), size: 1, opacity: 1, left: bubbleStartPosition }]);
      }
    }, 510); // Adjust this to control how frequently new bubbles are added

    //✅ Missing piece: Updating bubbles to grow and fade
    const bubbleUpdateInterval = setInterval(() => {
      setBubbles(
        (currentBubbles) =>
          currentBubbles
            .map((bubble) => ({
              ...bubble,
              size: bubble.size + 0.3, // Increment size to simulate growth
              opacity: Math.max(bubble.opacity - 0.05, 0), // Decrement opacity to simulate fading
            }))
            .filter((bubble) => bubble.opacity > 0) // Remove bubbles that have completely faded
      );
    }, 100); // Adjust this to control the rate of growth and fading

    // Cleanup function to clear all intervals
    return () => {
      clearInterval(fishMovementInterval);
      clearInterval(bubbleCreationInterval);
      clearInterval(bubbleUpdateInterval); // Ensure to clear this interval as well
    };
  }, [fishPosition, direction, gamePaused, speed, gameActive]); // Include all dependencies, I need to understand why this array is needed
   // Function to start the game
   const startGame = () => {
    setGameActive(true); // ✅ Trigger game start
  };

  // All other existing code remains unchanged...
  const handleFishClick = () => {
    // Function to handle fish click events
    if (!gamePaused) {
      // Only process clicks if the game is not paused
      // Logic to update catch count and display messages
      setCatchCount((prevCount) => {
        const newCount = prevCount + 1; // Increment catch count
        // Update message based on the number of catches
        if (newCount === 1) {
          setMessage('You caught Nemo once!');
        } else if (newCount === 2) {
          setMessage('You caught Nemo twice!');
        } else if (newCount === 3) {
          setMessage('You caught Nemo 3 times, well done! Game Over!');
          setGamePaused(true); // Pause the game after 3 catches
          setFishPosition(50); // Reset fish to center
          // Set a timeout to reset the game after 3 seconds
          setTimeout(() => {
            setSpeed(400); // Reset speed
            setCatchCount(0); // Reset catch count
            setDirection(1); // Reset direction
            setMessage(''); // Clear message
            setGamePaused(false); // Unpause the game
          }, 3000); // 3-second pause before game reset
          return newCount;
        }
        // Double the fish's speed by halving the interval time for the first two catches
        if (newCount < 3) {
          setSpeed((prevSpeed) => Math.max(prevSpeed / 2, 25)); // Ensure speed doesn't go below a threshold
        }
        return newCount; // Return the updated catch count
      });
    }
  };

  return (
    <>
      <Center flexDir="column">
        <Flex mb="2rem">
          <Heading>Catch</Heading>
          <Heading color="orange" mr="2">
            Nemo
          </Heading>

          {!gameActive && ( // ✅ Conditionally render the "Start" button
            <Button
              _hover={{ bg: 'orange' }}
              ml="2"
              size="md"
              onClick={startGame} // ✅ Attach startGame function to button click
            >
              Start
            </Button>
          )}
        </Flex>
        <Box
          w="600px" // Set the width of the game area
          h="300px" // Set the height of the game area
          bg="lightblue" // Set the background color of the game area
          borderRadius="2rem" // Round the corners of the game area
          position="relative" // Position context for absolutely positioned children
          overflow="hidden" // Prevent children from overflowing the game area boundaries
          display="flex" // Use flexbox layout for centering
          justifyContent="center" // Center children horizontally
          alignItems="center" // Center children vertically
          borderWidth="1rem"
          borderTopColor="white"
          borderLeftColor="black"
          borderRightColor="black"
          borderBottomColor="black"
          // borderWidth="2rem"
        >
          <Text mb="10rem" fontSize="xl" textAlign="center">
            {message} {/* Display dynamic messages to the player*/}
          </Text>
          {/*✅ Render bubbles */}
          {bubbles.map((bubble) => (
            <Box
              key={bubble.id} // Ensure each bubble has a unique key
              as="span"
              zIndex="1"
              position="absolute"
              bg="white"
              borderRadius="50%"
              width={`${bubble.size}rem`} // Apply dynamic size
              height={`${bubble.size}rem`} // Apply dynamic size
              opacity={bubble.opacity} // Apply dynamic opacity
              left={`${bubble.left}%`} // Apply dynamic left positioning based on fish position
              bottom="50%" // Position at the bottom of the container; adjust as needed
            />
          ))}

          <Box
            onClick={handleFishClick} // Attach an onClick event handler to catch the fish
            as="span"
            position="absolute" // Absolute position for the fish within the game area
            left={`${fishPosition}%`} // Dynamically set the horizontal position of the fish.When you use left in conjunction with position: absolute;
            // it defines how far to the right the element should be placed from the nearest positioned ancestor.
            // The % unit means the position is set as a percentage of the width of the fish's parent container (Box representing the fishbowl).
            // This allows for responsive positioning based on the container's size.
            cursor="pointer" // Change the cursor to a pointer to indicate it's clickable
            userSelect="none" // Prevent the fish emoji from being selected
            fontSize="60px" // Set the size of the fish emoji
            transform={direction === -1 ? 'scaleX(1)' : 'scaleX(-1)'} // Flip the fish emoji based on its direction
          >
            🐠{/* // Fish emoji representing the fish */}
          </Box>
        </Box>
      </Center>
    </>
  );
};
