import Header from './Header'
import Footer from './Footer'
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
const Layout = ({children}) => {
   const location = useLocation();

  useEffect(() => {
    toast.dismiss(); // Clear all previous toasts on route change
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main style={{ minHeight: "80vh" }}>
        {children}</main>
      <Footer/>
    </div>
  )
}

export default Layout