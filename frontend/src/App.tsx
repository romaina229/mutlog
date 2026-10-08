import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicHomePage } from './pages/public/PublicHomePage'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
