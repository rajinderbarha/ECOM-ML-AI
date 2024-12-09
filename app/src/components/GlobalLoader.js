// src/components/GlobalLoader.tsx
const GlobalLoader = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#b3b1b1a0] z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-slate-950 border-solid"></div>
      </div>
    );
  };
  
  export default GlobalLoader;
  