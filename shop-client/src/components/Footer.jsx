import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer bg-base-200 p-4 flex flex-col md:flex-row justify-between items-center mt-8">
      <div>
        <span className="font-semibold">Contact:</span> info@skillswap.com
      </div>
      <div className="flex flex-col items-center gap-2 w-full md:w-auto">
        <a href="#" className="link link-hover text-center">
          Privacy Policy
        </a>
        <span className="text-xs text-gray-500 text-center">
          We respect your privacy and never share your data with third parties.
        </span>
        <span className="text-xs text-gray-500 text-center">
          Your information is securely stored and used only for improving your
          experience.
        </span>
      </div>
      <div className="flex gap-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          <FaFacebook className="inline text-xl" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          <FaTwitter className="inline text-xl" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          <FaInstagram className="inline text-xl" />
        </a>
      </div>
    </footer>
  );
}
