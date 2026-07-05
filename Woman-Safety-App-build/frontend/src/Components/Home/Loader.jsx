import React from 'react';

function Loader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="w-20 h-20 border-4 border-transparent border-t-blue-400 animate-spin rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-transparent border-t-red-400 animate-spin rounded-full"></div>
            </div>
        </div>
    );
}

export default Loader;
