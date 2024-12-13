import React, { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard';
import Link from 'next/link';
import { GoChevronLeft, GoChevronRight, GoArrowRight } from 'react-icons/go';

const ProductRelatedSearch = () => {
    const [products50, setProducts50] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products/discount-products?discount=50')
            .then((res) => res.json())
            .then((data) => (
                // console.log(data),
                setProducts50(data)
            ))
    }, []);


    const scrolingContent = useRef();
    const leftBtn = useRef();
    const rightBtn = useRef();

    const scrolingContentElemet = scrolingContent.current

    const handleLeftClick = () => {
        scrolingContentElemet.scrollBy({ left: -270, behavior: 'smooth' });
    };

    const handleRightClick = () => {
        scrolingContentElemet.scrollBy({ left: 270, behavior: 'smooth' });
    };

    return (
        <>
            <section className=" bg-sky-100  py-6">
                <div className="container mx-auto ">
                    <h2 className="text-2xl font-bold mb-6">Products Realted to you search</h2>
                    <div className=''>
                        <div className="flex justify-between align-center  mb-4">
                            <h3 className="text-xl font-semibold">Products you have recently searched for...</h3>
                            <Link className='hover:text-blue-600 hover:underline flex items-center gap-[5px] group' href="/products">View All <GoArrowRight className='group-hover:translate-x-1 transition-all duration-300' /></Link>
                        </div>
                        <div className="relative">
                            <button className="absolute scroll-left-btn -left-[15px]  top-1/2 -translate-y-1/2 bg-white text-[26px] rounded-[50%] z-10 shadow-xl" style={{ opacity: '1' }} onClick={handleLeftClick} ref={leftBtn}><GoChevronLeft /></button>
                            <button className="absolute scroll-right-btn -right-[15px]  top-1/2 -translate-y-1/2 bg-white text-[26px] rounded-[50%] z-10 shadow-xl" style={{ opacity: '1' }} onClick={handleRightClick} ref={rightBtn}><GoChevronRight /></button>
                            <div className="flex gap-[20px] overflow-x-auto category-list-scroll pb-[30px]" ref={scrolingContent}>
                                {products50?.map((product) => (
                                    <div className="max-w-[250px]">
                                        <ProductCard key={product._id} product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductRelatedSearch;