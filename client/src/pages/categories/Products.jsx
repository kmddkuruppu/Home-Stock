import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const Products = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const formatNumbers = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const products = [
    { id: 1, item: "Rice", price: 500, quantity: "1 kg", category: "Groceries", img: "https://img.drz.lazcdn.com/static/pk/p/e4090f76f7110e8c812dbdadaaa3db9a.jpg_720x720q80.jpg" },
    { id: 2, item: "Bread", price: 200, quantity: "1 loaf", category: "Groceries", img: "https://www.goldmedalbakery.com/content/uploads/2019/12/Sandwich-White.jpg" },
    { id: 3, item: "Milk", price: 150, quantity: "1 liter", category: "Dairy & Eggs", img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/02/Glass-and-bottle-of-milk-fe0997a.jpg" },
    { id: 4, item: "Eggs", price: 120, quantity: "12 pcs", category: "Dairy & Eggs", img: "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg" },
    { id: 5, item: "Butter", price: 250, quantity: "500 g", category: "Dairy & Eggs", img: " https://cdn.britannica.com/27/122027-050-EAA86783/Butter.jpg" },
    { id: 6, item: "Apples", price: 300, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://images.everydayhealth.com/images/diet-nutrition/apples-101-about-1440x810.jpg" },
    { id: 7, item: "Bananas", price: 100, quantity: "1 dozen", category: "Fruits & Vegetables", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxr0cDPmLOUOxkQLTK_zECOlUztWnRm_nXbQ&s" },
    { id: 8, item: "Tomatoes", price: 180, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://nutritionfacts.org/app/uploads/2019/01/2962762666_1237ff6eb4_o.jpg" },
    { id: 9, item: "Potatoes", price: 90, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://cdn.mos.cms.futurecdn.net/iC7HBvohbJqExqvbKcV3pP-1200-80.jpg" },
    { id: 10, item: "Onions", price: 110, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://www.tastingtable.com/img/gallery/why-are-red-onions-purple/l-intro-1644158494.jpg" },
  
    { id: 11, item: "Shampoo", price: 350, quantity: "250 ml", category: "Personal Care", img: "https://hips.hearstapps.com/hmg-prod/images/gh-best-shampoos-655bc056daddf.png?crop=0.502xw:1.00xh;0.442xw,0&resize=1200:*" },
    { id: 12, item: "Toothpaste", price: 120, quantity: "150 g", category: "Personal Care", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA9Y_47AxdTBeYp8mMQx4cecUPxTPrzHEgFw&s" },
    { id: 13, item: "Soap", price: 80, quantity: "1 bar", category: "Personal Care", img: "https://ceylonsoapcompany.lk/wp-content/uploads/2023/08/Revive-Rejuvenate-Bathing-Bar-Soap-Bar-3.jpg" },
    { id: 14, item: "Deodorant", price: 200, quantity: "100 ml", category: "Personal Care", img: "https://kutis-skincare.co.uk/cdn/shop/files/bergamot_sagevegandeodorant.jpg?v=1716477813" },
    { id: 15, item: "Tissue Box", price: 140, quantity: "1 pack", category: "Paper Products", img: "https://cdn.prod.website-files.com/5f0be3d1f001794419b035ff/5fec558b0aa410383d8f21d3_Tissue_Box_2x50.jpg" },
  
    { id: 16, item: "Toilet Paper", price: 160, quantity: "4 rolls", category: "Paper Products", img: "https://pureplanetclub.com/cdn/shop/files/19_cd8c7228-b2a3-42d6-ab85-b37d62b241fb.png?v=1740102023" },
    { id: 17, item: "Dish Soap", price: 130, quantity: "500 ml", category: "Cleaning Supplies", img: "https://www.palmolive.com/content/dam/cp-sites/home-care/palmolive-na-2021-redesign/pdp/hero-images/md_BeautyShots_SoftTouch.jpg" },
    { id: 18, item: "Laundry Detergent", price: 450, quantity: "1 L", category: "Cleaning Supplies", img: "https://www.persil.com/images/h0nadbhvm6m4/1dvWh5d7CcfYj0AFA4Jupt/dff7280141c10d06c1030bc5b39eac3b/UGVyc2lsX1dlYnNpdGVfcHJvZHVjdF90aWxlc18xOTAzMjQtdjVCaW8uanBn/1024w-768h/persil-liquid-bio-bottle.jpg" },
    { id: 19, item: "Disinfectant", price: 300, quantity: "500 ml", category: "Cleaning Supplies", img: "https://www.whiteley.com.au/wp-content/uploads/2022/04/Viraclean-range-with-15L-500x500px-1.jpg" },
    { id: 20, item: "Scrub Pads", price: 60, quantity: "3 pcs", category: "Cleaning Supplies", img: "https://i5.walmartimages.com/seo/Scouring-Pads-Heavy-Duty-Household-Cleaning-High-Quality-Scrubber-Non-Scratch-Anti-Grease-Technology-Reusable-Green-4-Pack-X3-Total-12-Pads-by-Scrub_43446168-457a-4fc8-b58a-f10ed88187af_1.76f59747308e362b8d4acade52d71b61.jpeg" },
  
    { id: 21, item: "Cereal", price: 320, quantity: "500 g", category: "Groceries", img: "https://foodsafetyhelpline.com/wp-content/uploads/2015/11/Cereal-Products.jpg" },
    { id: 22, item: "Coffee", price: 400, quantity: "200 g", category: "Snacks & Beverages", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0a-3uyQ9B4bVyJmbPEeawulA4SLxp7f2cXA&s" },
    { id: 23, item: "Aloe Juice", price: 220, quantity: "1 liter", category: "Snacks & Beverages", img: "https://assets.clevelandclinic.org/transform/7d0f7260-b896-4fee-ae87-304722d7621f/aloeVeraDrink-1244678181-770x533-1_jpg" },
    { id: 24, item: "Biscuits", price: 100, quantity: "200 g", category: "Snacks & Beverages", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIZEj1uM6PGXQJvv90dt0P1lZC3XDqhXgW4g&s" },
    { id: 25, item: "Chips", price: 90, quantity: "150 g", category: "Snacks & Beverages", img: " https://www.seriouseats.com/thmb/BUR7a-Jcrb0mDuCkHHkSsad4f6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20240304-SEA-Chips-AmandaSuarez-22-45bb69d129324fcda1cd06153f2dc71a.jpg" },
  
    { id: 26, item: "Dog Food", price: 850, quantity: "2 kg", category: "Pet Supplies", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwR8cjSL_Blp6yvP9cmIwjnbuHXBGZxy1fgw&s" },
    { id: 27, item: "Cat Litter", price: 500, quantity: "5 kg", category: "Pet Supplies", img: "https://i0.wp.com/www.newagepet.com/wp-content/uploads/2024/02/catlitter.jpg?fit=1560%2C1040&ssl=1" },
    { id: 28, item: "Pet Shampoo", price: 250, quantity: "250 ml", category: "Pet Supplies", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNT6kCYDqHXDlC6E4nIBZ-8v9Uzy7trn9dGQ&s" },
    { id: 29, item: "Baby toy set", price: 880, quantity: "1 pack", category: "Baby Items", img: "https://toystorepakistan.pk/wp-content/uploads/2022/01/81LEO4OpJRL._AC_SL1500_.jpg" },
    { id: 30, item: "Baby cologne", price: 600, quantity: "500 ml", category: "Baby Items", img: "https://littlespaces.lk/cdn/shop/files/1710259512_1.png?v=1744204386" },
  
    { id: 31, item: "Sanitary Pads", price: 160, quantity: "10 pcs", category: "Personal Care", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqUht2NVxn3VDXkNhXzuf7ypfHk37kE2YUZw&s" },
    { id: 32, item: "Hand Sanitizer", price: 100, quantity: "100 ml", category: "Health & Medicine", img: "https://cfchealthsa.blob.core.windows.net/products/sterillhandsanitizergel50ml.webp" },
    { id: 33, item: "Vitamins", price: 350, quantity: "60 tablets", category: "Health & Medicine", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDB2Il07OGUQ5nz4F3H1IsOnOGr8iz33EoyKbv5fIbBUYYenibXMKwMpXTyfpz5jpA5fg&usqp=CAU" },
    { id: 34, item: "First Aid Kit", price: 700, quantity: "1 set", category: "Health & Medicine", img: "https://5.imimg.com/data5/SELLER/Default/2024/4/411789439/LQ/BC/SF/9495019/medical-first-aid-kit-500x500.png" },
    { id: 35, item: "Thermometer", price: 300, quantity: "1 unit", category: "Health & Medicine", img: "https://pics.walgreens.com/prodimg/604401/900.jpg" },
  
    { id: 36, item: "Batteries", price: 120, quantity: "4 pcs", category: "Household Essentials", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1GJOGLfzXtcN-B1qIbQGVUw53HCfxu3vGFg&s" },
    { id: 37, item: "Light Bulbs", price: 250, quantity: "2 pcs", category: "Household Essentials", img: "https://justenergy.com/wp-content/uploads/2021/03/light-bulbs-types-of-different-bulbs.jpg" },
    { id: 38, item: "Trash Bags", price: 180, quantity: "1 roll", category: "Household Essentials", img: "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/600-600/112404--01--1555686659.jpeg" },
    { id: 39, item: "Aluminum Foil", price: 150, quantity: "1 roll", category: "Household Essentials", img: "https://m.media-amazon.com/images/I/71QSY+GchOL._AC_SL1500_.jpg" },
    { id: 40, item: "Storage Containers", price: 500, quantity: "4 pcs", category: "Household Essentials", img: "https://racks.lk/wp-content/uploads/2025/03/Bamboo-Lid-Glass-Food-Storage-Container-Square-in-Sri-Lanka-%E2%80%93-Airtight-Leakproof-in-Colombo-2.webp" },
  
    { id: 41, item: "Water melon", price: 220, quantity: "500 g", category: "Fruits & Vegetables", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCR2eBUKsjuLAl0oqz7YvkZJFU1C3znejG4g&s" },
    { id: 42, item: "Strawberies", price: 700, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzVTiBe0Ew2KrhpQWmE9q9w3uK5dcON5Zl8A&s" },
    { id: 43, item: "Ice Cream", price: 300, quantity: "1 tub", category: "Frozen & Refrigerated Foods", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzYD3fzBdT3VpyUzJp0gBJMdH3-pco5VZ7Qg&s" },
    { id: 44, item: "Yogurt", price: 150, quantity: "500 ml", category: "Dairy & Eggs", img: "https://i5.walmartimages.com/seo/Chobani-2-Greek-Yogurt-Strawberry-Banana-on-the-Bottom-5-3-oz-Plastic_059afa5d-5255-4434-b877-e8ea821e4fbe.4a2ab3c827860b1be0999521dde2dd26.png" },
    { id: 45, item: "Cheese", price: 400, quantity: "250 g", category: "Dairy & Eggs", img: "https://fhafnb.com/wp-content/uploads/2023/09/types-of-cheese-and-uses-1.jpg" },
  
    { id: 46, item: "Cooking Oil", price: 500, quantity: "1 liter", category: "Groceries", img: "https://ch-api.healthhub.sg/api/public/content/3a7cef95492a4d0ea4a41894b6645126?v=151b3eea" },
    { id: 47, item: "Salt", price: 350, quantity: "1 kg", category: "Groceries", img: "https://static.vegsoc.org/app/uploads/2024/07/shutterstock_2315756181-708x480.jpg" },
    { id: 48, item: "Sugar", price: 490, quantity: "1 kg", category: "Groceries", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfwKqEfCDJBjSgiVr089d0hh_Dz_pst6N5mw&s" },
    { id: 49, item: "Lentils", price: 130, quantity: "1 kg", category: "Groceries", img: "https://www.keepingthepeas.com/wp-content/uploads/2022/11/red-lentils-in-wood-bowl.jpg" },
    { id: 50, item: "Flour", price: 160, quantity: "1 kg", category: "Groceries", img: "https://i0.wp.com/pam-main-website-media.s3.amazonaws.com/wp-content/uploads/2024/03/06110224/Wheat-Flour-Title-Page.jpg?ssl=1" },
  
      { id: 51, item: "Green Peas", price: 180, quantity: "500 g", category: "Groceries", img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/green-peas-thumb.jpg" },
      { id: 52, item: "Carrots", price: 140, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://www.tasteofhome.com/wp-content/uploads/2019/01/carrots-shutterstock_789443206.jpg" },
      { id: 53, item: "Cabbage", price: 100, quantity: "1 head", category: "Fruits & Vegetables", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbvMX3mVI7kzjNPJtFV0ChrC-xTUxQpPeEQ&s" },
      { id: 54, item: "Oranges", price: 250, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://www.allrecipes.com/thmb/y_uvjwXWAuD6T0RxaS19jFvZyFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1205638014-2000-d0fbf9170f2d43eeb046f56eec65319c.jpg" },
      { id: 55, item: "Grapes", price: 300, quantity: "1 kg", category: "Fruits & Vegetables", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCaSUv7rhNDxj6yq2R3a4kes3rLpSeRsQu8Q&s" },
      { id: 56, item: "Green Tea", price: 230, quantity: "25 bags", category: "Snacks & Beverages", img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/02/green-tea-7f82bbf.jpg?quality=90&resize=556,505" },
      { id: 57, item: "Hot Chocolate", price: 280, quantity: "250 g", category: "Snacks & Beverages", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnurlPAU_aWo5JU6M5OrP1aPhOjiPZkopKEw&s" },
      { id: 58, item: "Instant Noodles", price: 90, quantity: "2 packs", category: "Groceries", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBIgO91EDls6-Bu2VhYufv4wE-r-QYt8XMZg&s" },
      { id: 59, item: "Macaroni", price: 120, quantity: "500 g", category: "Groceries", img: "https://chefsmandala.com/wp-content/uploads/2018/02/Macaroni-or-Gomiti-Pasta-shutterstock_394383733.jpg" },
      { id: 60, item: "Cornflakes", price: 290, quantity: "500 g", category: "Groceries", img: "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/113655--01--1630425906.jpeg" },
      { id: 61, item: "Body Lotion", price: 350, quantity: "200 ml", category: "Personal Care", img: "https://luvesence.com/cdn/shop/files/34_1000x1000.png?v=1688354744" },
      { id: 62, item: "Face Wash", price: 270, quantity: "100 ml", category: "Personal Care", img: "https://cdn.viana.lk/wp-content/uploads/2022/12/new-face-wash-collection-final.jpg" },
      { id: 63, item: "Shaving Cream", price: 180, quantity: "150 g", category: "Personal Care", img: "https://humanheartnature.com/buy/pub/media/catalog/product/m/e/mens-shaving-cream-500x500.jpg" },
      { id: 64, item: "Mouthwash", price: 200, quantity: "250 ml", category: "Personal Care", img: "https://i.chaldn.com/_mpimage/listerine-cool-mint-liquid-mouthwash-250-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D130235&q=best&v=1" },
      { id: 65, item: "Nail Cutter", price: 100, quantity: "1 pc", category: "Personal Care", img: "https://www.gladking.com.ph/cdn/shop/products/49616552_A.jpg?v=1655862853" },
      { id: 66, item: "Shaving Razor", price: 220, quantity: "2 pcs", category: "Personal Care", img: "https://www.eshop.lk/wp-content/uploads/2023/03/shaving-razor.jpg" },
      { id: 67, item: "Band-aids", price: 60, quantity: "20 strips", category: "Health & Medicine", img: "https://i.guim.co.uk/img/media/e44a4c4913d2c065bdb5525216ef67436e0e7369/0_1159_2290_1374/master/2290.jpg?width=465&dpr=1&s=none&crop=none" },
      { id: 68, item: "Cold & Flu Tablets", price: 180, quantity: "10 tablets", category: "Health & Medicine", img: "https://assets.truemeds.in/Images/ProductImage/TM-TACR1-048535/nicip-cold-and-flu-tablet-10_nicip-cold-and-flu-tablet-10--TM-TACR1-048535_1.png" },
      { id: 69, item: "Pain Relief Gel", price: 300, quantity: "100 g", category: "Health & Medicine", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSGoXYOui_lnSJa4ycworQsEKAIgpPnvW_KQ&s" },
      { id: 70, item: "Glucose Powder", price: 150, quantity: "200 g", category: "Health & Medicine", img: "https://www.goodlife.co.ke/wp-content/smush-webp/2022/08/GLUCOSE.jpg.webp" },
      { id: 71, item: "Garbage Bin", price: 650, quantity: "1 pc", category: "Household Essentials", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGDIcIA82CAcFiI_N2bT8Osm0mCtACGGz3LQ&s" },
      { id: 72, item: "Plastic Wrap", price: 100, quantity: "1 roll", category: "Household Essentials", img: "https://www.jtc.lk/wp-content/uploads/2023/09/shrink-wrap-jtc.jpg" },
      { id: 73, item: "Measuring Cups", price: 200, quantity: "1 set", category: "Household Essentials", img: "https://img.drz.lazcdn.com/collect/my/p/2bd446df6e9add4209f5a799faad326e.jpg_960x960q80.jpg_.webp" },
      { id: 74, item: "Spatula Set", price: 350, quantity: "3 pcs", category: "Household Essentials", img: "https://www.megadeals.lk/wp-content/uploads/2024/05/the-better-home-silicone-spatula-set-pack-of-12-product-images-orvnfq56fqy-p600774848-0-202304211052.webp" },
      { id: 75, item: "Cutting Board", price: 300, quantity: "1 pc", category: "Household Essentials", img: "https://www.ozbraai.com.au/wp-content/uploads/2023/02/Square-White.jpg" },
      { id: 76, item: "Floor Cleaner", price: 400, quantity: "1 liter", category: "Cleaning Supplies", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8dCnxGTajtM7a3upvkiGPBvqbQKs1inlfyX0COnRLnOSy3_hYhxNwvKwIJ7-momdDslM&usqp=CAU" },
      { id: 77, item: "Glass Cleaner", price: 200, quantity: "500 ml", category: "Cleaning Supplies", img: "https://i0.wp.com/mll.lk/wp-content/uploads/2024/10/Untitled-design-44-1.png?fit=800%2C800&ssl=1" },
      { id: 78, item: "Hand Gloves", price: 120, quantity: "1 pair", category: "Cleaning Supplies", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5X73x2vJpNpnJ90go-mT-qqwyG6b9T-_BTg&s" },
      { id: 79, item: "Toilet Cleaner", price: 250, quantity: "1 liter", category: "Cleaning Supplies", img: "https://essstr.blob.core.windows.net/essimg/ItemAsset/Pic124600_20230524122219.jpg" },
      { id: 80, item: "Room Freshener", price: 180, quantity: "1 can", category: "Cleaning Supplies", img: "https://m.media-amazon.com/images/I/714YnxXRqXL.jpg" },
      { id: 81, item: "Chocolate Bar", price: 80, quantity: "1 bar", category: "Snacks & Beverages", img: "https://s7d2.scene7.com/is/image/hersheysassets/0_34000_00240_5_701_24000_097_Item_Front?fmt=webp-alpha&hei=908&qlt=75" },
      { id: 82, item: "Cookies", price: 150, quantity: "1 pack", category: "Snacks & Beverages", img: "https://cdn.loveandlemons.com/wp-content/uploads/2020/12/cookie-recipes-480x270.jpg" },
      { id: 83, item: "Peanut Butter", price: 320, quantity: "500 g", category: "Groceries", img: "https://images.getrecipekit.com/20230102102018-peanut_butter_01_520x500.webp?aspect_ratio=1:1&quality=90&" },
      { id: 84, item: "Jam", price: 260, quantity: "500 g", category: "Groceries", img: "https://itsnotcomplicatedrecipes.com/wp-content/uploads/2022/01/Strawberry-Jam-Feature.jpg" },
      { id: 85, item: "Honey", price: 400, quantity: "500 ml", category: "Groceries", img: "https://store.philusa.com.ph/cdn/shop/products/LovemyHoneyfront_700x700.jpg?v=1676256704" },
      { id: 86, item: "Energy Drink", price: 150, quantity: "250 ml", category: "Snacks & Beverages", img: "https://kickinchicken.com/wp-content/uploads/2023/08/Red-Bull-Energy-Drink.jpg" },
      { id: 87, item: "Soda", price: 100, quantity: "1 bottle", category: "Snacks & Beverages", img: "https://fratellisnewyorkpizza.com/wp-content/uploads/2020/08/Drinks.jpg" },
      { id: 88, item: "Tonic Water", price: 130, quantity: "1 bottle", category: "Snacks & Beverages", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROdd2YncA9LUogF784PngUxpx4XmAQ_r1L9Q&s" },
      { id: 89, item: "Ice Cubes", price: 80, quantity: "1 tray", category: "Frozen & Refrigerated Foods", img: "https://www.pjponline.com/wp-content/uploads/2020/02/shutterstock_124411843-1024x379.jpg" },
      { id: 90, item: "Chocolate Ice cream", price: 450, quantity: "1 bowl", category: "Frozen & Refrigerated Foods", img: "https://buttermilkbysam.com/wp-content/uploads/2023/07/no-churn-chocolate-ice-cream-7.jpg" },
      { id: 91, item: "Chewing Gum", price: 40, quantity: "1 pack", category: "Snacks & Beverages", img: "https://static.toiimg.com/thumb/msid-114911367,width-1280,height-720,imgsize-62458,resizemode-6,overlay-toi_sw,pt-32,y_pad-40/photo.jpg" },
      { id: 92, item: "Mints", price: 30, quantity: "1 pack", category: "Snacks & Beverages", img: "https://oldestsweetshop.co.uk/cdn/shop/products/scotch_mints_1.jpg?v=1592815072" },
      { id: 93, item: "Oats", price: 200, quantity: "1 kg", category: "Groceries", img: "https://images.immediate.co.uk/production/volatile/sites/30/2023/08/Porridge-oats-d09fae8.jpg" },
      { id: 94, item: "Pasta Sauce", price: 300, quantity: "500 ml", category: "Groceries", img: "https://cookingwithelo.com/wp-content/uploads/2022/10/Creamy-pasta-sauce-without-cream.jpg" },
      { id: 95, item: "Mayonnaise", price: 250, quantity: "400 g", category: "Groceries", img: "https://forksandfoliage.com/wp-content/uploads/2022/09/easy-mayonnaise-immersion-blender-1-2-500x500.jpg" },
      { id: 96, item: "Mustard", price: 180, quantity: "250 g", category: "Groceries", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU3nkT9U2Htl6DPNTwBY0_GyCXvB-xo19Nn3GpLAyKrqPdvMgLBMoLmYb4EHVyUjDUwaw&usqp=CAU" },
      { id: 97, item: "Ketchup", price: 150, quantity: "500 g", category: "Groceries", img: "https://i5.walmartimages.com/asr/02cf7074-7985-4042-bf81-2cd710e9f970.3b6cd7f853c5f7d872d935aa90179576.jpeg" },
      { id: 98, item: "Barbecue Sauce", price: 280, quantity: "500 ml", category: "Groceries", img: "https://cdn.loveandlemons.com/wp-content/uploads/2023/05/bbq-sauce-recipe.jpg" },
      { id: 99, item: "Pickles", price: 200, quantity: "500 g", category: "Groceries", img: "https://www.rumispice.com/cdn/shop/articles/middle-eastern-pickles-286819.jpg?v=1660114739c" },
      { id: 100, item: "Cooking Cream", price: 350, quantity: "250 ml", category: "Groceries", img: "https://essstr.blob.core.windows.net/essimg/ItemAsset/Pic125364_20230815102056.jpg" },
      { id: 101, item: "Baby Diapers", price: 500, quantity: "20 pcs", category: "Baby Items", img: "https://cdn.kiddoz.lk/media/catalog/product/d/f/dffhfjfhjfhf.webp?width=240&height=300&store=en&image-type=small_image" },
      { id: 102, item: "Baby Wipes", price: 150, quantity: "80 wipes", category: "Baby Items", img: "https://buyvelona.com/wp-content/uploads/2019/09/VC-WW-WOF.png" },
      { id: 103, item: "Baby Powder", price: 200, quantity: "400 g", category: "Baby Items", img: "https://i5.walmartimages.com/asr/eb71dada-b953-4ed3-806f-c93973bd5e44.dd22d42f1ddc8344ece4a3fcf59287dc.jpeg" },
      { id: 104, item: "Baby Lotion", price: 220, quantity: "200 ml", category: "Baby Items", img: "https://www.pipettebaby.com/cdn/shop/files/Baby_BabyLotion_Vanilla.jpg?v=1741102489" },
      { id: 105, item: "Baby Shampoo", price: 240, quantity: "250 ml", category: "Baby Items", img: "https://www.pipettebaby.com/cdn/shop/files/Baby_ShampooWash_Vanilla.jpg?v=1742228291" },
      { id: 106, item: "Body wash", price: 600, quantity: "500 ml", category: "Personal Care", img: "https://cdn11.bigcommerce.com/s-d7wmc7b75m/images/stencil/1280x1280/products/474/2955/Body_Upsize_Collection__09908__28337.1726062650.jpg?c=2" },
      { id: 107, item: "Paper Towels", price: 160, quantity: "2 rolls", category: "Paper Products", img: "https://m.media-amazon.com/images/I/810MiMX4bEL._AC_UF1000,1000_QL80_.jpg" },
      { id: 108, item: "Napkins", price: 90, quantity: "100 pcs", category: "Paper Products", img: "https://www.shop.phoenix.lk/wp-content/uploads/2024/08/Napkin-Option-1.png" },
      { id: 109, item: "Broccoli", price: 120, quantity: "500 g", category: "Fruits & Vegetables", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HI921PGF_R6Kqm0ESAHt9BT9snCb1lghkQ&s" },
      { id: 110, item: "Printer Paper", price: 250, quantity: "500 sheets", category: "Paper Products", img: "https://www.platinumcopiers.com/website/wp-content/uploads/2020/04/shutterstock_32652847.jpg" },
      { id: 116, item: "Tooth brush", price: 100, quantity: "1", category: "Personal Care", img: "https://m.media-amazon.com/images/I/614jZkgfhOL._AC_UF1000,1000_QL80_.jpg" },
  { id: 117, item: "Cat Food", price: 400, quantity: "1 kg", category: "Pet Supplies", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyjGWi_aFA3RO6obbZST0nTP_dA4QR_xd3dA&s" },
  { id: 118, item: "Pet toys", price: 300, quantity: "5 kg", category: "Pet Supplies", img: "https://images.ctfassets.net/82d3r48zq721/r0ScftLsdRn5wEbSM7nUY/f28472f52a22defbd3791988935830a6/Puppy-chewing-dog-toy_resized.jpg?w=800&q=50" },
  { id: 119, item: " Barley", price: 250, quantity: "300 g", category: "Groceries", img: "https://fresh4less.co.nz/storage/2024/11/Barley-Pearl-Hulled.jpg" },
  { id: 120, item: "Wheat", price: 150, quantity: "300 g", category: "Groceries", img: "https://cdn.britannica.com/80/157180-050-7B906E02/Heads-wheat-grains.jpg" },
  { id: 121, item: "Notebook", price: 50, quantity: "1 pc", category: "Stationery", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlG-StGiH45KXCTAfy-KrHT3LVZLQvKRBwYw&s" },
  { id: 122, item: "Pen", price: 10, quantity: "1 pc", category: "Stationery", img: "https://m.media-amazon.com/images/S/aplus-media/sc/934fe2e9-2f19-408f-b9a7-5d9e5b30b7eb.__CR1223,0,300,300_PT0_SX300_V1___.jpg" },
  { id: 123, item: "Pencil", price: 5, quantity: "1 pc", category: "Stationery", img: "https://opusartsupplies.com/cdn/shop/collections/graphite-pencils-mixed-IMG_6720-01a.jpg?v=1706918269&width=1000" },
  { id: 124, item: "Highlighter", price: 30, quantity: "1 pc", category: "Stationery", img: "https://www.alotmall.com/cdn/shop/products/Staedtler-Textsurfer-classic-Vintage-Pastel-Highlighter-1.jpg?v=1612171579" },
  { id: 125, item: "Eraser", price: 15, quantity: "1 pc", category: "Stationery", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ608MZyC6bQ252x4bcHV8Dr2-VlIPmKe1iPg&s" },
  { id: 126, item: "Wireless Mouse", price: 450, quantity: "1 pc", category: "Electronics", img: "https://celltronics.lk/wp-content/uploads/2025/02/Baseus-F01A-Creator-Wireless-Mouse-600x600.jpg" },
  { id: 127, item: "Bluetooth Headphones", price: 1200, quantity: "1 pc", category: "Electronics", img: "https://5.imimg.com/data5/SELLER/Default/2022/8/ZQ/RU/XY/12731052/drumstone-neckband-bluetooth-headset-8hrs-playtime-in-ear-around-neck-bluetooth-headset-500x500.jpg" },
  { id: 128, item: "Smartphone Charger", price: 300, quantity: "1 pc", category: "Electronics", img: "https://media.takealot.com/covers_tsins/47720678/47720678-1-pdpxl.jpg" },
  { id: 129, item: "Portable Speaker", price: 800, quantity: "1 pc", category: "Electronics", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy6wb-QeG26szfKEQ0vYbacMrq_t0WOEjv1Q&s" },
  { id: 130, item: "Smartwatch", price: 2500, quantity: "1 pc", category: "Electronics", img: "https://images-cdn.ubuy.co.in/633b12488d2edc65997f4c20-smart-watch-bluetooth-smartwatch-touch.jpg" },
  { id: 131, item: "Yoga Mat", price: 700, quantity: "1 pc", category: "Sports & Fitness", img: "https://metrohome.lk/wp-content/uploads/2024/12/Best-Yoga-Mats-Rolled-Cover-750x500-2-e1684864651968.jpg" },
  { id: 132, item: "Dumbbells", price: 1500, quantity: "2 pcs", category: "Sports & Fitness", img: "https://www.hammer-fitness.ch/ch-en/media/catalog/product/4/7/4741-hammer-kompakthantel-pu-hantel-2_5-kg-01-solo.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700" },
  { id: 133, item: "Skipping Rope", price: 250, quantity: "1 pc", category: "Sports & Fitness", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlxccRukThW6RiIRFqEw0GUc-b7g8Dw6U3zPlpIeb1FFpX23j6MlvQMnA_736fe5WDkZY&usqp=CAU" },
  { id: 134, item: "Kettlebell", price: 1200, quantity: "1 pc", category: "Sports & Fitness", img: "https://americanbarbell.com/cdn/shop/files/KB-1v2.jpg?v=1698731284" },
  { id: 135, item: "Gym Gloves", price: 400, quantity: "1 pair", category: "Sports & Fitness", img: "https://m.media-amazon.com/images/I/7103NHYCp3L._AC_UF1000,1000_QL80_.jpg" },
  { id: 136, item: "Frying Pan", price: 800, quantity: "1 pc", category: "Kitchenware", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpzgvvO5gjCqXtsAm_XqmylfoP0IIN0aaK7g&s" },
  { id: 137, item: "Cooking Pot", price: 1200, quantity: "1 pc", category: "Kitchenware", img: "https://i0.wp.com/www.zdenshop.com/wp-content/uploads/2024/07/04-5324.jpg?fit=1000%2C1000&ssl=1" },
  { id: 138, item: "Blender", price: 2500, quantity: "1 pc", category: "Kitchenware", img: "https://www.kitchenboutique.ca/cdn/shop/files/CBT-2000C_800x.jpg?v=1691523070" },
  { id: 139, item: "Cutlery Set", price: 700, quantity: "7 pcs", category: "Kitchenware", img: "https://img.zcdn.com.au/lf/50/hash/34715/20129360/4/56+Piece+Matte+Black+Nouveau+Stainless+Steel+Cutlery+Set.jpg" },
  { id: 140, item: "Microwave Oven", price: 6000, quantity: "1 pc", category: "Kitchenware", img: "https://bigdeals.lk/uploads/product/normal/bdlpr20ctslar.png" },
  
  
  ];

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.amount, 0);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.amount, 0);

  const addItemToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, amount: i.amount + 1 } : i
        );
      }
      return [...prev, { ...item, amount: 1 }];
    });
  };

  const decreaseItemInCart = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0)
    );
  };

  const removeItemFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    navigate("/payment", { state: { cartItems, totalAmount: calculateTotal() } });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <Header />

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 p-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full border transition duration-200 ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Cart Toggle */}
      <div className="relative p-8 bg-white/90">
        <button onClick={toggleCart} className="absolute top-4 right-6 p-2 text-blue-700 hover:text-blue-900">
          <FaShoppingCart size={28} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {getTotalItems()}
            </span>
          )}
        </button>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <img
                src={product.img}
                alt={product.item}
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.item}</h3>
                <p className="text-sm text-gray-600">{product.quantity}</p>
                <p className="text-base font-bold text-gray-700 mt-1">Rs: {formatNumbers(product.price)}</p>
                <button
                  onClick={() => addItemToCart(product)}
                  className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay + Cart Drawer */}
        {isCartOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-10"
              onClick={() => setIsCartOpen(false)}
            />
            <div className="fixed top-0 right-0 w-80 bg-white shadow-2xl rounded-l-2xl p-4 h-full overflow-y-auto z-20 transition-transform">
              <h2 className="text-xl font-bold mb-4 text-blue-800">🛒 Cart</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center bg-gray-50 p-2 rounded-lg shadow-sm"
                    >
                      <img
                        src={item.img}
                        alt={item.item}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{item.item}</p>
                        <p className="text-xs text-gray-500">
                          Rs: {formatNumbers(item.price)} x {item.amount}
                        </p>
                      </div>
                      <div className="flex gap-1 items-center">
                        <button
                          onClick={() => decreaseItemInCart(item.id)}
                          className="w-6 h-6 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          -
                        </button>
                        <button
                          onClick={() => addItemToCart(item)}
                          className="w-6 h-6 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItemFromCart(item.id)}
                          className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Cart Total */}
              {cartItems.length > 0 && (
                <>
                  <div className="mt-4 border-t pt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <strong className="text-lg text-gray-900">
                      Rs: {formatNumbers(calculateTotal())}
                    </strong>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Go to Checkout
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
