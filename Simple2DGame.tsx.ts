import { useState, useEffect, useCallback } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"
import { Star, X } from "lucide-react"

type Position = {
  x: number
  y: number
}

type GameItem = Position & {
  type: 'item' | 'obstacle'
  id: string
}

export default function Simple2DGame() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [items, setItems] = useState<GameItem[]>([])
  const [obstacles, setObstacles] = useState<GameItem[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const gridSize = 10

  // Initialize game elements
  const initializeGame = useCallback(() => {
    // Place player at random position
    setPlayerPos({
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    })

    // Generate 5 items at random positions
    const newItems: GameItem[] = []
    for (let i = 0; i < 5; i++) {
      newItems.push({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        type: 'item',
        id: `item-${i}`
      })
    }

    // Generate 3 obstacles at random positions
    const newObstacles: GameItem[] = []
    for (let i = 0; i < 3; i++) {
      newObstacles.push({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        type: 'obstacle',
        id: `obstacle-${i}`
      })
    }

    setItems(newItems)
    setObstacles(newObstacles)
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }, [])

  // Handle keyboard input
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) return

      e.preventDefault()
      const newPos = { ...playerPos }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (newPos.y > 0) newPos.y--
          break
        case 'ArrowDown':
        case 's':
          if (newPos.y < gridSize - 1) newPos.y++
          break
        case 'ArrowLeft':
        case 'a':
          if (newPos.x > 0) newPos.x--
          break
        case 'ArrowRight':
        case 'd':
          if (newPos.x < gridSize - 1) newPos.x++
          break
      }

      setPlayerPos(newPos)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerPos, gameStarted, gameOver])

  // Check for collisions and item collection
  useEffect(() => {
    if (!gameStarted || gameOver) return

    // Check for item collection
    const collectedItemIndex = items.findIndex(
      item => item.x === playerPos.x && item.y === playerPos.y
    )

    if (collectedItemIndex !== -1) {
      setScore(prev => prev + 1)
      setItems(prev => prev.filter((_, i) => i !== collectedItemIndex))
      
      // Add new item when one is collected
      if (items.length - 1 === 0) {
        setItems(prev => [
          ...prev,
          {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
            type: 'item',
            id: `item-${Date.now()}`
          }
        ])
      }
    }

    // Check for obstacle collision
    const hitObstacle = obstacles.some(
      obstacle => obstacle.x === playerPos.x && obstacle.y === playerPos.y
    )

    if (hitObstacle) {
      setGameOver(true)
    }
  }, [playerPos, items, obstacles, gameStarted, gameOver])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Simple 2D Game</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gameStarted ? (
          <div className="text-center space-y-4">
            <p>Use arrow keys or WASD to move. Collect stars and avoid X marks.</p>
            <Button onClick={initializeGame}>Play Game</Button>
          </div>
        ) : gameOver ? (
          <div className="text-center space-y-4">
            <p className="text-xl font-bold">Game Over!</p>
            <p>Your score: {score}</p>
            <Button onClick={initializeGame}>Play Again</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p>Score: {score}</p>
              <Button variant="outline" onClick={() => setGameStarted(false)}>
                Quit
              </Button>
            </div>
            <div 
              className="grid border border-gray-300 rounded-md overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                aspectRatio: '1/1'
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const x = index % gridSize
                const y = Math.floor(index / gridSize)
                const isPlayer = x === playerPos.x && y === playerPos.y
                const cellItem = items.find(item => item.x === x && item.y === y)
                const cellObstacle = obstacles.find(obs => obs.x === x && obs.y === y)

                return (
                  <div 
                    key={index}
                    className={`aspect-square border border-gray-200 flex items-center justify-center ${isPlayer ? 'bg-blue-500' : ''}`}
                  >
                    {isPlayer && (
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    )}
                    {cellItem && !isPlayer && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    {cellObstacle && !isPlayer && (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="text-sm text-gray-500">
              <p>Controls: Arrow keys or WASD to move</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  <span>Player</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                  <span>Collect (+1)</span>
                </div>
                <div className="flex items-center">
                  <X className="w-4 h-4 text-red-500 mr-2" />
                  <span>Avoid (Game Over)</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}