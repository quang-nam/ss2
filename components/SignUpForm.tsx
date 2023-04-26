import React, { useState } from 'react'
import * as Yup from 'yup';
import {useFormik} from 'formik'
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import {v4 as uuidv4} from "uuid"
import { useRouter } from 'next/router';

const supabase= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
);


const SignupForm = () => {
    const [loginState, setLoginState]= useState("");
    const router =useRouter()
    const formik = useFormik({
        initialValues:{
            email: "",
            password:"",
        },
        validationSchema: Yup.object({
            email:Yup.string().required("Required").matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ,"Please enter the valid email address"),
            password:Yup.string().required("Required").matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,15})/,
                    "Password must be 6 or 15 characters, special characters"),
        }),
        onSubmit: async(value)=>{
            window.alert('Submitted successfully')
            const{ user, session, error}= await supabase.auth.signUp({
                email: value.email,
             password: value.password
            })
            
            console.log(error?.message)
            console.log(user)
        }
    })
    // const handleRegister= async()=>{
    //     // const {data}= await supabase.from("users").select("*")
    //     // console.log(data)
    //     const{ user, session, error}= await supabase.auth.signIn({
    //         name: 
    //     })
    // }
    const connectToMetaMask = async () => {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log("MetaMask connected!");
          // Tiếp tục thực hiện các tác vụ khác
        } catch (error) {
          console.error(error);
        }
      }
      
    const login = async()=>{

         setLoginState("Connecting to your wallet...");
         connectToMetaMask()
        if(!window.ethereum ){
            setLoginState("No metamask wallet... please install it");
            return"";
        }
        if(window.ethereum){
            console.log("Hi")
            // find current user
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts",[]);
            const signer= provider.getSigner();// get current address
            // get address
            const walletAddr= await signer.getAddress();
            setLoginState("Generating the nonce....")

            let response = await fetch("/api/auth/nonce",{
                method:"POST",
                body: JSON.stringify({
                    walletAddr,
                    
                }),
                headers:{
                    "Content-Type": "application/json"
                }
            })
            const {nonce}= await response.json();
            setLoginState("Please sign in the nonce...")
            // signature based on the nonce value
            const signature = await signer.signMessage(nonce);
            console.log("signature: ",signature);

            response = await fetch("/api/auth/wallet",{
                method:"POST",
                body: JSON.stringify({
                    walletAddr,
                    nonce,
                    signature
                }),
                headers:{
                    "Content-Type": "application/json"
                }
            })
            setLoginState("Login completed ....")
            const {user,token}= await response.json();
              supabase.auth.setAuth(token)
            router.push('/homepage')
        }
        
    }
  return (
    <section>
        <label>{loginState}</label>
        <form className='infoform' onSubmit={formik.handleSubmit}>
            <label> Your Email </label>
            <input 
                type='email' 
                name='email' 
                id='email' 
                placeholder='Enter your email'
                value={formik.values.email}
                onChange={formik.handleChange}
            />
            {formik.errors.email && formik.touched.email&&(
                <p className='errorMsg'>{formik.errors.email}</p>
            )}
             <label> Password </label>
            <input 
                type='text' 
                name='password' 
                id='password' 
                placeholder='Enter your password'
                onChange={formik.handleChange}
                value={formik.values.password}
            />
            {formik.errors.password&& formik.touched.password &&(
                 <p className='errorMsg'>{formik.errors.password}</p>
            )}
            <div>
            <button type='submit'id='button1' >Register</button>
            <button type='submit' onClick={login}>Sign in with MetaMask</button>
            </div>
           
         
        </form>
    </section>
  )
}

export default SignupForm