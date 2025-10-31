import {Routes,Route} from 'react-router-dom'
import Home from './pages/homepage.jsx'
import Login from './pages/login.jsx'
import Emailverify from './pages/emailverify.jsx'
import Passwordreset from './pages/passwordreset.jsx'
function App(){
  return(
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<Emailverify/>}/>
        <Route path='/password-reset' element={<Passwordreset/>}/>
      </Routes>
    </div>
  ) 
  
}
export default App