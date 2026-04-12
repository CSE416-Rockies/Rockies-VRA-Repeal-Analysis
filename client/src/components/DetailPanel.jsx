import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'


export default function DetailPanel({ title, expanded, onClick, children, className = '', containerRef }){

    return (
        <div ref={containerRef} className={`detailBox pt-4 ${className} border-divide`} style={{ flex: expanded ? 1 : '0 0 auto' }}>
            <div className='flex w-full justify-between text-lg px-5 pb-4 text-gray-500 cursor-pointer' onClick={onClick}>
                <div>{title}</div>
                { expanded ? <ChevronUpIcon className = 'w-5'/> : <ChevronDownIcon className = 'w-5'/> }
            </div>
            {children}
        </div>
    )
}