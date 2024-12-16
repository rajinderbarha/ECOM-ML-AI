import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4 font-bold">Sign In</h2>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 flex justify-between gap-1 items-center py-2 rounded hover:bg-blue-600"
        >
          <FcGoogle size={24}/>

          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
