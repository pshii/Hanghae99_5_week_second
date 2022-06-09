import './App.css';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'
import styledComponents from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Main from './Main';
import HomeIcon from '@mui/icons-material/Home';
import Login from './Login';
import SignUp from './SignUp';
import Detail from './Detail';
import Write from './Write';
import Update from './Update';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './shared/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { getDocs, where, query, collection } from 'firebase/firestore';
import { db } from './shared/firebase'
import { saveUser } from './redux/Slice/User';
function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state);
  const navigate = useNavigate();
  const [is_login, setIs_login] = React.useState(false);
  const [user_nick, setUser_nick] = useState(user.nick);


  const loginCheck = async (user) => {
    if (user) {
      setIs_login(true)
      const user_docs = await getDocs(
        query(collection(db, "users"), where("user_id", "==", auth.currentUser.email))
      );  
      let _user = [];

      user_docs.forEach(u => {
        setUser_nick(u.data().nick)      
        _user.push({ user_id: u.data().user_id, nick: u.data().nick })
      })
      dispatch(saveUser(_user))
    }
    else
      setIs_login(false)
  }
  React.useEffect(() => {
    onAuthStateChanged(auth, loginCheck)

  }, [])

  return (
    <div className="App">
      <div className='container' style={{ maxWidth: "1000px", margin: "auto" }} >
        {is_login ? <NavBar>
          <HomeIcon style={{ color: '#6c757d', cursor: "pointer" }} onClick={() => { navigate('/') }} />
          <div style={{ color: "white" }}>{user_nick}님 환영합니다.</div>
          <div className='btn-box'  >
            <Button variant="outline-secondary">내정보</Button>{' '}
            <Button variant="outline-secondary" >알림</Button>{' '}
            <Button variant="outline-secondary" onClick={() => {
              signOut(auth);
              navigate('/login');
            }}>로그아웃</Button>{' '}
          </div>
        </NavBar>
          : <NavBar>
            <HomeIcon style={{ color: '#6c757d', cursor: "pointer" }} onClick={() => { navigate('/') }} />
            <div className='btn-box'  >
              <Button variant="outline-secondary" onClick={() => { navigate('/signup') }}>회원가입</Button>{' '}
              <Button variant="outline-secondary" onClick={() => { navigate('/login') }} >로그인</Button>{' '}
            </div>
          </NavBar>
        }


        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/update/:id' element={<Update nick={user_nick}/>} />
          <Route path='/write' element={<Write nick={user_nick} />} />
          <Route path='/detail/:id' element={<Detail nick={user_nick} />} />
        </Routes>
      </div>

    </div>
  );
}

const NavBar = styledComponents.div`
  width : 100%;
  background-color : rgb(50,50,50);
  height : 80px;
  display : flex;
  align-items: center;
  justify-content: space-around;
`;





export default App;
