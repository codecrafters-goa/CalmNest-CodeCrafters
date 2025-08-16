import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Heart, Music, BookOpen, Activity, MessageSquare, Phone, Star, ChevronRight, Play, Pause, Volume2 } from 'lucide-react';

// A custom modal component to replace browser alerts for a better user experience.
const MessageModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative shadow-2xl text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Notification</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Navigation component for the header.
const Navigation = ({ isOpen, toggleMenu, onOpenAuth }) => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-white text-2xl font-bold">CalmNest</span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {['Home', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white hover:text-purple-200 transition-colors duration-300">
                {item}
              </a>
            ))}
            <button
              onClick={() => onOpenAuth('login')}
              className="border-2 border-white text-white px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300"
            >
              Signup
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu, conditionally rendered */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {['Home', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block text-white hover:text-purple-200 py-2">
                {item}
              </a>
            ))}
            <div className="flex flex-col space-y-2 mt-4">
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full text-left text-white hover:text-purple-200 py-2"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="w-full text-left text-white hover:text-purple-200 py-2"
              >
                Signup
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Authentication modal for login and signup.
const AuthModal = ({ isOpen, onClose, type, onSwitchType, onShowMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${type} form submitted:`, formData);
    // Replace alert with the custom message modal
    onShowMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} successful!`);
    onClose();
    setFormData({ name: '', email: '', password: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors">
          <X className="h-6 w-6" />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {type === 'login' ? 'Login to Your Account' : 'Create an Account'}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            {type === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {type === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => onSwitchType(type === 'login' ? 'signup' : 'login')}
              className="text-purple-600 font-semibold hover:text-purple-800 ml-1 transition-colors"
            >
              {type === 'login' ? 'Signup' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Hero section with a title and call-to-action buttons.
const HeroSection = () => {
  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your
              <span className="block text-yellow-400">CalmNest</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Your one-stop solution for stress relief and mental wellness.
              Discover peace, reduce stress, and live a healthier life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="w-80 h-80 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center">
                <Activity className="h-24 w-24 text-purple-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services section listing various therapy options.
const Services = () => {
  const services = [
    {
      icon: <Music className="h-12 w-12" />,
      title: "Audio Therapy",
      description: "Browse through our collections of peaceful music, motivational podcasts, and inspirational audiobooks.",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Reading Therapy",
      description: "Discover inspirational quotes, book summaries, videos, and recommended books for stress relief.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Activity className="h-12 w-12" />,
      title: "Yoga Therapy",
      description: "Learn about yoga benefits, popular poses, and follow video tutorials for mind-body wellness.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <MessageSquare className="h-12 w-12" />,
      title: "Talking Therapy",
      description: "Access articles and videos about talking therapy to help manage depression, anxiety, and stress.",
      color: "from-indigo-400 to-purple-500"
    },
    {
      icon: <Phone className="h-12 w-12" />,
      title: "Consult A Doctor",
      description: "Connect with experienced professionals who can help you take the next step in managing stress.",
      color: "from-red-400 to-pink-500"
    }
  ];
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Therapy Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of stress-relief and mental wellness services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                <div className="p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <button className="flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Music player for relaxing sounds.
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const tracks = [
    { name: "Peaceful Rain", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "5:30" },
    { name: "Ocean Waves", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "4:15" },
    { name: "Forest Sounds", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "6:45" },
    { name: "Meditation Bell", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "3:20" }
  ];

  // A single useEffect hook to manage audio playback state and track changes reliably.
  useEffect(() => {
    // If an audio element exists, stop it and clean up.
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(tracks[currentTrack].src);
    audioRef.current = newAudio;

    const playAudio = async () => {
      try {
        await newAudio.play();
      } catch (e) {
        // Catch the interrupted error gracefully and don't log it, as it's a normal occurrence
        // when a new track is selected while the previous one is playing.
        if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
          console.error("Error playing audio:", e);
        }
      }
    };

    if (isPlaying) {
      playAudio();
    }

    // This cleanup function runs when the component unmounts or before the effect re-runs.
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentTrack, isPlaying]);

  // Handler for the play/pause button.
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handler for changing to the next track.
  const handleNext = () => {
    setCurrentTrack((currentTrack + 1) % tracks.length);
    setIsPlaying(true);
  };

  // Handler for changing to the previous track.
  const handlePrev = () => {
    setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  // Handler for selecting a track from the list.
  const handleTrackChange = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true); // Automatically start playing when a new track is selected
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Relaxing Sounds</h2>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tracks[currentTrack].name}</h3>
            <p className="text-gray-600">Duration: {tracks[currentTrack].duration}</p>
          </div>

          <div className="flex justify-center items-center space-x-6 mb-8">
            <button
              onClick={handlePrev}
              className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              <ChevronRight className="h-6 w-6 transform rotate-180" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-6 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all transform hover:scale-105"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </button>
            <button
              onClick={handleNext}
              className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tracks.map((track, index) => (
              <button
                key={index}
                onClick={() => handleTrackChange(index)}
                className={`p-3 rounded-lg transition-colors ${
                  index === currentTrack
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// About section detailing the website's purpose and benefits.
const AboutSection = () => {
  const benefits = [
    "Gives mental peace 🧘‍♀️",
    "Reduces stress effectively",
    "Refreshes your mood",
    "Entertains and motivates",
    "Promotes healthy living"
  ];
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About CalmNest</h2>
            <p className="text-lg text-gray-600 mb-8">
              Welcome to our stress-relieving website! We provide a variety of tools and resources
              to help you manage and reduce stress in your daily life. From carefully crafted playlists
              and relaxing podcasts to articles and tips on stress management techniques.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl p-6 text-white text-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Music className="h-12 w-12 mx-auto mb-4" />
                <h3 className="font-bold">Music Therapy</h3>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl p-6 text-white text-center transform -rotate-3 hover:rotate-0 transition-transform duration-300 mt-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <h3 className="font-bold">Reading Therapy</h3>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white text-center transform rotate-2 hover:rotate-0 transition-transform duration-300 -mt-8">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <h3 className="font-bold">Yoga Therapy</h3>
              </div>
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl p-6 text-white text-center transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <h3 className="font-bold">Talk Therapy</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



// Contact form section.
const ContactSection = ({ onShowMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Replace alert with the custom message modal
    onShowMessage('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };
  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-xl text-purple-100">We are here to help you on your wellness journey</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="contact-name">Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="contact-email">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us how we can help you"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer section.
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-600 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CalmNest</span>
            </div>
            <p className="text-gray-400">
              Your one-stop solution for stress relief and mental wellness.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Audio Therapy</a></li>
              <li><a href="#" className="hover:text-white">Reading Therapy</a></li>
              <li><a href="#" className="hover:text-white">Yoga Therapy</a></li>
              <li><a href="#" className="hover:text-white">Talk Therapy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency</h3>
            <p className="text-gray-400 mb-2">If you are in crisis, please contact:</p>
            <p className="text-white font-semibold">National Suicide Prevention Lifeline</p>
            <p className="text-purple-400">988</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 CalmNest. Made with ❤ for mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};


// Main application component that orchestrates all other components.
const CalmNestApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalText, setMessageModalText] = useState('');
  const [authType, setAuthType] = useState('login');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuthModal = (type) => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const showMessageModal = (message) => {
    setMessageModalText(message);
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageModalText('');
  };

  const switchAuthType = (type) => {
    setAuthType(type);
  };

  // Effect to handle smooth scrolling for anchor links.
  useEffect(() => {
    const handleScroll = (e) => {
      const href = e.target.getAttribute('href');
      // Fixed the error by ensuring the href is not just '#' before trying to query the element.
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener('click', handleScroll));
    return () => {
      links.forEach(link => link.removeEventListener('click', handleScroll));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navigation isOpen={isMenuOpen} toggleMenu={toggleMenu} onOpenAuth={openAuthModal} />
      <HeroSection />
      <Services />
      <MusicPlayer />
      <AboutSection />
      <ContactSection onShowMessage={showMessageModal} />
      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        type={authType}
        onSwitchType={switchAuthType}
        onShowMessage={showMessageModal}
      />
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={closeMessageModal}
        message={messageModalText}
      />
    </div>
  );
};

export default CalmNestApp;