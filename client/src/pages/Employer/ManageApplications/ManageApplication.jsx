import React from 'react'
import Layout from '../../../components/Layout/Layout'
import AppliedApplications from './AppliedApplications'
import InterviewApplications from './InterviewApplications'
import ReviewApplications from './ReviewApplications'
import AcceptedApplications from './AcceptedApp;ications'
import RejectedApplications from './RejectedApplications'

const ManageApplication = () => {
  return (
    <Layout>
      <AppliedApplications/>
      <InterviewApplications/>
      <ReviewApplications/>
      <AcceptedApplications/>
      <RejectedApplications/>x  
    </Layout>
  )
}

export default ManageApplication
