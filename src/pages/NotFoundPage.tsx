import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container-page flex flex-col items-center justify-center py-12">
      <Diamond className="h-16 w-16 text-primary-600 mb-6" />
      
      <h1 className="text-4xl font-bold text-neutral-900 mb-4 text-center">Page Not Found</h1>
      
      <p className="text-neutral-600 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link
        to="/"
        className="btn-primary flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;