import { useMemo } from "react";
import useCatalog from "./useCatalog";

const useProductDetail = (slug) => {
  const { catalog, loading, error } = useCatalog();

  const product = useMemo(
    () => catalog.find((item) => item.slug === slug) || null,
    [catalog, slug]
  );

  return { product, loading, error, notFound: !loading && !error && !product };
};

export default useProductDetail;
