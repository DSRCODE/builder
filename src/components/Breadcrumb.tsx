import { Link } from "react-router-dom"; // assuming you use react-router

const Breadcrumb = ({ current }) => (
  <nav className="text-sm mb-8" aria-label="Breadcrumb">
    <ol className="list-reset flex text-muted-foreground">
      <li>
        <Link to="/" className="hover:underline text-[#FB923C] font-medium">
          Home
        </Link>
      </li>
      <li>
        <span className="mx-2 text-muted-foreground">/</span>
      </li>
      <li className="font-semibold">{current}</li>
    </ol>
  </nav>
);

export default Breadcrumb;
