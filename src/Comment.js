import { borderBottom } from '@mui/system';
import React from 'react';
import { FaGrin } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { getDocs,collection } from 'firebase/firestore';
import { db } from './shared/firebase';
import { loadComments } from './redux/Slice/CommentSlice';
const Comment = ({ tab, id }) => {
    const dispatch = useDispatch();
    const [fade, setFade] = useState('');
    const comments = useSelector( state => state.comment );
    useEffect(() => {
        const a = setTimeout(() => { setFade('end') }, 10)
        return () => { setFade(''); clearTimeout(a) }
    }, [tab])


    
    const loadCommentsFB = async () => {
        const comment_data = await getDocs(collection(db, "comments")); 

        let tempArray = [];

        comment_data.forEach((c) => {  // 일단 다 가져와서 id와 데이터를 뽑아냄
            tempArray.push({...c.data()}); 
        });
        const comment_list = tempArray.filter((c)=>{
            return c.id === id;
        })
        dispatch(loadComments(comment_list))
    }

    useEffect(()=>{
        loadCommentsFB();
    },[])

    return (
        <div className={`start ${fade}`}>{tab ?
            <div>
                {comments.map((c,i) => {
                    return (
                        <div key={i}>
                            <div style={{
                                display: "flex", justifyContent: "space-around",
                                borderBottom: "1px solid rgba(108,117,125,0.8)", margin: "20px 0",

                            }}>
                                <FaGrin size={24} color={"#6c757d"} />
                                <span>{c.nick}</span>
                                <span style={{ flexGrow: "0.3" }}>{c.content}</span>
                                <span>{c.time}</span>
                            </div>
                        </div>
                    )
                })}

            </div>
            : null}

        </div>
    );
}

export default Comment;