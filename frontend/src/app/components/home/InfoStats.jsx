import { FaGraduationCap, FaChalkboardTeacher, FaBookOpen, FaGlobe } from 'react-icons/fa';

export default function InfoStats() {
  return (
    <section className="bg-blue-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">EduConnect in Numbers</h2>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
            Our growing community of learners and educators is making a difference worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl text-blue-300 mb-4 flex justify-center">
              <FaGraduationCap />
            </div>
            <div className="text-4xl font-bold mb-2">150K+</div>
            <div className="text-blue-100">Active Students</div>
          </div>
          
          <div>
            <div className="text-5xl text-blue-300 mb-4 flex justify-center">
              <FaChalkboardTeacher />
            </div>
            <div className="text-4xl font-bold mb-2">2,500+</div>
            <div className="text-blue-100">Expert Instructors</div>
          </div>
          
          <div>
            <div className="text-5xl text-blue-300 mb-4 flex justify-center">
              <FaBookOpen />
            </div>
            <div className="text-4xl font-bold mb-2">1,200+</div>
            <div className="text-blue-100">Courses Available</div>
          </div>
          
          <div>
            <div className="text-5xl text-blue-300 mb-4 flex justify-center">
              <FaGlobe />
            </div>
            <div className="text-4xl font-bold mb-2">85+</div>
            <div className="text-blue-100">Countries Represented</div>
          </div>
        </div>
      </div>
    </section>
  );
}