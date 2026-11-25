import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">

            <h1 className="text-6xl font-bold">
                404
            </h1>

            <p className="mt-4">
                Page not found
            </p>

            <Link
                to="/"
                className="mt-5 text-blue-600"
            >
                Return Home
            </Link>

        </div>
    );
}

export default NotFound;