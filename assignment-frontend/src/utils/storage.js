
export const storage = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token) => localStorage.setItem('token', token),
    
    getUser: () => {
        const user = localStorage.getItem('userInfo');
        return user ? JSON.parse(user) : null;
    },
    setUser: (userData) => localStorage.setItem('userInfo', JSON.stringify(userData)),
    
    clearAll: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    }
};