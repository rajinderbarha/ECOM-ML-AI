
import CategoryList from "@/components/categoryList";
import CategoryNameList from "@/components/CategoryNameList";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/productList";
import NewsLetter from "@/components/NewsLetter";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <CategoryNameList />
      <HeroSection />
      <CategoryList />
      <ProductList />
      {/* <NewsLetter/> */}
    </div>
  );
};

export default Home;
