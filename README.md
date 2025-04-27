This game includes:

**Game Grid: **
A 10x10 grid where the game takes place

**Player Controls:**
Move with arrow keys or WASD
Player is represented by a blue circle

**Items to Collect:**
Yellow stars that increase your score
New items spawn when you collect existing ones

**Obstacles to Avoid:**
Red X marks that end the game if touched

**Game State:**
Score tracking
Game over detection
Restart functionality

**UI Elements:**
Score display
Game controls legend
Start/restart buttons
Game over screen

**The game uses:**

React state management for game state
TypeScript for type safety
Tailwind CSS for styling
Shadcn UI components for buttons and cards
Lucide React for icons
Keyboard event listeners for controls
The game is fully responsive and works on both desktop and mobile (though mobile would need touch controls added for better experience). The game loop is handled through React's useEffect hooks that respond to player movement and check for collisions/collections.
