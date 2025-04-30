import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../store/Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ProductPageCard from '../components/ProductPageCard';

function ProductPage() {
    const { productSlug } = useParams();
    const [product, setProducts] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q3 = query(collection(db, 'products'),
                    where('productsObj.slug', '==', productSlug))
                const productsSnapshot = await getDocs(q3);
                const productList = productsSnapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        productsObj: data.productsObj
                    }
                })

                if (productList.length > 0) {
                    const selectedProduct = productList[0]
                    setProducts(selectedProduct)
                } else {
                    console.log('product not found')
                }
            } catch (error) {
                console.log('get products fetch data error ', error)
            }
        }
        fetchProducts()
    }, [productSlug]);

    if (!product) {
        return <div>no products avaible</div>
    }
    return (
        <ProductPageCard productDetails={product.productsObj} />
    )
}

export default ProductPage