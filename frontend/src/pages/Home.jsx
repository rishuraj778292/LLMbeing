
import Hero from '../components/HomepageSection/Hero'
import GameChangerSection from '../components/HomepageSection/GameChangerSection'
import ExploreCategories from '../components/HomepageSection/ExploreCategories'
import HowItWorks from '../components/HomepageSection/HowItWorks'
import LiveProject from '../components/HomepageSection/LiveProject'
import ChooseUs from '../components/HomepageSection/ChooseUs'
import Testimonial from '../components/HomepageSection/Testimonial'
import Newsletter from '../components/HomepageSection/Newsletter'
import CtaBanner from '../components/HomepageSection/CtaBanner'
const Home = () => {
  return (
    <div>
      {/* Hero Section */}

      <Hero />

      { /* Game-Changer Section */}
      <GameChangerSection />

      {/* Explore Categories Section */}

      <ExploreCategories />

      { /* How It Works Section */}
      <HowItWorks />

      {/* Live Projects Section */}
      {/* <LiveProject /> */}
      { /* Why Choose Us Section */}

      <ChooseUs />
      {/* Testimonials Section */}

      <Testimonial />

      {/* Newsletter Section */}

      <Newsletter />


      {/* Final CTA Banner */}

      <CtaBanner />

    </div>
  )
}

export default Home