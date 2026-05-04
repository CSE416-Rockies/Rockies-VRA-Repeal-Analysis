export default function ErrorMsg({ message = "Something went wrong. Please try again later." }) {
    return (
        <div className='flex flex-col items-center justify-center gap-1 text-center'>
            <div className='text-red-500 font-bold text-xl'>Error</div>
            <div className='text-gray-500 text-base'>{message}</div>
        </div>
    )
}