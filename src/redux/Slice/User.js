import { createSlice } from "@reduxjs/toolkit";
import { getDocs,collection } from "firebase/firestore";
import { db } from "../../shared/firebase";
const User = createSlice({      // = useState
    name : 'user',   // state 이름
    initialState : {
        
    },
    reducers:{
        saveUser(state,action){
            // state = action.payload;
            // console.log(state)

            return {...action.payload}

            // console.log(state[0]) // state 그냥 출력안됨
        },
        // saveUser(state,action) {
        //     console.log(action.payload)
        //     state.push({
        //         user_id: action.payload.user_id,
        //         nick: action.payload.nick,
        //     })
        //     // console.log(state[0].user_id,state[0].nick)
        //     // console.log(state[0])
           
        // }
}
})

export const {saveUser} = User.actions;

export default User;