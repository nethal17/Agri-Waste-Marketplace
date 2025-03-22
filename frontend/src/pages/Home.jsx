import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Main } from "../components/Main"
import { Main2 } from "../components/Main2"
import { Aboutus } from "../components/AboutUs"
import { Services } from "../components/Services"

export const Home = () => {
  return (
    
    <div>
      <Navbar />
      <Main />
      <Aboutus />
      <Services />
      <Main2 />
      <Footer />
    </div>
  )
}
