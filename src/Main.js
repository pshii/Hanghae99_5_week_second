import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import styledComponents from 'styled-components';
import { FaRegHeart, FaGrin, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getDocs, doc, collection, deleteDoc } from "firebase/firestore";
import { auth, db } from './shared/firebase';
import { deleteMegazine, loadMegazine } from './redux/Slice/Megazine';
import { useState } from 'react';
import {GoPencil} from 'react-icons/go'
const Main = (props) => {
    const megazineList = useSelector(state => state.megazine);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [commentCnt, setCommentCnt] = useState(0);
    const [like, setLike] = useState(false);
    const [_display, _setDisplay] = useState('none');

    React.useEffect(() => {
        loadMegazineFB();
        // loadCommentsFB();
    }, [])

    const loadMegazineFB = async () => {
        const megazine_data = await getDocs(collection(db, "megazine")); 
        let megazine_list = [];
        megazine_data.forEach((m) => {
            megazine_list.push({ id: m.id, ...m.data() });
        });
        dispatch(loadMegazine(megazine_list))
    }

    const clickHeartFB = (id) => {
        if (like) {
            setLike(false)//좋아요 눌렀으면
            _setDisplay('block');
        } else {
            setLike(true);
            _setDisplay('none');

        }
    }
    const deleteMegazineFB = async (id) => {
        const docRef = doc(db, "megazine", id)
        await deleteDoc(docRef);
        dispatch(deleteMegazine(id))
        window.location.reload();
    }

    return (
        <div>
            
            <div style={{ width: "100%", margin: "auto" }}>
                {megazineList.map((m, i) => {
                    return (
                        <Box key={i}>
                            <TitleBox>
                                <div style={{ display: "flex" }}>
                                    <div style={{ margin: "0 5px" }}><FaGrin size={24} color={"#6c757d"} /></div>
                                    <span>{m.nick}</span>
                                </div>
                                <div>{m.time}</div>
                                {auth && auth.currentUser?.email === m.email
                                    ? <div>
                                        <Button variant="outline-secondary" onClick={() => {
                                            navigate(`/update/${m.id}`);}}>수정</Button>
                                        <Button onClick={() => { deleteMegazineFB(m.id) }} variant="outline-secondary">삭제</Button>
                                    </div>
                                    : null}
                            </TitleBox>
                            <ContentBox position={m.position}>
                                <div style={{ margin: "auto" }} ><span>{m.content}</span></div>
                                <img src={m.img_url} onClick={() => { navigate(`/detail/${m.id}`) }} style={{ cursor: "pointer",opacity:"0.8" }}></img>
                            </ContentBox>
                            <FooterBox>
                                <div>
                                    <span style={{ marginRight: "5px" }}>좋아요 {m.liked}개</span>
                                    <span>댓글 {commentCnt}개</span>
                                </div>
                                <Like onClick={() => {
                                    clickHeartFB(m.id);
                                }} >
                                    <div style={{ display: `${like ? "none" : "block"}` }}><FaRegHeart size={24} color={"#6c757d"} /></div>
                                    <div style={{ display: `${like ? "block" : "none"}` }}><FaHeart size={24} color={"#6c757d"} /></div>
                                </Like>
                            </FooterBox>
                        </Box>
                    )
                })}
            </div>
            <AddBtn onClick={() => {
                navigate('/write')
            }}><GoPencil size={30} color={"gray"}/></AddBtn>
        </div>
    );
}

const Box = styledComponents.div`
    border: 5px solid rgba(50,50,50);
    border-radius : 20px;
    margin : 10px 0;
    background : rgba(150,150,150,0.2);
`;



const Like = styledComponents.div`
    cursor : pointer ;
   

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
    height : 50px;
    width: 100%;
    margin:auto;
    display : flex;
    justify-content: space-between;
    align-items : center;
    padding : 0 50px;
`;

const AddBtn = styledComponents.div`
    width:50px;
    height:50px;
    border-radius:50%;
    position: fixed;
    top : 90%;
    left : 90%;
    cursor : pointer;
    border:2px solid rgb(50,50,50);
    background-color: rgba(50,50,50,0.2);
    padding:7px;
`;
export default Main;

