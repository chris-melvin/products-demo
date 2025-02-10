import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Listing Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to our product listing demo, you can check out the different
            pages below.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Public Routes
            </h2>
            <div className="space-y-4">
              <Link
                href="/sign-up"
                className="block text-blue-600 hover:text-blue-800"
              >
                Sign Up - Create a new merchant account to manage products
              </Link>
              <Link
                href="/sign-in"
                className="block text-blue-600 hover:text-blue-800"
              >
                Sign In - Access your merchant dashboard
              </Link>
              <Link
                href="/store/products"
                className="block text-blue-600 hover:text-blue-800"
              >
                Store - Browse all available products (public access)
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Protected Routes
            </h2>
            <Link
              href="/dashboard/products"
              className="block text-blue-600 hover:text-blue-800"
            >
              Dashboard - Manage your products (requires authentication)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
