import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';


export default function LandingPage() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    const howItWorks = [
        {
            title: "Step 1: Upload Your Document to Get Started",
            description: "Easily upload your PDF documents to Axna. Our platform supports PDF formats, ensuring a seamless experience.",
            image: "/images/upload.png"
        },
        {
            title: "Step 2: Generate Interactive Quizzes and Flashcards",
            description: "Axna transforms your PDFs into interactive quizzes, summaries, and flashcards, making studying engaging and effective.",
            image: "/images/interactive.png"
        },
        {
            title: "Step 3: Track Your Progress and Reinforce Learning",
            description: "Monitor your learning journey with Axna's progress tracking features. Stay motivated and see how much you've learned.",
            image: "/images/progress.png"
        }
    ]

    const faqArray = [
        {
            question: "What is Axna?",
            answer: "Axna is an AI-powered tool that transforms PDFs into interactive study materials. It allows users to create quizzes, summaries, and flashcards from any document. This innovative approach helps streamline the studying process."
        },
        {
            question: "How to use Axna?",
            answer: "To use Axna, simply upload your PDF document. The tool will automatically generate interactive study materials tailored to the content. You can then track your progress and review key concepts."
        },
        {
            question: "Is Axna suitable for everyone?",
            answer: "Yes, Axna is designed for students, professionals, and anyone looking to enhance their learning. Whether you're preparing for exams or reviewing materials, it caters to diverse learning needs. The interactive features make studying more engaging."
        },
        {
            question: "What formats does Axna support?",
            answer: "Axna primarily supports PDF formats, allowing users to upload and convert their documents easily. This ensures that a wide range of study materials can be utilized. Future updates may expand format compatibility."
        }
    ]

    return (
        <div>
            <div className='h-screen w-full'>
                <nav className="flex justify-between items-center p-4">
                    <span className="arima"><Link to="/">AXNA</Link></span>
                    <span className="karla"><Link to="/signin"><InteractiveHoverButton className='uppercase text-sm'>Sign in</InteractiveHoverButton></Link></span>
                </nav>
                <div className='flex flex-col justify-center h-[60vh] px-5 w-full'>
                    <h1 className='arima uppercase lg:text-[400px] md:text-[250px] text-[120px] mt-10'>Axna</h1>
                    <p className='karla font-medium karla lg:-mt-40 -mt-12 lg:text-xl lg:pl-4 uppercase'><span className='text-blue-500 font-bold'>A</span>I-powered e<span className='text-blue-500 font-bold'>X</span>plainer for <span className='text-blue-500 font-bold'>N</span>otes & <span className='text-blue-500 font-bold'>A</span>ssessments</p>
                    <p className='karla px-5 md:w-5/6 lg:w-3/5 ml-auto text-end mt-30'><span className='font-bold'>Axna</span> is your AI-powered companion that transforms ordinary PDFs into engaging study materials. Upload your documents now and unlock quizzes, summaries, and flashcards designed just for <span className='text-blue-500 font-bold'>you</span>.</p>
                </div>
            </div>
            <div className='mt-10'>
                <p className='text-center font text-sm karla-bold -mb-10'>Transform</p>
                <div className='flex flex-col md:flex-row justify-center gap-10 px-10 mt-20'>
                    <div >
                        <h2 className='font-semibold text-5xl arima'>Unlock Your Learning Potential with Axna's Innovative Study Solutions</h2>
                        <p className='karla pt-5'>With Axna, you can study smarter by transforming any PDF into interactive quizzes and flashcards. Track your progress effortlessly and reinforce your understanding of key concepts, ensuring you retain what you learn.</p>
                    </div>
                    <div>
                        <div className='md:w-xl bg-gray-400 aspect-video w-80 rounded-xl'></div>
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <div className='flex flex-col md:flex-row justify-center px-10 mt-20 gap-10'>
                    <div className='flex flex-col md:flex-row justify-center gap-10 mt-20'>
                        <div>
                            <div className='md:w-xl bg-gray-400 aspect-video w-80 rounded-xl'></div>
                        </div>
                        <div>
                            <h2 className='font-semibold text-5xl arima'>Experience the Future of Studying with Axna</h2>
                            <p className='karla py-5'>Axna is designed to make studying more efficient and enjoyable. By converting your PDFs into interactive formats, you can engage with your material like never before. Say goodbye to traditional studying methods and hello to a smarter way of learning.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <div className='flex flex-col md:flex-row justify-center md:px-20 px-10 mt-20'>
                    <div>
                        <h2 className='font-semibold text-5xl arima'>Discover How Axna Transforms Your Study Experience in Three Simple Steps</h2>
                    </div>
                    <div>
                        <p className='karla md:text-end text-start mt-5'>Using Axna is a breeze! Start by uploading your PDF document, and watch as it generates interactive quizzes, summaries, and flashcards tailored to your content. Stay on top of your learning by tracking your progress effortlessly.</p>
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <div className='flex flex-col sm:md:flex-row justify-center px-20 mt-20 gap-3 '>
                    {howItWorks.map((step, index) => (
                        <div key={index} className='p-5 border rounded flex flex-col items-center w-full'>
                            <div className='w-96 bg-gray-400 aspect-video rounded-sm'></div>
                            <h3 className='text-xl font-semibold arima mt-5 mb-1'>{step.title}</h3>
                            <p className='karla mt-auto'>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mt-10 flex flex-col items-center gap-2'>
                <p className='text-3xl arima'>Start Your Journey</p>
                <Link to='/signin'><InteractiveHoverButton className='cursor-pointer rounded-full text-sm'>Get Started</InteractiveHoverButton></Link>
            </div>
            <div className='mt-10'>
                <div className='flex flex-col md:flex-row justify-center px-20 mt-20 gap-20'>
                    <div>
                        <span className='arima text-4xl'>FAQ</span>
                        <p>Discover how Axna can enhance your studying experience with interactive learning tools.</p>
                    </div>
                    <div>
                        {faqArray.map((faq, index) => (
                            <div key={index} className='border-b py-4'>
                                <h3 className='font-semibold text-xl arima'>{faq.question}</h3>
                                <p className='karla mt-2'>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer>
                <p className='text-center text-7xl mt-10 arima'>AXNA</p>
                <p className='text-center text-sm arima -mt-2'>Design and Developed by <Link to="https://srivardhan.vercel.app/" target='_blank' className='underline'>@SRIVARDHAN</Link></p>
            </footer>
        </div >
    )
}