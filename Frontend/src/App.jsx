import { Routes, Route } from 'react-router-dom';
import Signup from './Auth/SignUp';
import Login from './Auth/Login';
import Logout from './Auth/LogOut';
import Landing from './Pages/Landing';
import Error from './Pages/Error';
import Theme from './Utilities/Theme';

function App() {
  return (
    <>
    <Theme/>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/api/auth/signup" element={<Signup />} />
      <Route path="/api/auth/login" element={<Login />} />
      <Route path="/api/auth/logout" element={<Logout />} />
      <Route path='*' element={<Error />} />
    </Routes>
    </>
  );
}

export default App;