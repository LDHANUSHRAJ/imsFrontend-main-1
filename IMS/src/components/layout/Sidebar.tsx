import { NavLink } from "react-router-dom";
import { sidebarConfig } from "../../utils/sidebarConfig";
import logo from "../../assets/logo/christ-logo.png";

export default function Sidebar({ role }) {
  const menuItems = sidebarConfig[role] || [];

  return (
    <aside className="w-64 bg-christBlue text-white min-h-screen flex flex-col">


      {/* LOGO */}
      <div className="p-6 border-b border-white/20">
        <img src={logo} alt="Christ University" className="w-36 mb-2" />
        <p className="text-xs opacity-80">IMS Admin Portal</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-sm ${isActive
                ? "bg-white text-christBlue font-medium"
                : "hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 text-xs opacity-70 border-t border-white/20">
        CHRIST University © {new Date().getFullYear()}
      </div>
    </aside>

  );
}
