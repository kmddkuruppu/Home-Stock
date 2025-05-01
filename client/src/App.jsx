import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";

import PaymentCheckout from "./pages/PaymentCheckout";
import AllPayments from "./pages/AllPayments";
import SinglePaymentView from "./pages/SinglePaymentView";
import AddPreOrder from "./pages/AddPreOrder";
import ViewAllPreorder from "./pages/ViewAllPreorder";
import UpdatePreorder from "./pages/UpdatePreorder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/categories/Products";





export default function App() {
  return (
    <BrowserRouter>
   
      <Routes>

      <Route path="/" element={<Login/>}/>

        <Route path="/welcome" element={<Welcome />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/products" element={<Products />}/> 
        <Route path="/payment" element={<PaymentCheckout/>}/>
        <Route path="/Allpayment" element={<AllPayments/>}/>
        <Route path="/single-payment/:id" element={<SinglePaymentView/>}/>
        <Route path="/AddpreOrder" element={<AddPreOrder/>}/>
        <Route path="/AllpreOrder" element={<ViewAllPreorder/>}/>
        <Route path="/updateorder/:id" element={<UpdatePreorder/>}/>
        
       
  
        
      </Routes>
 
    </BrowserRouter>
  );
}
