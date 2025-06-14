import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFoundPage = () => {
    return (
        <div className="text-center h-[calc(100vh-200px)] flex flex-col justify-center items-center">
            <h1 className="text-9xl font-extrabold text-primary tracking-widest">404</h1>
            <div className="bg-primary text-primary-foreground px-2 text-sm rounded rotate-12 absolute">
                Page Not Found
            </div>
            <p className="mt-4 text-muted-foreground">The page you are looking for does not exist.</p>
            <Button asChild className="mt-6">
                <Link to="/">Go Home</Link>
            </Button>
        </div>
    );
};

export default NotFoundPage;