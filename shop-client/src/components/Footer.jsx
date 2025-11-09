import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer bg-base-200 p-4 flex flex-col md:flex-row justify-between items-center mt-8">
      <div className="flex flex-col items-start gap-1 mb-2 md:mb-0">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
            alt="FinEase Logo"
            className="h-6 w-6"
          />
          <span className="font-bold text-lg">FinEase</span>
        </div>
        <div className="text-sm text-gray-600">Contact: finease@gmail.com</div>
      </div>
      <div className="flex flex-col items-center gap-2 w-full md:w-auto">
        <a href="#" className="link link-hover text-center">
          Terms and Conditions
        </a>
        <span className="text-xs text-gray-500 text-center">
          By using FinEase, you agree to our terms and conditions. Please read
          them carefully before using the website.
        </span>
        <span className="text-xs text-gray-500 text-center">
          All financial data is handled securely and responsibly.
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
