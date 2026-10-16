import React from "react";
import ProductsPage from "@/app/products/page";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: {
    search?: string;
    brand?: string;
    gender?: string;
    shape?: string;
    material?: string;
    rim?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <ProductsPage
      searchParams={{
        ...searchParams,
        category: params.slug,
      }}
    />
  );
}
