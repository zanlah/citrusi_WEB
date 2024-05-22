import React from 'react';

const Statistics_layout = () => {
    return (
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4 flex'>
            <div className='bg-white rounded-md p-3 w-1/2 flex-grow mr-4'>
                <h2>Main Content</h2>
            </div>
            <div className="flex flex-col w-1/2">
                <div className='bg-white rounded-md p-3 mb-4'>
                    <h2>Small Content 1</h2>
                </div>
                <div className='bg-white rounded-md p-3'>
                    <h2>Small Content 2</h2>
                </div>
            </div>
        </div>
    );
}

export default Statistics_layout;
