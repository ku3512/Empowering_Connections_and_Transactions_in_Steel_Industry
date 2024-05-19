import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage';
import Biding from './Components/Biding/Biding';
// import ViewBiding from './Components/AllBids/ViewBiding';
import MobileLogin from './Components/Login';
import MobileRegister from './Components/Register';
import OtpLogin from './Components/OtpLogin';
import GstRegistration from './Components/GstRegistration';
import OtpRegister from './Components/OtpRegister';
import Sidebar from './Components/Sidebar/Sidebar';
import SellerTransactions from './Pages/Sellers/SellerTransactions';
import BuyerRequirement from './Pages/Buyers/BuyerRequirements';
import BuyerTransaction from './Pages/Buyers/BuyerTransaction';
import Profile from './Components/Profile';
import AdminBids from './Pages/Admin/AdminBids';
import Members from './Pages/Admin/Members';
import Transactions from './Pages/Admin/Transactions';
import AllDetails from './Components/RequirementAllDetail';
import RequirementList from './Components/RequirementList';
import RequirementDetails from './Components/NewRequirementDetails';
import MobileRegistration from './Components/MobileRegistration';
import AboutUs from './Components/AboutUs';
import Support from './Components/Support';
import SellerPost from './Pages/Sellers/SellerPost';
import SellerAllBids from './Pages/Sellers/SellerBidHistory/SellerAllBids';
import PostNewRequirement from './Pages/Sellers/PostNewRequirement';
import NewRequirement from './Pages/Buyers/NewRequirement';
import SheetPlate from './Pages/Sellers/PostNewRequirement/SheetPlate';
import Coil from './Pages/Sellers/PostNewRequirement/Coil';
import Flat from './Pages/Sellers/PostNewRequirement/Flat';
import Angle from './Pages/Sellers/PostNewRequirement/Angle';
import Wire from './Pages/Sellers/PostNewRequirement/Wire';
import MarketTrande from './Components/MarketTrends';
import RoundPipe from './Pages/Sellers/PostNewRequirement/RoundPipe';
import SquarePipe from './Pages/Sellers/PostNewRequirement/SquarePipe';
import RoundRod from './Pages/Sellers/PostNewRequirement/RoundRod';
import SquareRod from './Pages/Sellers/PostNewRequirement/SquareRod';
import LivePostFromSeller from './Pages/Buyers/LivePostFromSeller';
import LiveRequirements from './Pages/Sellers/LiveRequirements';
import BuyerAllBids from './Pages/Buyers/BuyerBidHistory/BuyerBidHistory';
import BuyerHistory from './Pages/Buyers/BuyerBidHistory';
import BuyerBids from './Pages/Buyers/MyBids';
import BidStatus from './Pages/Sellers/BidStatus';
import SellerBidsHistory from './Pages/Sellers/SellerBidHistory';
import BuyerUserAllBids from './Pages/Buyers/BuyerUserAllBids';
import SellerUserAllBids from './Pages/Sellers/SellerUserAllBids';
import ProtectedRoute from './Components/ProtectedRoute';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* unprotected routes */}
          <Route path="/registration" element={<MobileRegistration />} />
          <Route path="/login" element={<MobileLogin />} />
          <Route path="/register" element={<MobileRegister />} />
          <Route path="/otplogin" element={<OtpLogin />} />
          <Route path="/gst" element={<GstRegistration />} />
          <Route path="/otpregister" element={<OtpRegister />} />

          {/* protected routes */}
          <Route path="/" element={<ProtectedRoute Component={HomePage} />} />
          <Route path="/profile" element={<ProtectedRoute Component={Profile} />} />
          <Route path="/alldetails/:id" element={<ProtectedRoute Component={AllDetails} />} />
          <Route path="/biding" element={<ProtectedRoute Component={Biding} />} />
          <Route path="/buyeruserallbids/:id" element={<ProtectedRoute Component={BuyerUserAllBids} />} />
          <Route path="/selleruserallbids/:id" element={<ProtectedRoute Component={SellerUserAllBids} />} />
          <Route path="/buyerallbids/:id" element={<ProtectedRoute Component={BuyerAllBids} />} />
          <Route path="/sellerallbids/:id" element={<ProtectedRoute Component={SellerAllBids} />} />
          <Route path="/newrequirement" element={<ProtectedRoute Component={NewRequirement} />} />
          <Route path="/newrequirementdetails" element={<ProtectedRoute Component={RequirementDetails} />} />
          <Route path="/sellerbidhistory" element={<ProtectedRoute Component={SellerBidsHistory} />} />
          <Route path="/bidstatus" element={<ProtectedRoute Component={BidStatus} />} />
          <Route path="/sellertransaction" element={<ProtectedRoute Component={SellerTransactions} />} />
          <Route path="/buyerrequirement" element={<ProtectedRoute Component={BuyerRequirement} />} />
          <Route path="/buyertransaction" element={<ProtectedRoute Component={BuyerTransaction} />} />
          <Route path="/adminbids" element={<ProtectedRoute Component={AdminBids} />} />
          <Route path="/members" element={<ProtectedRoute Component={Members} />} />
          <Route path="/admintransactions" element={<ProtectedRoute Component={Transactions} />} />
          <Route path="/requirementlist" element={<ProtectedRoute Component={RequirementList} />} />
          <Route path="/buyerhistory" element={<ProtectedRoute Component={BuyerHistory} />} />
          <Route path="/buyerbids" element={<ProtectedRoute Component={BuyerBids} />} />
          <Route path="/aboutus" element={<ProtectedRoute Component={AboutUs} />} />
          <Route path="/support" element={<ProtectedRoute Component={Support} />} />
          <Route path="/sellerpost" element={<ProtectedRoute Component={SellerPost} />} />
          <Route path="/postnewrequirement" element={<ProtectedRoute Component={PostNewRequirement} />} />
          <Route path="/sheetplate/:name" element={<ProtectedRoute Component={SheetPlate} />} />
          <Route path="/coil/:name" element={<ProtectedRoute Component={Coil} />} />
          <Route path="/roundpipe/:name" element={<ProtectedRoute Component={RoundPipe} />} />
          <Route path="/squarepipe/:name" element={<ProtectedRoute Component={SquarePipe} />} />
          <Route path="/flat/:name" element={<ProtectedRoute Component={Flat} />} />
          <Route path="/angle/:name" element={<ProtectedRoute Component={Angle} />} />
          <Route path="/roundrod/:name" element={<ProtectedRoute Component={RoundRod} />} />
          <Route path="/squarerod/:name" element={<ProtectedRoute Component={SquareRod} />} />
          <Route path="/wire/:name" element={<ProtectedRoute Component={Wire} />} />
          <Route path="/markettrends" element={<ProtectedRoute Component={MarketTrande} />} />
          <Route path="/livepost" element={<ProtectedRoute Component={LivePostFromSeller} />} />
          <Route path="/liverequirements" element={<ProtectedRoute Component={LiveRequirements} />} />


          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Sidebar />
      </BrowserRouter>
    </>
  );
}

export default App;
