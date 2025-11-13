export default function MissionSection() {
    return (
        <section className="bg-[#2852B4] w-full py-16 px-4 md:px-0 flex flex-col items-center">
            <h2 className="text-white text-2xl md:text-3xl font-semibold mb-10 text-center">
                Our Mission & Vision
            </h2>
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch">
                {/* Mission */}
                <div className="bg-white rounded-md shadow-lg px-6 py-8 flex-1 min-w-[300px] flex flex-col items-center text-center border border-gray-100">
                    <h3 className="font-medium text-neutral-800 text-lg mb-3">Mission</h3>
                    <p className="text-neutral-700 text-sm md:text-base">
                        To promote excellence, protect members' rights, and uphold the highest standards of aviation safety and ethics through advocacy, collaboration, and continuous professional development.
                    </p>
                </div>
                {/* Vision */}
                <div className="bg-white rounded-md shadow-lg px-6 py-8 flex-1 min-w-[300px] flex flex-col items-center text-center border border-gray-100">
                    <h3 className="font-medium text-neutral-800 text-lg mb-3">Vision</h3>
                    <p className="text-neutral-700 text-sm md:text-base">
                        To be the leading voice and unifying force for aircraft pilots and engineers in Nigeria, championing safety, professionalism, and integrity across the aviation industry.
                    </p>
                </div>
            </div>
        </section>
    );
}
