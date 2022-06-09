import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaRegHeart, FaGrin } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import styledComponents from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Comment from './Comment';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from './shared/firebase';
import { saveComment } from './redux/Slice/CommentSlice';
import moment from 'moment';
const Detail = ({ nick }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [tab, setTab] = useState(false);
    const inputRef = React.useRef('');
    const [megazine, setMegazine] = useState({})

    const loadOneMegazineFB = async () => {
        const docRef = doc(db, "megazine", id);
        const megazine = (await getDoc(docRef)).data();
        setMegazine({ ...megazine, id: docRef.id })
    }
    React.useEffect(() => {
        loadOneMegazineFB();
    }, [])

    const createCommentFB = async () => {
        const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');

        const docRef = await addDoc(collection(db, "comments"), { 
            content: inputRef.current.value,
            nick: nick,
            time: nowTime,
            id: id
        })

        const comment = {
            content: inputRef.current.value,
            nick: nick,
            time: nowTime,
            id: id,
        }
        dispatch(saveComment(comment));
    }

    return (
        <Box>
            <TitleBox>
                <div style={{ display: "flex" }}>
                    <div style={{ margin: "0 5px" }}><FaGrin size={24} color={"#6c757d"} /></div>
                    <div>{megazine.nick}</div>
                </div>
                <div>{megazine.time}</div>
            </TitleBox>
            <ContentBox position={megazine.position}>
                <div style={{ margin: "auto" }} ><span>{megazine.content}</span></div>
                <img src={megazine.img_url}></img>
            </ContentBox>
            <FooterBox>
                <div>
                    <span style={{ marginRight: "5px" }}>좋아요 {megazine.liked}개</span>
                    <Span onClick={() => {
                        setTab(!tab);
                    }} >댓글 0개</Span>
                    
                </div>
                <FaRegHeart size={24} color={"#6c757d"} />
            </FooterBox>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Input ref={inputRef} placeholder='댓글을 입력하세요' />
                <Button onClick={() => {
                    createCommentFB();
                }} variant="secondary" style={{ marginLeft: "20px" }}>등록</Button>{' '}
            </div>
            <Comment tab={tab} id={id} />
        </Box>
    );
}

const Box = styledComponents.div`
    border: 5px solid rgba(50,50,50);
    border-radius : 20px;
    margin : 10px 0;
    background : rgba(150,150,150,0.2);
`;

const TitleBox = styledComponents.div`
    width:100%;
    height : 50px;
    display: flex;
    justify-content : space-around;
    align-items: center;
    border-bottom : 2px solid black;
    @media screen and (max-width: 768px){   
        & > div> div {
            transform : scale(80%);
        }
    }
`;
const ContentBox = styledComponents.div`
    width : 100%;
    border-bottom : 2px solid black;
    display :flex;                     // 기본 flex 가 텍스트가 왼쪽,
    display : ${(props) => props.position === 'top' ? "block" : null};      // top일 경우 block하면 텍스트가 위로
    flex-direction : ${(props) => props.position === 'right' ? "row-reverse" : null};  // right일 경우 방향만 바꾸기
    & > img {
        width :  ${(props) => props.position === 'top' ? "100%" : "50%"};
    }
    
    div>div>div>div {
        ${(props) => props.position === 'top' ? "none" : "none"}
    }


    @media screen and (max-width: 768px){   
        &{
            display: block;
        }
        & > img { 
            width :100%;
        }
    }
`;

const FooterBox = styledComponents.div`
    border:1px solid black; 
    height : 50px;
    width: 100%;
    margin:auto;
    display : flex;
    justify-content: space-between;
    align-items : center;
    padding : 0 50px;
`;

const Input = styledComponents.input`
    outline : none;
    border: 2px solid rgba(108,117,125,0.3);
    border-radius: 5px;
    height : 40px;
    transition : .5s;
    width : 60%;    
    padding : 10px;
    &:focus {
        border: 2px solid rgba(108,117,125,0.8);
    }
`;
const Span = styledComponents.span`
    border:1px solid rgba(108,117,125,1);
    padding : 10px;
    border-radius: 20px;
    color: white;
    background-color : rgba(108,117,125,0.5);
    transition: .5s;
    cursor : pointer;
    
    &: hover{
        background-color : rgba(108,117,125,1);
        
    }
`;
export default Detail;