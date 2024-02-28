import { useState, useEffect } from 'react'; // Importing useState and useEffect hooks from React
import { Box, Text } from '@chakra-ui/react'; // Importing Box and Text components from Chakra UI

export const CatchNemo = () => { // Defining the CatchNemo functional component
  const [fishPosition, setFishPosition] = useState(50); // State for tracking fish's horizontal position, starting at 50%
  const [direction, setDirection] = useState(1); // State to track fish's direction: 1 for right, -1 for left
  const [speed, setSpeed] = useState(500); // State to track the speed of fish's movement (interval in ms)
  const [catchCount, setCatchCount] = useState(0); // State to track how many times the fish has been caught
  const [message, setMessage] = useState(''); // State to display messages to the user
  const [gamePaused, setGamePaused] = useState(false); // State to control game pause
  const [bubbleSize, setBubbleSize] = useState("2rem"); // Initial size
  const [bubbleOpacity, setBubbleOpacity] = useState(0.5); // Initial opacity


  useEffect(() => { // useEffect hook to handle fish movement logic
    const interval = setInterval(() => { // Setting up an interval to update fish's position, this will behave like a loop cycle
      if (!gamePaused) { // Only execute if the game is not paused
        // Logic to update fish's position
        setFishPosition((prevPosition) => {
          let newPosition = prevPosition + 5 * direction; // Calculate new position based on direction
          if (newPosition >= 80 || newPosition <= 5) { // Check if fish hits the boundary
            setDirection(-direction); // Reverse direction if boundary is hit
          }
          return newPosition; // Update fish's position
        });
      }
    }, speed); // Interval is controlled by the speed state

    return () => clearInterval(interval); // Clear interval on component unmount or when dependencies change
  }, [direction, speed, gamePaused]); // Dependencies array for useEffect

  const handleFishClick = () => { // Function to handle fish click events
    if (!gamePaused) { // Only process clicks if the game is not paused
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
      >
        <Text mb="10rem" fontSize="xl" textAlign="center">
          {message} {/* Display dynamic messages to the player*/}
        </Text>
        <Box 
          as="span"
          position="absolute" // Absolute position for the bubble to follow the fish
          bg="white" // Background color for the bubble
          borderRadius="50%" // Make the bubble circular
          boxSize={bubbleSize} // Dynamically set the size of the bubble
          borderColor="blue" // Border color for the bubble
          border="4px" // Border thickness for the bubble
          opacity={bubbleOpacity}// Dynamically set the for the bubble
          zIndex="1" // Ensure the bubble is rendered below the fish
          left={`${fishPosition}%`} // Position the bubble based on the fish's current position
          transform={direction === -1 ? 'scaleX(1)' : 'scaleX(-1)'} // Flip the bubble based on fish's direction
        >
        </Box>
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
    </>
  );
};