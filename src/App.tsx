import { Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import RestTimerBar from './components/RestTimerBar'
import Home from './screens/Home'
import Day from './screens/Day'
import Library from './screens/Library'
import Water from './screens/Water'
import Fuel from './screens/Fuel'
import Reference from './screens/Reference'

export default function App() {
  return (
    <div className="mx-auto min-h-full max-w-md pb-24">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/:dayId" element={<Day />} />
        <Route path="/library" element={<Library />} />
        <Route path="/water" element={<Water />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/reference" element={<Reference />} />
      </Routes>
      <RestTimerBar />
      <BottomNav />
    </div>
  )
}
