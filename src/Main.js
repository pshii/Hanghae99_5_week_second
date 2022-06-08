import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import styledComponents from 'styled-components';
import { FaRegHeart,FaGrin } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getDocs, collection } from "firebase/firestore";
import { db } from './shared/firebase';
import { loadMegazine } from './redux/Slice/Megazine';

const Main = (props) => {
    window.scrollTo(0,0);
    const megazineList = useSelector(state => state.megazine);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // console.log(props.user_id)
    // console.log(megazineList)
    const loadMegazineFB = async () => {
        const megazine_data = await getDocs(collection(db, "megazine")); // await Promise로 오는 데이터를 원하는데이터로 변환
        let megazine_list = [];
        megazine_data.forEach((m) => {
            megazine_list.push({ id:m.id, ...m.data() });
        });
        dispatch(loadMegazine(megazine_list))
    }

    React.useEffect(() => {
        loadMegazineFB()
    }, [])

    return (
        <div>
            <div style={{ border: "1px solid black", width: "100%", margin: "auto" }}>
                {megazineList.map((m, i) => {
                    return (
                        <div key={i} >
                            <TitleBox>
                                <div style={{ display: "flex" }}>
                                    <div style={{margin:"0 5px"}}><FaGrin size={24} color={"#6c757d"}/></div>
                                    <div>{m.nick}</div>
                                </div>
                                <div>{m.time}</div>
                            </TitleBox>
                            <ContentBox position={m.position}>
                                <div style={{ margin: "auto" }} ><span>{m.content}</span></div>
                                <img src={m.img_url}  onClick={() => { navigate(`/detail/${m.id}`) }} style={{cursor: "pointer" }}></img>
                            </ContentBox>
                            <FooterBox>
                                <div>
                                    <span style={{ marginRight: "5px" }}>좋아요 {m.liked}개</span>
                                    <span>댓글 0개</span>
                                </div>
                                <FaRegHeart size={24} color={"#6c757d"} />
                            </FooterBox>
                        </div>
                    )
                })}
            </div>
            <AddBtn onClick={() => {
                navigate('/write')
            }}></AddBtn>
        </div>
    );
}

const TitleBox = styledComponents.div`
    width:100%;
    height : 50px;
    display: flex;
    justify-content : space-around;
    align-items: center;
`;
const ContentBox = styledComponents.div`
    width : 100%;
    border:1px solid black;
    display :flex;                     // 기본 flex 가 텍스트가 왼쪽,
    display : ${(props) => props.position ==='top'? "block" : null};      // top일 경우 block하면 텍스트가 위로
    flex-direction : ${(props) => props.position ==='right'? "row-reverse" : null};  // right일 경우 방향만 바꾸기
    & > div {
        border:5px solid black;
    }
    & > img {
        width :  ${(props) => props.position ==='top'? "100%" : "50%"};
    }
    
    div>div>div>div {
        ${(props) => props.position === 'top' ? "none" : "none"}
    }


    @media screen and (max-width: 768px) {   
        &{
            display: block;
        }
        & > div { 
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

const AddBtn = styledComponents.div`
    width:50px;
    height:50px;
    border-radius:50%;
    position: fixed;
    top : 90%;
    left : 90%;
    cursor : pointer;
    background-color: #6c757d;
`;
export default Main;

