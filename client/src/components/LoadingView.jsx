

export default function LoadingView({text}){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm pointer-events-auto">
            <div className="flex flex-col items-center gap-3 text-gray-500">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-sm font-medium">{text}</span>
            </div>
        </div>
    )
    
}
