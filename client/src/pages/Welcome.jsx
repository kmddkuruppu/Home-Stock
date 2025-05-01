import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Welcome = () => {
  return (
    <div>
      <Header/>
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Your Shopping Paradise</h1>
          <p className="text-lg mb-6">Explore the latest trends and discover amazing deals!</p>
          <a href="/products" className="bg-yellow-500 text-black py-2 px-6 rounded-full text-xl hover:bg-yellow-400 transition">
            Shop Now
          </a>
        </div>
      </section>

     
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://thumbs.dreamstime.com/b/bottle-oil-sits-table-variety-food-items-including-pasta-bottle-oil-sits-table-variety-food-358662269.jpg" alt="Category 1" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2"><a href='/products'>Groceries</a></h3>

            </div>
         
            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://media.wsimag.com/attachments/36283ad7e24b1ca11c6e04a3a9800f963c4d003b/store/fill/860/645/35defd11ef8de6b2a0af60645188fd44f1fdcc1e7ed397421e56f58cd7c7/Eggs-milk-and-cheese.jpg" alt="Category 2" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Diary and Eggs</h3>
       
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://img.jagranjosh.com/imported/images/E/Articles/SFSCU.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Stationery</h3>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://app.dropinblog.com/uploaded/blogs/34241141/files/Electronics.png" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Electronics</h3>
            </div>
           
            

            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://media.istockphoto.com/id/806998824/photo/woman-exercising-with-dumbbells-in-front-of-the-mirror.jpg?s=612x612&w=0&k=20&c=oGPfFzpJv1PBwZgDwYhoV6JUgmcjEPZYrYB0xbbBre4=" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Sports and fitness</h3>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://static.fanpage.it/wp-content/uploads/sites/22/2018/07/istock-856749954.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Fruits and Vegetables</h3>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://www.thatsmags.com/image/view/201906/party-pack-1.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Snacks and Beverages</h3>

            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://mycleaningangel.com/wp-content/uploads/2023/06/cleaning-tools.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Cleaning supplies </h3>
            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src=" https://shop.globalbees.com/cdn/shop/articles/Safe_and_Natural_Personal_Care_Products.jpg?v=1673811279g" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Personal Care</h3>

            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src=" https://ziplinelogistics.com/wp-content/uploads/2022/06/shutterstock_608257718.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Baby products</h3>

            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-x7MsEsqHdSXXdvs8bjLTWb4-8pbdcT6EQ&s" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Pet supplies </h3>

            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://cdn.shopify.com/s/files/1/0010/6525/4972/collections/Paper_Products.jpg?v=1700484426" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Paper products</h3>
  
            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://healthpolicy-watch.news/wp-content/uploads/2020/05/access-to-meds-1024x683.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Health and medicines</h3>
 
            </div><div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://www.inputfortwayne.com/galleries/lightbulb.jpg" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Household essentials</h3>

            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform">
              <img src="https://www.refrigeratedfrozenfood.com/ext/resources/RFF/2020-Web-Pics/AFFI/Viking-Cold-Thermal-Energy-Storage-grocery-freezer.jpg?1584496795" alt="Category 3" className="w-full h-40 object-cover mb-4 rounded-md" />
              <h3 className="text-xl font-semibold mb-2">Frozen and Refrigerated food</h3>

            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">About Us</h2>
          <p className="text-lg text-gray-600">
            We are passionate about providing a seamless shopping experience, offering a wide range of products
            from trusted brands, and delivering them right to your doorsteps. Your satisfaction is our top priority.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Customer Testimonials</h2>
          <div className="flex justify-center space-x-6">
            {/* Testimonial Card 1 */}
            <div className="bg-white text-gray-800 rounded-lg p-6 shadow-xl w-80">
              <p className="text-lg mb-4">
                "Amazing shopping experience! Fast delivery, great customer service, and a huge selection of products."
              </p>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-gray-500">Satisfied Customer</p>
            </div>
            {/* Testimonial Card 2 */}
            <div className="bg-white text-gray-800 rounded-lg p-6 shadow-xl w-80">
              <p className="text-lg mb-4">
                "I love the variety of products available. It's my go-to store for all my shopping needs."
              </p>
              <p className="font-semibold">Jane Smith</p>
              <p className="text-sm text-gray-500">Happy Shopper</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
        <p className="text-lg mb-6">Explore our latest collections and start shopping today!</p>
        <a href="/products" className="bg-yellow-500 text-black py-2 px-6 rounded-full text-xl hover:bg-yellow-400 transition">
          Start Shopping
        </a>
      </section>

    </div>
    <Footer/>
    </div>
  );
};

export default Welcome;
