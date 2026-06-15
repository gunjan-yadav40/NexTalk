import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Spinner with gradient ring */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-800"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-cyan-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      
      <p className="mt-4 text-slate-400 text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export default PageLoader;