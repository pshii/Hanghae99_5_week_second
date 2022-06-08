import { configureStore} from '@reduxjs/toolkit'
// import user from './store/userSlice';
// import cart from './store/cartSlice';
import Megazine from './Slice/Megazine'
import User from './Slice/User'
import CommentSlice from './Slice/CommentSlice'


const store = configureStore({
  reducer: { 
    // user : user.reducer,   // state를 등록하는 과정 user로 등록
    megazine : Megazine.reducer,
    user : User.reducer,
    comment : CommentSlice.reducer,
  }
}) 
export default store;
