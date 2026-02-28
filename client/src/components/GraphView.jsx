import Legend from "./Legend"

export default function GraphView({title, subtitle, legendTitle, legendItems, svgRef, menus, children}){
    return(
        <div className = 'flex justify-center items-center w-full h-full bg-gray-200'>  
            <div className = 'flex flex-col gap-10 justify-center w-full h-full py-5 px-5 bg-gray-200'>    
                {menus}
                <div className = 'flex flex-col w-full h-full px-15 py-10 justify-center items-center gap-5 bg-white rounded-xl'>
                    { (children) ? children :
                    <>
                        <div className = 'flex flex-col gap-5 justify-center items-center'>
                            <div className = 'text-3xl'>{title}</div>
                            <div className = 'text-xl capitalize'>{subtitle}</div>
                        </div>
                        <div className = 'flex w-full h-full px-20 items-center justify-between'>
                            <svg className = 'flex-1' width = "100%" height = "100%" ref = {svgRef} />
                            <Legend title = {legendTitle} items = {legendItems}/>
                        </div>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}