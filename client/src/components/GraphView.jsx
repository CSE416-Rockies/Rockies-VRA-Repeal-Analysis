import Legend from "./Legend"

export default function GraphView({title, subtitle, legendTitle, legendItems, svgRef, menus, extraDisplay = null, children}){
    return(
        <div className = 'flex justify-center items-center w-full h-screen bg-gray-200'>  
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'
                style={{ paddingLeft: 'calc(var(--navbar-width) + var(--panel-padding))'}}
            >    
                {menus}
                <div className = 'flex flex-col relative w-full h-full px-15 py-10 justify-center items-center gap-5 bg-white rounded-xl'>
                    { (children) ? children :
                    <div className = 'flex flex-col justify-center items-center w-full h-full'>
                        <div className = 'flex flex-col gap-2 justify-center items-center'>
                            <div className = 'text-xl capitalize font-semibold text-gray-700'>{title}</div>
                            <div className = 'text-lg capitalize text-gray-500'>{subtitle}</div>
                        </div>

                        <div className = 'flex w-full h-full px-20 items-center justify-between'>
                            <svg className = 'flex-1' width = "100%" height = "100%" ref = {svgRef} style={{overflow: 'visible'}} />
                            <div className = 'flex flex-col gap-5'>
                                <div className = 'flex flex-col gap-5 w-fit flex-shrink-0'>
                                    {legendItems.length > 0 && <Legend title={legendTitle} items={legendItems} />}
                                </div>
                                {extraDisplay !== null &&  extraDisplay.data != null && (
                                    <div className='flex flex-col gap-1'>
                                        <div className='text-xs text-gray-400'>{extraDisplay.label}</div>
                                        <div className='text-xl font-semibold text-gray-700'>{extraDisplay.data}%</div>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    </div>
                    }
                </div>
               
            </div>
        </div>
    )
}