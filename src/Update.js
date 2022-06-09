import React,{ useState } from 'react';
import styledComponents from 'styled-components';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import { db,storage } from './shared/firebase';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import { doc,getDoc, updateDoc} from "firebase/firestore";

const Update = (props) => {
    const navigate = useNavigate();
    const {id} = useParams();
    const imageInput = React.useRef(null);
    const [fileImage, setFileImage] = useState('');
    const [fileName, setFileName] = useState('');
    const [title, setTitle] = useState('');
    const [x,setX] = useState('');
    const contentRef = React.useRef(null);
    const [btnState, setBtnState] = useState(true);
    const [megazine, setMegazine] = useState({})

    React.useEffect(()=>{
        loadOneMegazineFB()
    },[])
    const loadOneMegazineFB = async ()=>{
        const docRef = doc(db, "megazine", id);
        const megazine = (await getDoc(docRef)).data();

        setMegazine({ ...megazine, id: docRef.id })
    }

    const handleInput = () => {
        contentRef.current.value ? setBtnState(false) : setBtnState(true);
    }

    const clickImgUpload = () =>{
        imageInput.current.click();
    }
    const saveFileImage = (file) => {                          // 이미지 미리보기
        setFileImage(URL.createObjectURL(file));    
    };

    
    const inputFileText = () => {
        const file = imageInput.current.files[0];
        
        saveFileImage(file)
        
        const temp = imageInput.current.value.split('\\');   // 문자열 자르기
        const splitedtext = temp[temp.length-1];
        setFileName(splitedtext);
    }
    const inputText = (e) => {              // 텍스트area 문자열 가져오기
        setTitle(e.target.value);
    }
    const ClickRadioBtn = (e) => {
        setX(e.target.value)
    }

    const updateMegazineFB = async () => {
        const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');

        let file_url = '';
        if (imageInput.current.value ){
            const file = imageInput?.current.files[0];
            const uploaded_file = await uploadBytes(
                ref(storage, `images/${file.name}`),    // 파일이름
                file                                    //  파일
                );                                      // ref로 다운로드url에 씀
    
            file_url = await getDownloadURL(uploaded_file.ref);
        }

        
        const docRef = doc(db,  "megazine", id)
        
        console.log(megazine)

        const _megazine = {
            content: contentRef.current.value,
            nick : props.nick,
            time : nowTime,
            img_url : file_url  ? file_url : megazine.img_url,
            liked: 0,
            position : x,
            id: docRef.id,
        } 

        await updateDoc(docRef, _megazine) 
       
       // 수정페이지에서 기능 더 안할꺼니 리덕스는 생략
        // dispatch(updateMegazine(_megazine));
        navigate('/');

    }
    return (
        <div style={{ marginTop: "50px", textAlign: "left" }}>
            <h1>게시글 수정</h1>
            <Input type="file" ref={imageInput} 
            onChange={()=>{
                inputFileText(); 
                handleInput();
            }} style={{display:"none"}}/>
            <Button variant="secondary" style={{ height: "45px" ,margin:"10px"}} 
                onClick={()=>{clickImgUpload()}} >파일찾기</Button>{' '}
            <span style={{ fontWeight:"bold"}}>{fileName}</span>
            <h4 style={{marginTop:"10px"}}>레이아웃 고르기</h4>
            
            
            <label >
            <input type="radio" style={{margin:"10px 0"}} onChange={ClickRadioBtn}
                value="left"
                checked = {x ==="left"}
            />
                오른쪽에 이미지 왼쪽에 텍스트</label>
            <ContentBox className=''>
                <div className='title' style={{ margin: "auto" }} ><span>{title? title :megazine.content}</span></div>
                {fileImage? <img src={fileImage}></img>: <img src={megazine.img_url}/> }
            </ContentBox>
            
            <label>
            <input type="radio" style={{margin:"10px 0"}} onChange={ClickRadioBtn}
                value="right"
                checked = {x ==="right"}
            />
                왼쪽에 이미지 오른쪽에 텍스트</label>
            <ContentBox className='text-right'>
                <div className='title' style={{ margin: "auto" }} ><span>{title? title :megazine.content}</span></div>
                {fileImage? <img src={fileImage}></img>: <img src={megazine.img_url}/> }
            </ContentBox>

            <label>
            <input type="radio" style={{margin:"10px 0"}} onChange={ClickRadioBtn}
                value="top"
                checked = {x ==="top"}
            />
                하단에 이미지 상단에 텍스트</label>
            <ContentBox className='text-top'>
                <div className='title' style={{ margin: "auto" }} ><span>{title? title :megazine.content}</span></div>
                {fileImage? <img style={{width:"100%"}} src={fileImage}></img>: <img src={megazine.img_url} style={{width:"100%"}}/> }
            </ContentBox>
            
            <p style={{marginTop:"30px"}}>게시물 내용</p>
            <TextArea ref={contentRef}  defaultValue={megazine.content}
            onChange={(e)=>{
                inputText(e);
                handleInput();
            }}/>
            <Button variant="secondary" style={{width:"100%", marginTop:"20px"}}
            onClick = {()=>{updateMegazineFB()}}
            disabled={btnState}

            >게시글수정</Button>{' '}
        </div>
    );
}

const Input = styledComponents.input`
    margin : 20px 0;
    outline : none;
    border: 2px solid rgba(108,117,125,0.3);
    border-radius: 5px;
    height : 45px;
    transition : .5s;
    width : 30%;    
    padding : 10px;
    &:focus {
        border: 2px solid rgba(108,117,125,0.8);
    }
`;
const ContentBox = styledComponents.div`
    width : 100%;
    height : 40vh;
    display : flex;
    & > div {
        width : 50%;
        text-align:center;
    }
    & > img {
        width : 50%;
        height : 100%;
    }
    
    
`;
const TextArea = styledComponents.textarea`
    width: 100%;
    height: 300px;
    outline : none;
    border: 2px solid rgba(108,117,125,0.3);
    border-radius: 5px;
    transition : .5s;
    padding : 10px;
    &:focus {
        border: 2px solid rgba(108,117,125,0.8);
    }
`;
export default Update;