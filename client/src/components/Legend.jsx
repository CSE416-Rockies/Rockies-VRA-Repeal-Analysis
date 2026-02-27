export default function Legend({title, items}){

    return(
        <div className = 'flex flex-col bg-white border-2 border-gray-300 rounded-md justify-center w-fit h-fit px-10 py-2'>
            <div className = 'text-xl'>{title}</div>
            {items.map(({label, color})=>(
                <div key = {label} className = 'flex gap-2 items-center'>
                    <div className = 'rounded w-4 h-4' style = {{backgroundColor: color}}/>
                    <div className = 'text-lg capitalize'>{label}</div>
                </div> 
                ))
            }
        </div>
    )
}