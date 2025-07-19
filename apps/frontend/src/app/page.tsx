"use client";
import { useState } from "react";
import Head from "next/head";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

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
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    phoneNumber: "",
    address: "",
    brandName: "",
    color: "red",
    siteName: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<ApiSuccessResponse | null>(
    null
  );

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setFormData({ ...formData, prompt });
      setShowForm(true);
      setApiError(null); // Clear previous errors when starting new form
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user makes changes
    if (apiError && name === "siteName") {
      setApiError(null);
    }
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
        // Handle API errors
        const errorData = data as ApiErrorResponse;
        setApiError(
          Array.isArray(errorData.message)
            ? errorData.message.join(". ")
            : errorData.message || "An unknown error occurred"
        );
        return;
      }

      // Handle success
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
    // Reset form after successful submission
    setShowForm(false);
    setPrompt("");
    setFormData({
      prompt: "",
      phoneNumber: "",
      address: "",
      brandName: "",
      color: "red",
      siteName: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      <Head>
        <title>Create Your Landing Page</title>
        <meta
          name="description"
          content="Get a free landing page with domain and hosting"
        />
      </Head>

      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#EF4444",
              },
              links: {
                color: "#EF4444",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
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
            background: {
              color: "#111827",
            },
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-16">
          {!showForm ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h1 className="text-4xl font-bold text-center mb-8">
                Let's Build Your Online Presence
              </h1>
              <form onSubmit={handlePromptSubmit} className="w-full max-w-2xl">
                <div className="relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tell us what you want to build"
                    className="w-full px-6 py-4 text-xl bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition duration-200"
                  >
                    Create
                  </button>
                </div>
                <p className="mt-4 text-center text-gray-400">
                  We'll create a professional landing page with free domain,
                  SSL, and hosting.
                </p>
              </form>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Complete Your Landing Page Details
              </h2>
              <div className="bg-gray-700 border-l-4 border-red-500 p-4 mb-6 rounded">
                <p className="text-center">
                  <span className="font-semibold text-red-400">Free</span>{" "}
                  landing page includes:
                </p>
                <ul className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-400"
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
                    Free domain (yourname.example.com)
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-400"
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
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-400"
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
                    Free hosting
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-400"
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
                    Red + dark color scheme
                  </li>
                </ul>
              </div>

              {/* Error Message */}
              {apiError && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="font-medium text-red-300">
                      Error submitting form
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-red-200">{apiError}</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Your Project Idea
                    </label>
                    <input
                      type="text"
                      name="prompt"
                      value={formData.prompt}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Brand Name*
                    </label>
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Site Name (for URL)*
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleFormChange}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                        placeholder="mytoystore"
                      />
                      <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-gray-600 border border-l-0 border-gray-600 rounded-r-lg">
                        .example.com
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      This will be your free subdomain
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Address*
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">
                      Primary Color
                    </label>
                    <div className="flex space-x-2">
                      {["red", "blue", "green", "purple"].map((color) => (
                        <div key={color} className="flex items-center">
                          <input
                            type="radio"
                            id={color}
                            name="color"
                            value={color}
                            checked={formData.color === color}
                            onChange={handleFormChange}
                            className="hidden peer"
                          />
                          <label
                            htmlFor={color}
                            className={`w-8 h-8 rounded-full border-2 peer-checked:border-red-500 cursor-pointer`}
                            style={{
                              backgroundColor:
                                color === "red"
                                  ? "#EF4444"
                                  : color === "blue"
                                    ? "#3B82F6"
                                    : color === "green"
                                      ? "#10B981"
                                      : "#8B5CF6",
                            }}
                            title={
                              color.charAt(0).toUpperCase() + color.slice(1)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Create My Landing Page
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
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
              <h3 className="text-2xl font-bold text-gray-100 mt-4">
                {successData.message}
              </h3>
              <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300 mb-2">Your website is ready at:</p>
                <p className="text-blue-400 font-mono break-all">
                  {successData.url}
                </p>
              </div>
              <div className="mt-6 flex space-x-4 justify-center">
                <a
                  href={successData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open Website
                </a>
                <button
                  onClick={closeSuccessModal}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-8 border border-gray-700 text-center animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* <FaFire className="text-5xl text-red-500 animate-bounce" /> */}
                <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-2">
              Hold Tight!
            </h3>
            <p className="text-gray-300 mb-6">We're cooking your website...</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
