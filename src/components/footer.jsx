import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="#" className="text-xl font-bold text-white hover:text-gray-200">
          Brand
        </Link>
        <p className="py-2 text-white sm:py-0">All rights reserved</p>
      </div>
    </footer>
  );
};
