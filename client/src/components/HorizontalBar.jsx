
/* Bar percentage color code */
export function BarFill({percent, color}){
    return(
        <div className = "w-full bg-gray-100 rounded-md h-3">
            <div className = {`rounded-md h-3`} 
                style = {{width: `${percent}%`, backgroundColor: color}}>
            </div>
        </div>

    )
}

/* Actual bar graph component code */
export function BarSection({title, arr}){

    return(
    <div className = 'flex flex-col gap-2 text-gray-500 pt-5 pb-2'>
       <span>{title}</span>
                
        <div className = 'flex flex-col gap-3 w-full text-sm'>
            {arr.map(({label, percent, color, sublabel}, i) => (
            <div key = {`${label}-${i}`} className = 'w-full'>
                <div className = 'flex justify-between'>
                    <span className = 'text-gray-400'>{label}</span>
                    <span className = 'flex gap-2'>
                        <span className = 'text-gray-400'>{sublabel.toLocaleString()}</span>
                        <span className = 'font-bold'>{percent.toFixed(2)}%</span>
                    </span>
                </div>
                
                <BarFill percent = {percent} color = {color}></BarFill>
            </div>
            ))}
        </div>
                
    </div>

    )
}    