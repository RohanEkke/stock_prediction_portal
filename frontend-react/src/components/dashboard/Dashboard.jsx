import React, { useEffect } from 'react'
import axiosInstence from '../../axiosInstence'

const Dashboard = () => {
    const accessToken = localStorage.getItem('accessToken')
    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstence.get('/protected-view')
                console.log('Success:', response.data)
            }
            catch(error){
                console.log('Error fetching data:', error )
            }
        }
        fetchProtectedData();
    }, [])
  return (
    <>
    <div className='text-light'>Dashboard</div>
    </>
  )
}
export default Dashboard