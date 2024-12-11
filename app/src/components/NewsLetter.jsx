import React from 'react'

const NewsLetter=()=>{
return(
    <>
      <div className="flex w-full items-center justify-center py-[50px] px-[16px] news-letter">

 <form className="form flex flex-col max-w-[650px] text-center rounded-[10px] items-center">
        <span className="title text-[2rem] leading-8 font-bold tracking-tight ">Subscribe to our newsletter.</span>
        <p className="description leading-6 text-base mt-4 text-gray-700">Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt dolore.</p>
        <div className="flex max-w-[450px] w-full mt-4 gap-2 sm:flex-row flex-col">
          <input placeholder="Enter your email" type="email" name="email" id="email-address" className="outline-none leading-6 text-sm text-text-gray-800 px-3.5 py-2 bg-white/5 border border border-text-gray-700 rounded-md flex-1" />
          {/* <button type="submit" className="text-white font-semibold text-sm leading-5 px-3.5 py-2.5 bg-indigo-500 rounded-md border-none outline-none">Subscribe</button> */}
          <button type="submit" className="bg-[#2563eb] hover:bg-blue-700 text-white py-2 px-4 rounded-lg ">Subscribe</button>
        </div>
      </form>
        </div>

    </>
)
}
export default  NewsLetter

// form {
//     display: flex;
//     flex-direction: column;
//     background: #606c88;
//     background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
//     background: linear-gradient(to right, #3f4c6b, #606c88);
//     padding: 20px;
//     border-radius: 10px;
//     max-width: 350px;
//   }

//   .title {
//     font-size: 2rem;
//     line-height: 2rem;
//     font-weight: 700;
//     letter-spacing: -0.025em;
//     color: #fff;
//   }

//   .description {
//     line-height: 1.5rem;
//     font-size: 1rem;
//     margin-top: 1rem;
//     color: rgb(209 213 219);
//   }

//   .form div {
//     display: flex;
//     max-width: 28rem;
//     margin-top: 1rem;
//     column-gap: 0.5rem;
//   }

//   .form div input {
//     outline: none;
//     line-height: 1.5rem;
//     font-size: 0.875rem;
//     color: rgb(255 255 255 );
//     padding: 0.5rem 0.875rem;
//     background-color: rgb(255 255 255 / 0.05);
//     border: 1px solid rgba(253, 253, 253, 0.363);
//     border-radius: 0.375rem;
//     flex: 1 1 auto;
//   }

//   .form div input::placeholder {
//     color: rgb(216, 212, 212);
//   }

//   .form div input:focus {
//     border: 1px solid rgb(99 102 241);
//   }

//   .form div button {
//     color: #fff;
//     font-weight: 600;
//     font-size: 0.875rem;
//     line-height: 1.25rem;
//     padding: 0.625rem 0.875rem;
//     background-color: rgb(99 102 241);
//     border-radius: 0.375rem;
//     border: none;
//     outline: none;
//   }

