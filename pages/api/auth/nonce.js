
import supabase from "../../../services/supabase";
import {v4 as uuidv4} from "uuid"
const nonceApi= async(req, res)=>{
    const {walletAddr}= req.body;
    const nonce= uuidv4()
    let{data, err}= await supabase.from("users")
                                  .select('nonce')
                                  .eq('walletAddr',walletAddr)
   // let {data:user,error}= await supabase.from("users").insert({nonce, walletAddr})                          
     if(data.length>0){
        // update the nonce match with walletAddr
        console.log('user already exists')
        let {data, error}= await supabase.from('users').update({nonce}).match({walletAddr})
        if(error){
          console.log('data error',error.message)
        }else
          console.log('data after update',data)
        
     }  else{
        // create new record
        let {data,error}= await supabase.from("users").insert({nonce, walletAddr})
        if (error) {
            console.log('Error inserting data:', error.message);
          } else {
            console.log('Data inserted successfully:', data);
          }
        }    
                             
        console.log('data: ', data)                         
                       
    if(err){
        res.status(400).json({error: err.message});
    }else{
        res.status(200).json({nonce})
    }
}
export default nonceApi;