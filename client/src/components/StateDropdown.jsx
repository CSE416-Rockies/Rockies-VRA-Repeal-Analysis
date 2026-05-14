import { useState, useContext } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import GlobalStoreContext from "../store";

export default function StateDropdown({onSelect, options}){
    const [open, setOpen] = useState(false);
    const { store } = useContext(GlobalStoreContext);

    const selectedState = store?.selectedState;

    const filterOptions = options.filter((option) => (option.label || option) !== selectedState);

    const handleSelect = (value)=>{
        if(onSelect){
            onSelect(value);
        }
        setOpen(false);
    };
    return (
        <div className="absolute flex justify-end right-0 w-full h-full cursor-pointer" onClick={() => setOpen(!open)}>
            <button
                className="flex items-center justify-end px-4 py-0 text-lg hover:text-gray-400 transition-all duration-100"
            >
                <ChevronDownIcon
                    className={`w-5 transition-transform duration-200 ml-2 mt-1 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <ul className="absolute inset-x-0 top-full mt-3 bg-white cursor-pointer rounded-xl shadow-md w-full py-2 z-50"
                    onClick={e => e.stopPropagation()}
                >
                    {filterOptions.map((option) => (
                        <li
                            key={option.id || option}
                            className="px-5 py-2 hover:bg-gray-100 transition-all duration-100 ease-in capitalize text-gray-400 text-xl"
                            onClick={() =>
                                handleSelect(option.id || option)
                            }
                        >
                            {option.label || option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}