import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import RequireAuth from './auth/RequireAuth';
import Dashboard from './pages/Home';

function App() {
  return (
    <div className="App">
       <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/' exact element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
            />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
