import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../store/Firebase';
import ProductCard from '../components/ProductCard'

function SubCategoryPage() {
    const { categoryId, subCategory, productSlug } = useParams()
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q2 = query(collection(db, 'products'),
                    where('productsObj.categoryId', '==', categoryId),
                    where('productsObj.subCategories', '==', subCategory))
                const productsSnapshot = await getDocs(q2);
                const productList = productsSnapshot.docs.map((doc) => {
                    const data = doc.data()
                    return data.productsObj
                })
                setProducts(productList);
            } catch (error) {
                console.log('get products fetch data error ', error)
            }
        }
        fetchProducts()
    }, [categoryId, subCategory, db]);
    return (
        <div className='product-list'>
            {products.map((product, index) => (
                <Link key={index} to={`/product/${product.slug}`}>
                    <ProductCard productDetails={product} />
                </Link>
            ))}
        </div>

    )
}

export default SubCategoryPage