import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Redirect to game-pro.html
    window.location.href = '/game-pro.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">UFO Tank 3D Pro</h1>
        <p className="text-gray-400">Loading game...</p>
      </div>
    </div>
  );
}

export default App;
