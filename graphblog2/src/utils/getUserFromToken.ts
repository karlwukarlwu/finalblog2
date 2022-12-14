import JWT from 'jsonwebtoken'
import { JWT_SIN } from '../resolvers/Mutation/keys'


export const getUserFromToken = (token: string) => {
    try {
        // console.log(token+"+++12233")
        return JWT.verify(token, "222") as {
            userId: number;
        }
    } catch (error) {
        // if(error){
        console.log(error)
        // }
        return null
    }



}

// import JWT from "jsonwebtoken";
// // import { JSON_SIGNATURE } from "../keys";

// export const getUserFromToken = (token: string) => {
//   try {
//     return JWT.verify(token, "222") as {
//       userId: number;
//     };
//   } catch (error) {
//     return null;
//   }
// };