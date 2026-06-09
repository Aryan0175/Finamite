import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            setIsLoading(false); 
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>
                
                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded">{error}</div>}
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Input 
                        label="Email address" 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                        label="Password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" className="w-full py-2.5" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>
                
                <p className="mt-6 text-sm text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;