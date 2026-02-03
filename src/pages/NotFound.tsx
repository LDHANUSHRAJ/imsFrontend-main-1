import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-amber-50 p-6 rounded-full mb-6">
                <AlertTriangle className="h-16 w-16 text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold text-[#0F2137] mb-2">Page Not Found</h1>
            <p className="text-slate-500 max-w-md mb-8 text-lg">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
                <Button variant="primary" className="gap-2 px-8">
                    <Home size={18} />
                    Return Home
                </Button>
            </Link>
        </div>
    );
};

export default NotFound;
