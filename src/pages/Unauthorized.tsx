import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const Unauthorized = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <ShieldAlert className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-[#0F2137] mb-2">Access Denied</h1>
            <p className="text-slate-500 max-w-md mb-8 text-lg">
                You do not have the required permissions to access this page.
            </p>
            <div className="flex gap-4">
                <Link to="/dashboard">
                    <Button variant="primary" className="gap-2 px-6">
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
