import React, { useState } from "react";
import styles from "./home.module.css";
import {
  FaStar,
  FaCalendarAlt,
  FaVideo,
  FaFileAlt,
  FaPills,
  FaChevronRight,
  FaCommentAlt,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../../redux/doctors/doctorsApis";

const Home = () => {
  const authData = useSelector((state) => state.auth);
  const user = authData?.user || {};
  const navigate = useNavigate();
  let role = user?.role;
  if (typeof role === "undefined") {
    role = "guest";
  }
  const doctorsQuery = useDoctors();

  const [selectedReview, setSelectedReview] = useState(0);

  const reviews = [
    {
      name: "Kareem Nasser",
      profession: "Engineer",
      review:
        "The care and expertise at this clinic are outstanding! My vision has improved significantly, and the doctors are truly dedicated.",
      stars: 5,
    },
    {
      name: "Lina Adel",
      profession: "Teacher",
      review:
        "Professional service with state-of-the-art equipment. The online consultation feature made everything so convenient for me.",
      stars: 5,
    },
    {
      name: "Mona Hisham",
      profession: "Graphic Designer",
      review:
        "Excellent experience from booking to treatment. The doctors explained everything clearly and the results exceeded my expectations.",
      stars: 5,
    },
  ];

  const services = [
    {
      icon: <FaVideo className="w-8 h-8" />,
      title: "Online Consultations",
      description:
        "Consult with top doctors via video or chat communication. It's totally secure, private, and convenient. Choose the best time for an in-person visit with our easy-to-use scheduling system, or proceed with our online consultation.",
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8" />,
      title: "Booking Appointments",
      description:
        "Choose the best time for an in-person visit with our easy-to-use scheduling system, or proceed with our online consultation features.",
    },
    {
      icon: <FaFileAlt className="w-8 h-8" />,
      title: "Prescriptions",
      description:
        "Receive and renew prescriptions digitally after your consultation with our specialists.",
    },
    {
      icon: <FaCommentAlt className="w-8 h-8" />,
      title: "Medical Notes",
      description:
        "Obtain necessary medical notes for work or school with only a few clicks of hassle.",
    },
    {
      icon: <FaPills className="w-8 h-8" />,
      title: "Medicine Refills",
      description:
        "Skip the pharmacy queues and save time + energy by ordering medicine refills online.",
    },
  ];

  const values = [
    {
      title: "Excellence",
      description:
        "We deliver top-tier eye care by blending advanced technology with personalized services to ensure the best outcomes for our patients.",
      isCenter: false,
    },
    {
      title: "Integrity",
      description:
        "Built on trust and transparency, we uphold ethical practices to provide reliable and honest eye care services.",
      isCenter: true,
    },
    {
      title: "Care",
      description:
        "We prioritize your needs with a customer-focused approach, ensuring a seamless journey from consultation to product delivery.",
      isCenter: false,
    },
    {
      title: "Accessibility",
      description:
        "We strive to make exceptional eye care affordable and convenient, ensuring everyone can benefit from our services.",
      isCenter: false,
    },
    {
      title: "Innovation",
      description:
        "Our commitment to progress drives us to use cutting-edge tools like AI diagnostics and AR try-ons for a modern eye care experience.",
      isCenter: false,
    },
  ];

  const workSteps = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up for your account",
      icon: <FaUser className="w-12 h-12" />,
    },
    {
      step: 2,
      title: "Choose Your Services",
      description: "Select from our range of services",
      icon: <FaCommentAlt className="w-12 h-12" />,
    },
    {
      step: 3,
      title: "Book An Appointment",
      description: "Schedule your visit",
      icon: <FaCalendarAlt className="w-12 h-12" />,
    },
    {
      step: 4,
      title: "Meet Your Doctor",
      description: "Connect with our specialists",
      icon: <FaVideo className="w-12 h-12" />,
    },
  ];

  const handleBookAppointment = () => {
    if (role === "guest") {
      navigate("/login");
    } else if (role === "doctor") {
      navigate("/doctorProfile");
    } else {
      navigate("/appointment");
    }
  };

  const handleGetStarted = () => {
    if (role === "guest") {
      navigate("/login");
    } else if (role === "doctor") {
      navigate("/doctorProfile");
    } else {
      navigate("/profile");
    }
  };

  const handleSeeAllDoctors = () => {
    navigate("/doctors");
  };

  // Use fetched doctors data or fallback to an empty array if loading or error
  const doctorsData = doctorsQuery.data || [];

  // Shuffle and get 3 random doctors
  const randomDoctors = [...doctorsData]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-[6rem]">
      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className={`${styles.fadeInLeft} space-y-8`}>
              <h1 className="text-5xl font-bold leading-tight text-gray-900 lg:text-6xl">
                Clear <span className="text-blue-500">Vision</span>,<br />
                Brighter Future
              </h1>
              <p className="text-xl leading-relaxed text-gray-600">
                Expert eye care with advanced diagnostics and personalized
                treatments to enhance your vision.
              </p>
              <button
                onClick={handleBookAppointment}
                className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-600 hover:scale-105"
              >
                Book an appointment <FaChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className={`${styles.fadeInRight} relative`}>
              <div
                className={`${styles.floatingCard} bg-blue-100 rounded-3xl p-8 relative`}
              >
                <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 bg-blue-500 rounded-full">
                  <span className="text-4xl">👋</span>
                </div>
                <div className="px-6 py-3 text-xl font-semibold text-center text-white bg-blue-500 rounded-2xl">
                  Hello!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              How It <span className="text-blue-500">Works</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step, index) => (
              <div
                key={index}
                className={`${styles.workStep} text-center group`}
              >
                <div className="relative mb-6">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto transition-colors duration-300 bg-blue-100 rounded-full group-hover:bg-blue-500">
                    <div className="text-blue-500 transition-colors duration-300 group-hover:text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-blue-500 rounded-full -top-2 -right-2">
                    {step.step}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Top <span className="text-blue-500">services</span> we offer
            </h2>
            <p className="text-xl text-gray-600">
              "Comprehensive Eye Care Services Designed to Elevate Your Vision
              and Simplify Your Life"
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className={`${styles.serviceCard} bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group`}
              >
                <div className="mb-6 text-blue-500 transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  {service.description}
                </p>
                <button className="flex items-center justify-center w-12 h-12 transition-colors duration-300 bg-blue-200 rounded-lg hover:bg-blue-500 group">
                  <FaChevronRight className="w-6 h-6 text-blue-500 group-hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-2 text-lg text-gray-600">MEET OUR</p>
            <h2 className="text-4xl font-bold text-gray-900">
              Experts <span className="text-blue-500">Doctors</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {doctorsQuery.isLoading ? (
              <p>Loading doctors...</p>
            ) : doctorsQuery.isError ? (
              <p>Error loading doctors: {doctorsQuery.error.message}</p>
            ) : randomDoctors.length > 0 ? (
              randomDoctors.map((doctor, index) => (
                <div
                  key={index}
                  className={`${
                    doctor.isHighlighted
                      ? "bg-white shadow-xl scale-105"
                      : "bg-blue-100"
                  } p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-blue-400 rounded-full">
                    <div className="flex items-center justify-center w-16 h-16 bg-orange-300 rounded-full">
                      <FaUser className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    {doctor.fullname}
                  </h3>
                  <p className="mb-4 font-semibold text-blue-500">
                    {doctor.specialty}
                  </p>
                  <p className="leading-relaxed text-gray-600">{doctor.bio}</p>
                </div>
              ))
            ) : (
              <p>No doctors available.</p>
            )}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={handleSeeAllDoctors}
              className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              See All
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Some Reviews
            </h2>
            <p className="text-xl font-semibold text-blue-500">
              OF OUR CLIENTS
            </p>
          </div>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className={`${
                    styles.reviewItem
                  } p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedReview === index
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedReview(index)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-400 rounded-full">
                      <FaUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      <p className="text-gray-600">{review.profession}</p>
                    </div>
                    <div className="w-4 h-4 ml-auto bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`${styles.reviewCard} bg-gray-50 p-8 rounded-2xl`}>
              <div className="mb-4 text-6xl text-blue-500">"</div>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {reviews[selectedReview].review}
              </p>
              <div className="flex gap-1">
                {[...Array(reviews[selectedReview].stars)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Our <span className="text-blue-500">Values</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Excellence
              </h3>
              <p className="leading-relaxed text-gray-600">
                {values[0].description}
              </p>
            </div>
            <div className="p-8 bg-blue-100 border-4 border-blue-200 rounded-2xl lg:transform lg:-translate-y-4">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Integrity
              </h3>
              <p className="leading-relaxed text-gray-600">
                {values[1].description}
              </p>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Care</h3>
              <p className="leading-relaxed text-gray-600">
                {values[2].description}
              </p>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-2xl md:col-span-1 lg:col-start-1 lg:col-end-2">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Accessibility
              </h3>
              <p className="leading-relaxed text-gray-600">
                {values[3].description}
              </p>
            </div>
            <div className="p-8 bg-white shadow-lg rounded-2xl md:col-span-1 lg:col-start-3 lg:col-end-4">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Innovation
              </h3>
              <p className="leading-relaxed text-gray-600">
                {values[4].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-blue-500">Contact Us</h2>
          </div>
          <form className="space-y-6">
            <div>
              <input
                id="name"
                name="name"
                autoComplete="name"
                type="text"
                placeholder="Enter Your Name:"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                placeholder="Enter Your Email:"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                id="message"
                name="message"
                autoComplete="on"
                placeholder="Enter Message Here:"
                rows="6"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-4 text-xl font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
