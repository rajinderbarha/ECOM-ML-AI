import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4 font-bold">Sign In</h2>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
