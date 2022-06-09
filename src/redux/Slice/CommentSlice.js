import { createSlice } from "@reduxjs/toolkit";

const CommentSlice = createSlice({      // = useState
    name : 'comment',   // state 이름
    initialState : [],
    reducers:{
        loadComments:  (state,action) => { 
            const arrayCopy = action.payload;
            arrayCopy.sort(compareBy_ASC('time'));  // 시간순 정렬

            function compareBy_ASC(key){
                return function (a,b){
                    let x = a[key];
                    let y = b[key];

                    if (x > y) return -1;
                    if (x < y) return 1;
                    return 0;
                }
            }
            return [...arrayCopy]
        },
        saveComment:  (state,action) => { 
            console.log(action.payload);
            state.unshift({...action.payload})
        },

}
})

export const {loadComments,saveComment} = CommentSlice.actions;

export default CommentSlice;