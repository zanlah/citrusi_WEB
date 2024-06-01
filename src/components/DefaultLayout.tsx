import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-10">
                {children}
            </div>
            <Footer />
        </>
    )
}

export default DefaultLayout