export default function Heatmap_Legend({title, items}){

    return(
        <div className = 'fixed z-[1000] left-24 bottom-6 flex gap-2 flex-col bg-white rounded-md shadow-md items-start w-fit h-fit px-5 py-3'>
            <div className = 'text-sm'>{title}</div>
            {items.map(({label, color})=>(
                <div key = {label} className = 'flex gap-2 items-start'>
                    <div className = 'rounded w-4 h-4' style = {{backgroundColor: color}}/>
                    <div className = 'text-xs capitalize'>{label}</div>
                </div> 
                ))
            }
        </div>
    )
}