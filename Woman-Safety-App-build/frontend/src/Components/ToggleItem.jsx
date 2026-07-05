import React from 'react'

const ToggleItem = ({ icon: Icon, label, enabled, onToggle }) => (
    <div className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-none">
        <Icon className="w-5 h-5 text-gray-500" />
        <span className="flex-1 text-gray-600">{label}</span>
        <button
            onClick={onToggle}
            className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${enabled ? 'bg-red-400' : 'bg-gray-200'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : ''}`} />
        </button>
    </div>
)

export default ToggleItem