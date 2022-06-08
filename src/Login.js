import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import styledComponents from 'styled-components';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from './shared/firebase';
import {useNavigate} from 'react-router-dom'
import { useState } from 'react';
import {getDocs, where, query, collection} from 'firebase/firestore';
import { db } from './shared/firebase';
import { useDispatch } from 'react-redux';
import { saveUser } from './redux/Slice/User';
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [inputText, setInputText] = useState(true);
    const id_ref = React.useRef(null);
    const pw_ref = React.useRef(null);
    // if (id_ref.current.value !== '' && pw_ref.current.value !== ''){
    //     setInputText(false)
    // }
    const handleInput = (e) => {
        id_ref.current.value && pw_ref.current.value ? setInputText(false) : setInputText(true)
    }
    const log_in = async () => {
        if (id_ref.current.value === '') {
            alert('아이디를 입력하세요!')
            return;
        }
        if (pw_ref.current.value === '') {
            alert('비밀번호를 입력하세요!')
            return;
        }
        // const user = await signInWithEmailAndPassword(auth, id_ref.current.value, pw_ref.current.value)
       signInWithEmailAndPassword (auth, id_ref.current.value, pw_ref.current.value)
            .then(async (userCredential) => {
                const user = userCredential.user;
                // console.log(user.email);

                // const user_docs = await getDocs(
                //     query(collection(db,"users"), where("user_id", "==", user.email))
                //     );  // 여러 데이터= 배열을 가져옴

                // let _user = [];
                // user_docs.forEach(u=>{
                //     _user.push({user_id:u.data().user_id, nick:u.data().nick})
                // })
                
                // dispatch(saveUser(_user))
                navigate('/')
            })
            .catch((error) => {
                alert('로그인 정보가 일치하지 않습니다!')
            });


    }
    return (
        <div style={{ marginTop: "50px", textAlign: "left" }}>
            <h1>로그인</h1>
            <label />아이디
            <Input ref={id_ref} onChange={handleInput} placeholder='아이디를 입력하세요' />
            <label />비밀번호
            <Input ref={pw_ref} onChange={handleInput} placeholder='비밀번호를 입력하세요' />
            <Button disabled={inputText} variant="secondary" style={{ width: "100%", marginTop: "20px" }} onClick={() => {
                log_in()
            }} >로그인하기</Button>{' '}
        </div>
    );
}

const Input = styledComponents.input`
    display : block;
    margin : 20px 0;
    outline : none;
    border: 2px solid rgba(108,117,125,0.3);
    border-radius: 5px;
    height : 45px;
    transition : .5s;
    width : 100%;    
    padding : 10px;
    &:focus {
        border: 2px solid rgba(108,117,125,0.8);
    }
`;

export default Login;