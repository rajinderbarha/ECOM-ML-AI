import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GoChevronLeft, GoChevronRight  } from "react-icons/go";
export default function CategoryNameList() {
    const [categories, setCategories] = useState([]);
    const scrolingContent = useRef();
    const leftBtn = useRef();
    const rightBtn = useRef();
    const scrolingContentElemet= scrolingContent.current

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories/getCategoryNames');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleLeftClick = () => {
        // const container = document.querySelector('.header-categories');
        scrolingContentElemet.scrollBy({ left: -100, behavior: 'smooth' }); 
    };

    const handleRightClick = () => {
        // const container = document.querySelector('.header-categories');
        scrolingContentElemet.scrollBy({ left: 100, behavior: 'smooth' });
    };


    const handleMouseEnter = () => {
        leftBtn.current.style.opacity = 1;
        rightBtn.current.style.opacity = 1;
        console.log("mouse enter");
        
    };
    const handleMouseLeave = () => {
        leftBtn.current.style.opacity = 0;
        rightBtn.current.style.opacity = 0;
        console.log("mouse leave");
        
    };

    return (
        <div className="w-full bg-gray-100 py- ">
            {/* <h2 className="text-lg font-bold px-4 mt-2">Categories</h2> */}
            <div className="relative"  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

            <button className="scroll-btn left" onClick={handleLeftClick} ref={leftBtn}><GoChevronLeft /></button>
            <button className="scroll-btn right" onClick={handleRightClick} ref={rightBtn}><GoChevronRight /></button>
            <div className="header-categories py-[10px] flex overflow-x-auto space-x-4 px-4 hide-scrollbar relative select-none" ref={scrolingContent} style={{scrollBehavior:"smooth"}}>
  
                {categories.map((category) => (
                    <div
                    key={category._id}
                    className="flex-none bg-white shadow-md rounded-lg p-3 min-w-[120px] text-center cursor-pointer hover:bg-gray-200 transition"
                    >
                        <span className="text-sm font-semibold text-gray-700 category-name-list-text">{category.name}</span>
                    </div>
                ))}
                         
            </div>
                </div>
        </div>
    );
}
