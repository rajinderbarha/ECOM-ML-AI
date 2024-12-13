
import CategoryList from "@/components/categoryList";
import CategoryNameList from "@/components/CategoryNameList";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/productList";
import NewsLetter from "@/components/NewsLetter";
import { useSession } from "next-auth/react";
import DiscountSection from "@/components/DiscountSection";
import { useEffect, useState } from "react";
import ProductUnderPriceSection from "@/components/ProductUnderPriceSection";

const Home = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col min-h-screen">
      <CategoryNameList />
      <HeroSection />
      <CategoryList />
      {session ? "Products Realted to you search. Will be created soon": ""}<br />
      {session ? "Products you have recently viewed. Will be created soon": ""}
      <DiscountSection/>
      <ProductUnderPriceSection />
      <ProductList />
      <NewsLetter />
    </div>
  );
};

export default Home;
