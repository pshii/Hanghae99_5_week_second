import { createSlice } from "@reduxjs/toolkit";
import { getDocs,collection } from "firebase/firestore";
import { db } from "../../shared/firebase";

const Megazine = createSlice({      // = useState
    name : 'megazine',   // state 이름
    initialState : [],
    reducers:{
        loadMegazine:  (state,action) => { 
            const arrayCopy = [...action.payload];
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
            return [...arrayCopy];
           
        },
        saveMegazine:  (state,action) => { 
            console.log(action.payload)
            const megazine = {...action.payload}
            state = [...state, megazine]

        },
        
}
})

export const {loadMegazine,saveMegazine} = Megazine.actions;

export default Megazine;