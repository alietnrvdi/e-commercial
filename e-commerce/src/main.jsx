import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import SubCategoryPage from './pages/SubCategoryPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Basket from './pages/Basket.jsx'
import OrderHistory from './pages/OrderHistory.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Payment from './pages/Payment.jsx'
import { StrictMode } from 'react'
import OrderSuccessfull from './pages/OrderSuccessfull.jsx'

// Dynamic Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/basket',
        element: <Basket />
      },
      {
        path: '/order-history',
        element: <OrderHistory />
      },
      {
        path: '/order-successful',
        element: <OrderSuccessfull />
      },
      {
        path: '/basket/payment',
        element: <Payment />
      },
      {
        path: '/category/:categoryId/all',
        element: <CategoryPage />
      },
      {
        path: '/product/:productSlug',
        element: <ProductPage />
      },
      {
        path: '/category/:categoryId/:subCategory',
        element: <SubCategoryPage />
      },

      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }, {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
