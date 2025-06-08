import React from 'react'
import Layout from '../../../components/Layout/Layout'
import Hero1 from './Hero1'
import PostedJobList from './PostedJobList'
import OfferedSeeker from './OfferedSeeker'
import OfferAcceptedSeeker from './OfferAcceptedSeeker'
import Applications from './Applications'

const Dashboard = () => {
  return (
    <Layout>
        <Hero1/>
        <PostedJobList/>
        <Applications/>
        <OfferedSeeker/>
        <OfferAcceptedSeeker/>
    </Layout>
  )
}

export default Dashboard
