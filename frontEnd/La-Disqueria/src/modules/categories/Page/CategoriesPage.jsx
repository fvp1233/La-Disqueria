import { CategoriesHero } from "@/modules/categories/components/CategoriesHero";
import { CategoriesStats } from "@/modules/categories/components/CategoriesStats";
import { CategoriesGrid } from "@/modules/categories/components/CategoriesGrid";
import { CategoriesDiscoverBanner } from "@/modules/categories/components/CategoriesDiscoverBanner";
import { Footer } from "@/global/components/Footer";

function Categories() {
  return (
    <>
      <CategoriesHero />
      <CategoriesStats />
      <CategoriesGrid />
      <CategoriesDiscoverBanner />
      <Footer />
    </>
  );
}

export default Categories;