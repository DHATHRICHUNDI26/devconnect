import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoute";
function app(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" 
      element={
      <ProtectedRoute>
         <Dashboard/>
      </ProtectedRoute>
      }
      />
      <Route path="/profile" 
      element={
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
      }
      />
    </Routes>
    </BrowserRouter>
  )
}
export default app;