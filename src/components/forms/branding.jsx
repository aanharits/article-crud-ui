export default function Branding() {
    return (
        <div className="flex flex-col justify-center items-center text-accent-foreground relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -top-20 -left-20 w-40 h-40 md:w-64 md:h-64 bg-gray-700 rounded-full opacity-20" />
            <h1 className="text-2xl md:text-6xl font-bold mb-4 z-10 text-shadow-lg/100">
                PaperLane
            </h1>
            <p className="text-sm md:text-xl text-center font-bold max-w-sm z-10 text-shadow-lg/20 font-sans">
                Simplify your workflow and manage Notes efficiently with style.
            </p>
        </div>
    );
}
