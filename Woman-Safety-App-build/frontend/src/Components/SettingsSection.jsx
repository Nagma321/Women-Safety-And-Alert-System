import React from 'react'

const SettingsSection = ({ title, children }) => (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <h2 className="font-semibold text-gray-700 p-4 border-b border-gray-100">{title}</h2>
        {children}
    </div>
)

export default SettingsSection