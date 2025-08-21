import LoginForm from "@/components/forms/LoginForm";
import Branding from "@/components/forms/branding";

export default function LoginPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-900">
            {/* Left Side - Branding */}
            <div className="hidden md:flex justify-center items-center ">
                <Branding />
            </div>

            {/* Right Side - Form */}
            <div className="px-8 flex items-center justify-center bg-gray-800">
                <LoginForm />
            </div>
        </div>
    );
}
