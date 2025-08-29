import type { ProductWithImages } from "@/interfaces/product-with-images.interface";

interface Props{
    product : ProductWithImages;
}

export const ProductCard = ({ product }: Props) => {
    return (
        <div> {product.title}
        </div>
    );
};
