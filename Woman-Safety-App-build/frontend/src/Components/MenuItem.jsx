import React, { useState } from 'react'
import { ChevronRight, Save, Loader } from "lucide-react"

const MenuItem = ({ 
    icon: Icon, 
    label, 
    onUpdate, 
    initialValue = "", 
    isLoading = false,
    error = "",
    validation = (value) => ""  
}) => {
    const [value, setValue] = useState(initialValue)
    const [isEditing, setIsEditing] = useState(false)
    const [validationError, setValidationError] = useState("")

    const handleSubmit = () => {
       
        const validationResult = validation(value);
        if (validationResult) {
            setValidationError(validationResult);
            return;
        }

        setValidationError("");
        onUpdate(value);
        setIsEditing(false);
    }

    return (
        <div className="w-full flex flex-col">
            <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="flex-1 text-left text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <input 
                                className={`px-2 py-1 text-sm text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    (error || validationError) ? 'border-red-500' : 'border-gray-300'
                                }`}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setValidationError("");
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                autoFocus
                                disabled={isLoading}
                            />
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`h-8 px-3 flex items-center gap-1 text-sm font-medium rounded-md transition-colors
                                    ${isLoading ? 
                                        'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                                        'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                            >
                                {isLoading ? (
                                    <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <span 
                                className={`text-sm cursor-pointer ${
                                    error ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                                onClick={() => !isLoading && setIsEditing(true)}
                            >
                                {value || "Click to edit"}
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </>
                    )}
                </div>
            </div>
            {(error || validationError) && (
                <div className="px-4 py-1 text-sm text-red-500">
                    {error || validationError}
                </div>
            )}
        </div>
    )
}

export default MenuItem