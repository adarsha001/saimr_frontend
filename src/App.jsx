import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import Navbar from "./components/Navbar";
import AddProperty from "./pages/AddProperty";
import FeaturedProperties from "./pages/FeaturedProperties";

export default function App() {
  return (<>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<PropertyList />} />
        <Route path='/featured' element={<FeaturedProperties/>}/>
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Routes>
    </BrowserRouter>
    
        <AddProperty/>
  </>
  );
}
