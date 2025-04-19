import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

// Dummy testimonial data
const testimonials = [
  {
    id: 1,
    content: "EduConnect transformed my teaching. The AI transcript feature saves me hours, and student engagement has increased dramatically since I started using the platform.",
    author: {
      name: "Dr. Emily Rodriguez",
      role: "Professor of Biology",
      avatar: "/images/testimonials/emily.jpg"
    },
    rating: 5
  },
  {
    id: 2,
    content: "As a working professional, I needed flexible learning options. EduConnect's video transcripts and interactive features make it easy to learn at my own pace and engage with instructors.",
    author: {
      name: "Mark Johnson",
      role: "Software Engineer",
      avatar: "/images/testimonials/mark.jpg"
    },
    rating: 4
  },
  {
    id: 3,
    content: "The community aspect of EduConnect sets it apart. I've connected with students worldwide, and the collaborative discussions have deepened my understanding of complex topics.",
    author: {
      name: "Sophia Chen",
      role: "Graduate Student",
      avatar: "/images/testimonials/sophia.jpg"
    },
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-4 left-6 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                <FaQuoteLeft className="text-white" />
              </div>
              
              <div className="flex items-center mb-4 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <Image
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.author.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}