import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FolderKanban, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center space-x-2 text-blue-600">
                    <FolderKanban size={28} />
                    <h1 className="text-xl font-bold">Finamite Assignment</h1>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium hidden sm:inline">Welcome, {user.name}</span>
                        <button 
                            onClick={logout}
                            className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                        >
                            <LogOut size={16} className="mr-1" /> Logout
                        </button>
                    </div>
                )}
            </header>
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
                <p className="text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Finamite Assignment. Built with React & Node.js
                </p>
            </footer>
        </div>
    );
};

export default Layout;