"use client";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { ChromePicker } from "react-color";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import {
  FaRocket,
  FaCheck,
  FaExternalLinkAlt,
  FaPalette,
  FaSpinner,
} from "react-icons/fa";
import { IoClose, IoWarning } from "react-icons/io5";

type FormData = {
  prompt: string;
  phoneNumber: string;
  address: string;
  brandName: string;
  color: string;
  siteName: string;
};

type ApiSuccessResponse = {
  status: boolean;
  url: string;
  message: string;
};

type ApiErrorResponse = {
  message: string[];
  error: string;
  statusCode: number;
};

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    phoneNumber: "",
    address: "",
    brandName: "",
    color: "#6366F1", // Changed to indigo as default
    siteName: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<ApiSuccessResponse | null>(
    null
  );

  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    }

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setFormData({ ...formData, prompt });
      setShowForm(true);
      setApiError(null);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (apiError && name === "siteName") {
      setApiError(null);
    }
  };

  const handleColorChange = (color: { hex: string }) => {
    setFormData({ ...formData, color: color.hex });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("http://localhost:3000/api/v1/sitebuilder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        setApiError(
          Array.isArray(errorData.message)
            ? errorData.message.join(".\n")
            : errorData.message || "An unknown error occurred"
        );
        return;
      }

      const successData = data as ApiSuccessResponse;
      setSuccessData(successData);
    } catch (error) {
      console.error("Error:", error);
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessData(null);
    setShowForm(false);
    setPrompt("");
    setFormData({
      prompt: "",
      phoneNumber: "",
      address: "",
      brandName: "",
      color: "#6366F1",
      siteName: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 relative overflow-hidden">
      <Head>
        <title>Instant Landing Page Builder</title>
        <meta
          name="description"
          content="Create a professional landing page in minutes with free domain and hosting"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Animated background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: formData.color || "#6366F1",
              },
              links: {
                color: formData.color || "#6366F1",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: "bounce",
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-12 md:py-24">
          {!showForm ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-3xl">
                <div className="inline-flex items-center justify-center px-6 py-2 bg-indigo-900/30 text-indigo-400 rounded-full border border-indigo-800 mb-6">
                  <FaRocket className="mr-2" />
                  <span className="text-sm font-medium">NO-CODE SOLUTION</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-pink-300">
                  Build Your Perfect Landing Page
                </h1>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Get a professional online presence in minutes with free domain
                  and hosting. Just tell us what you need.
                </p>
                <form
                  onSubmit={handlePromptSubmit}
                  className="w-full max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your business or project..."
                      className="w-full px-6 py-4 text-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all duration-200 shadow-lg"
                      required
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center shadow-lg hover:shadow-indigo-500/20"
                    >
                      Generate
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-4 text-center text-gray-400 text-sm">
                    Free domain, SSL, and hosting included. No credit card
                    required.
                  </p>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-pink-300">
                  Complete Your Page Details
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <IoClose className="text-gray-400" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-l-4 border-indigo-500 p-5 mb-8 rounded-lg">
                <h3 className="font-semibold text-indigo-300 mb-2 flex items-center">
                  <FaCheck className="mr-2" />
                  Whats included in your free landing page:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm text-gray-300">
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 w-4 h-4 mt-0.5 mr-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Free subdomain (yourname.example.com)
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 w-4 h-4 mt-0.5 mr-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Free SSL certificate
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 w-4 h-4 mt-0.5 mr-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Lightning-fast hosting
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 w-4 h-4 mt-0.5 mr-2 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Customizable design
                  </li>
                </ul>
              </div>

              {apiError && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg backdrop-blur-sm">
                  <div className="flex items-start">
                    <IoWarning className="flex-shrink-0 w-5 h-5 mr-2 text-red-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-300">
                        Error submitting form
                      </h3>
                      <pre className="mt-1 text-sm text-red-200 font-sans">
                        {apiError}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Your Project Idea
                    </label>
                    <input
                      type="text"
                      name="prompt"
                      value={formData.prompt}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Brand Name*
                      </label>
                      <input
                        type="text"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                        required
                        placeholder="Your company name"
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-gray-600 cursor-pointer shadow-md flex items-center justify-center"
                          style={{ backgroundColor: formData.color }}
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                          <FaPalette className="text-white/50" />
                        </div>
                        <span className="text-gray-300 font-mono text-sm bg-gray-700/50 px-3 py-1.5 rounded-lg">
                          {formData.color}
                        </span>
                      </div>
                      {showColorPicker && (
                        <div
                          ref={colorPickerRef}
                          className="mt-3 absolute z-20"
                        >
                          <ChromePicker
                            color={formData.color}
                            onChange={handleColorChange}
                            disableAlpha={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Site URL*
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleFormChange}
                        className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                        required
                        placeholder="mybusiness"
                        autoComplete="off"
                      />
                      <span className="inline-flex items-center px-4 text-sm text-gray-300 bg-gray-700 border border-l-0 border-gray-600 rounded-r-lg">
                        .example.com
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-gray-400">
                      This will be your free subdomain (letters and numbers
                      only)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                        required
                        placeholder="+1 (123) 456-7890"
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Business Address*
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                        required
                        rows={3}
                        placeholder="123 Main St, City, Country"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70 shadow-lg hover:shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Building Your Page...
                    </>
                  ) : (
                    <>
                      <FaRocket className="mr-3" />
                      Launch My Landing Page
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-md w-full p-8 border border-gray-700/50 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 border border-green-700 mb-6">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mt-4">
                {successData.message}
              </h3>
              <div className="mt-6 bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm border border-gray-600">
                <p className="text-gray-300 mb-2 text-sm font-medium">
                  Your website is ready at:
                </p>
                <a
                  href={successData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 font-mono break-all text-lg flex items-center justify-center"
                >
                  {successData.url}
                  <FaExternalLinkAlt className="ml-2 text-sm" />
                </a>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <a
                  href={successData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center shadow-lg hover:shadow-indigo-500/20"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Visit Website
                </a>
                <button
                  onClick={closeSuccessModal}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 border border-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-md w-full p-8 border border-gray-700/50 text-center animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping"></div>
                <FaRocket className="text-5xl text-indigo-400 animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">
              Building Your Page...
            </h3>
            <p className="text-gray-300 mb-6">
              This usually takes about 30 seconds
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full animate-progress"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
