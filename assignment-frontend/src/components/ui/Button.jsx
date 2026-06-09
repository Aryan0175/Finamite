import React from 'react';

const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    isLoading = false, 
    className = '', 
    ...props 
}) => {
    const baseStyle = "flex items-center justify-center px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 transition disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500"
    };

    return (
        <button type={type} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props} >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;