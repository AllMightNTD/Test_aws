import React from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import './index.css';

const products = [
  { id: 1, name: 'Product 1', description: 'High quality product', price: 29.99, image: 'https://via.placeholder.com/220' },
  { id: 2, name: 'Product 2', description: 'High quality product', price: 49.99, image: 'https://via.placeholder.com/220' },
  { id: 3, name: 'Product 3', description: 'High quality product', price: 19.99, image: 'https://via.placeholder.com/220' },
  { id: 4, name: 'Product 4', description: 'High quality product', price: 39.99, image: 'https://via.placeholder.com/220' },
  { id: 5, name: 'Product 5', description: 'High quality product', price: 59.99, image: 'https://via.placeholder.com/220' },
];

function App() {
  return (
    <div>
      <Navbar />
      <Banner />
      <div className="products">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;
