import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { GoChevronLeft, GoChevronRight, GoArrowRight } from 'react-icons/go';

const DiscountSection = () => {
    const [products20, setProducts20] = useState([]);
    const [products50, setProducts50] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products/discount-products?discount=20')
            .then((res) => res.json())
            .then((data) => (
                // console.log(data),
                setProducts20(data)
            ))

        fetch('http://localhost:5000/api/products/discount-products?discount=50')
            .then((res) => res.json())
            .then((data) => (
                // console.log(data),
                setProducts50(data)
            ))
    }, []);


    const scrolingContent = useRef();
    const scrolingContent2 = useRef();
    const leftBtn = useRef();
    const rightBtn = useRef();


    const scrolingContentElemet = scrolingContent.current
    const scrolingContentElemet2 = scrolingContent2.current


    const handleLeftClick = () => {
        scrolingContentElemet.scrollBy({ left: -270, behavior: 'smooth' });
    };

    const handleRightClick = () => {
        scrolingContentElemet.scrollBy({ left: 270, behavior: 'smooth' });
    };


    const handleLeftClick2 = () => {
        scrolingContentElemet2.scrollBy({ left: -270, behavior: 'smooth' });
    };

    const handleRightClick2 = () => {
        scrolingContentElemet2.scrollBy({ left: 270, behavior: 'smooth' });
    };
    return (
        <section className="bg-indigo-200	 py-6">
            <div className="container mx-auto ">
                <h2 className="text-2xl font-bold mb-6">Discounted Products</h2>
                <div className=''>
                    <div className="flex justify-between align-center mb-4">
                        <h3 className="text-xl font-semibold ">upto 50% Off</h3>
                        <Link className='hover:text-blue-600 hover:underline  flex items-center gap-[5px] group' href="/products">View All <GoArrowRight className='group-hover:translate-x-1 transition-all duration-300' /></Link>
                    </div>
                    <div className="relative">
                            <button className="absolute scroll-left-btn -left-[15px]  top-1/2 -translate-y-1/2 bg-white text-[26px] rounded-[50%] z-10 shadow-xl" style={{ opacity: '1' }} onClick={handleLeftClick} ref={leftBtn}><GoChevronLeft /></button>
                            <button className="absolute scroll-right-btn -right-[15px] top-1/2 -translate-y-1/2 bg-white text-[26px] rounded-[50%] z-10 shadow-xl" style={{ opacity: '1' }} onClick={handleRightClick} ref={rightBtn}><GoChevronRight /></button>
                            <div className="flex gap-[20px] overflow-x-auto category-list-scroll pb-[30px]" ref={scrolingContent}>
                                {products50?.map((product) => (
                                    <div className="max-w-[250px]">
                                        <ProductCard key={product._id} product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>
                <div className="mb-10 mt-5">
                    <div className="flex justify-between align-center mb-4">
                        <h3 className="text-xl font-semibold ">upto 20% Off</h3>
                        <Link className='hover:text-blue-600 hover:underline flex items-center gap-[5px] group' href="/products">View All <GoArrowRight className='group-hover:translate-x-1 transition-all duration-300' /></Link>
                    </div>
                    <div className="relative">
                            <button className="absolute scroll-left-btn -left-[15px]  top-1/2 -translate-y-1/2 bg-white text-[26px] rounded-[50%] z-10 shadow-xl" style={{ opacity: '1' }} onClick={handleLeftClick2} ref={leftBtn}><GoChevronLeft /></button>
                            <button className="absolute scroll-right-btn -right-[15px] top-1/2 -translate-y-1/2 bg-white text-[26px] rounded-[50%] z-10 shadow-xl" style={{ opacity: '1' }} onClick={handleRightClick2} ref={rightBtn}><GoChevronRight /></button>
                            <div className="flex gap-[20px] overflow-x-auto category-list-scroll pb-[30px]" ref={scrolingContent2}>
                                {products20?.map((product) => (
                                    <div className="max-w-[250px]">
                                        <ProductCard key={product._id} product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                </div>

            </div>
        </section>
    );
};

export default DiscountSection;
