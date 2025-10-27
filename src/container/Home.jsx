import React from 'react'
// import Searchfilter from '../pages/Searchfilter'
import FeaturedProperties from '../pages/FeaturedProperties'
import PropertyList from '../pages/PropertyList'
import VerifiedProperties from '../pages/VerifiedProperties'
const Home = () => {
  return (
    <div>
      {/* <Searchfilter/> */}
      <PropertyList/>
      <FeaturedProperties/>
      <VerifiedProperties/>
    </div>
  )
}

export default Home
