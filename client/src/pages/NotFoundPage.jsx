import { ShoppingBasket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="grid justify-items-center gap-3 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-600 text-white"><ShoppingBasket size={22} /></span>
        <h1 className="text-2xl font-extrabold">Page not found</h1>
        <p className="text-gray-500">The page you're looking for doesn't exist.</p>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-4 font-extrabold text-white hover:bg-emerald-700"
          to="/"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
