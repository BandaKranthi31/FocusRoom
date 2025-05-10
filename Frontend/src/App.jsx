import { Routes, Route } from 'react-router-dom';
import Signup from './Auth/SignUp';
import Login from './Auth/Login';
import Logout from './Auth/LogOut';
import Landing from './Pages/Landing';
import Error from './Pages/Error';
import Theme from './Utilities/Theme';
import { Toaster } from 'react-hot-toast'
import DashBoard from './Pages/DashBoard';

function App() {
  return (
    <>
      <Theme />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path='*' element={<Error />} />
        <Route path='dashboard' element = {<DashBoard/>}/>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;