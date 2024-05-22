import Navbar from '@/components/Navbar'
import Statistics_layout from '@/components/Statistics_layout'
import React from 'react'

const Statistics = () => {
    return (
        <>
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <Statistics_layout />
        </div>
        </>
    )
}

export default Statistics