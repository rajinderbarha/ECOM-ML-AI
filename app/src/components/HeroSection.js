import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const HeroSection = () => {
    const slides = [
        {
            image: '/images/vegitables.png',
            title: 'Fresh Veggies & Fruits',
            description: 'Get farm-fresh fruits and vegetables delivered to your door.',
            link: '/categories/fresh-veggies-fruits',
        },
        {
            image: '/images/household.png',
            title: 'Household Essentials',
            description: 'Stock up on everything you need for a happy home.',
            link: '/categories/household',
        },
        {
            image: '/images/cloths.png',
            title: 'Clothing & Garments',
            description: 'Find your style with our latest clothing collections.',
            link: '/categories/clothing',
        },
        {
            image: '/images/snacks.png',
            title: 'Delicious Snacks',
            description: 'Satisfy your cravings with our range of tasty snacks.',
            link: '/categories/snacks',
        },
    ];

    return (
        <div className="w-full relative">
            <Carousel
                showThumbs={false}
                autoPlay
                infiniteLoop
                showStatus={false}
                interval={5000}
                className="rounded-lg shadow-lg"
            >
                {slides.map((slide, index) => (
                    <div key={index} className="relative">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="h-[500px] w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                            <p className="text-lg mb-6">{slide.description}</p>
                            <Link href={slide.link}>
                                <p className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                                    Shop Now
                                </p>
                            </Link>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroSection;
