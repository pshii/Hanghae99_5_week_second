import { createSlice } from "@reduxjs/toolkit";
import { getDocs,collection } from "firebase/firestore";
import { db } from "../../shared/firebase";
import { current } from '@reduxjs/toolkit'
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
        // loadOneMegazine: (state,action)=> {
        //     console.log((current(state)))
        //     const findMegazine = state.find((m)=>{
        //         console.log(m.id)
        //         return m.id == action.payload;
        //     })
        //     console.log(findMegazine)
        // },
        saveMegazine:  (state,action) => { 
            // console.log(action.payload)
            const megazine = {...action.payload}
            state = [...state, megazine]

        },

        // updateMegazine:  (state,action) => { 
        //     console.log(action.payload)
        //     console.log(current(state))



        //     const megazine = {...action.payload}
        //     state = [...state, megazine]
        // },
        
        
        deleteMegazine: (state,action) => { 
            console.log(action.payload)
            const new_megazine_list =state.filter((m)=>{
                return m.id !== action.payload;
            })

            console.log(new_megazine_list)
            state = [...new_megazine_list]

        },
        
}
})

export const {updateMegazine,loadOneMegazine,deleteMegazine,loadMegazine,saveMegazine} = Megazine.actions;

export default Megazine;