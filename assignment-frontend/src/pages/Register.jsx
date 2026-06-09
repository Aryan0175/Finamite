import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);
        try {
            await register({ name, email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100 animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Create an Account</h2>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Input label="Full Name" type="text" placeholder="e.g. Aryan Bakshi" required value={name} onChange={(e) => setName(e.target.value)} />
                    <Input label="Email address" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />

                    <Input label="Password" type="password" placeholder="Min 8 characters" required value={password} onChange={(e) => setPassword(e.target.value)} />

                    <Button type="submit" className="w-full py-2.5 bg-green-600 hover:bg-green-700 focus:ring-green-500" isLoading={isLoading} >
                        Register
                    </Button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;