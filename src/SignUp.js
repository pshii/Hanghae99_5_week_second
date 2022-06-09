import React from 'react';
import { Button } from 'react-bootstrap';
import styledComponents from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {auth} from './shared/firebase'
import {collection, addDoc} from 'firebase/firestore';
import { db } from './shared/firebase';
import { Alert } from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { saveUser } from './redux/Slice/User';

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id_ref = React.useRef(null);
    const pw1_ref = React.useRef(null);
    const pw2_ref = React.useRef(null);
    const nick_ref = React.useRef(null);

    const regExpId = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    const regExpPw = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/;
			// 알파벳+숫자@알파벳+숫자.알파벳+숫자 
            // 8~10 자 영문,숫자 조합		
    const sign_Up = async () => {
        if (!regExpId.test(id_ref.current.value) || id_ref.current.value===''){
            alert('올바른 이메일 형식이 아닙니다!')
            return;
        }
        if (!regExpPw.test(pw1_ref.current.value) || pw1_ref.current.value===''){
            alert('올바른 비밀번호 형식이 아닙니다!')
            return;
        }
        if (pw1_ref.current.value !== pw2_ref.current.value){
            alert('비밀번호가 일치하지 않습니다!')
            return;
        }
        if (nick_ref.current.value === ''){
            alert('닉네임을 입력해주세요')
            return;
        }

        const user = await createUserWithEmailAndPassword(auth, id_ref.current.value,pw1_ref.current.value);     // 비동기 통신,공백 제거     
        console.log(user)

        const user_doc = await addDoc(collection(db, "users"),{
            user_id:user.user.email, 
            nick: nick_ref.current.value,     
          });
        

        dispatch(saveUser({ user_id:user.user.email, nick:nick_ref.current.value }))


        alert('회원가입이 완료되었습니다!')
        navigate('/login')
    }

    return (
        <div style={{ marginTop: "50px", textAlign: "left" }}>
            <h1>회원가입</h1>
            <label />아이디
            <Input ref={id_ref} placeholder='아이디를 입력하세요'/>
            <label />닉네임
            <Input ref={nick_ref}placeholder='닉네임를 입력하세요'/>
            <label />비밀번호
            <Input ref={pw1_ref} type="password" placeholder='비밀번호를 입력하세요'/>
            <Alert severity="error">8~10 영문,숫자 조합으로 입력하세요</Alert>
            <label />비밀번호 확인
            <Input ref={pw2_ref} type="password" placeholder='비밀번호를 다시 입력하세요'/>
            
            <Button variant="secondary" style={{width:"100%", marginTop:"20px"}} onClick={sign_Up} >회원가입하기</Button>{' '}
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

export default SignUp;