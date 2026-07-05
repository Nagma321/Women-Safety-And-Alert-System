const TestimonialCard = ({ name, content }) => (
    <div className='w-full p-1 bg-white rounded-lg border-2 border-dotted border-black h-[40vh] md:h-[45vh] md:w-[45%] transition-transform hover:scale-[1.02]'>
        <div className='w-full p-2'>
            <img className='h-6' src="/logo.svg" alt="Logo" />
        </div>
        <p className='h-[70%] font-semibold text-[15px] text-wrap text-center border-b-[1px] border-black flex items-center justify-center px-4'>
            {content}
        </p>
        <div className='w-full p-1'>
            <h2 className='font-bold text-xl'>{name}</h2>
        </div>
    </div>
);


export default TestimonialCard