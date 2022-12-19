import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <header className="flex justify-between p-4 mx-auto bg-yellow-450">
            <div className="flex items-center space-x-5">
                <Link href="/">
                    <img
                        className="w-44 object-contain"
                        src={"https://links.papareact.com/yvf"}
                        alt="Logo"
                    />
                </Link>
                <div className="hidden md:inline-flex items-center space-x-5">
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className="text-white bg-green-600 px-4 py-1 rounded-full">Follow</h3>
                </div>
            </div>
            <div className="flex space-x-5 items-center text-green-600">
                <h3>Sign in</h3>
                <h3 className="border rounded-full px-4 py-1 border-green-600">Get Started</h3>
            </div>
        </header>
    );
}
