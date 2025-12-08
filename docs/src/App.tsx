import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GettingStarted from './pages/GettingStarted'
import Strategies from './pages/Strategies'
import Configuration from './pages/Configuration'
import Examples from './pages/Examples'
import ApiReference from './pages/ApiReference'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/api-reference" element={<ApiReference />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

