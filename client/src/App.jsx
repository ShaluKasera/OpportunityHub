import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import ForgetPassword from './pages/Auth/ForgetPassword';
import Signup from './pages/Auth/Signup';
import Detail from './pages/JobDetails/Detail';
import Profile from './pages/Auth/Profile';
import EmailVerification from './pages/Auth/EmailVerification';
import JobPage from './pages/Jobs/JobPage';
import PostJob from './pages/Employer/PostJob';

function App() {
 

  return (
   <BrowserRouter>
   <Routes> 
    <Route path='/' element={<Home/>}/>
    <Route path='/forgetPassword' element={<ForgetPassword/>}/>
    <Route path='/signup' element={<Signup/>}/>
      <Route path="/job-details/:id" element={<Detail />} />
       <Route path='/profile' element={<Profile/>}/>
       <Route path='/job' element={<JobPage/>}/>
       <Route path='/post-job' element={<PostJob/>}/>
        <Route path='/verify-email' element={<EmailVerification/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
