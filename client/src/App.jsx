import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing  from './pages/Landing'
import Auth     from './pages/Auth'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="*"       element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App