"use client";

import ListAltIcon from "@mui/icons-material/ListAlt";
import LanguageIcon from "@mui/icons-material/Language";
import "../styles/header.scss";
import { useLanguage } from "../context/language-context";

function Header() {
  const { t, toggleLanguage } = useLanguage();


  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <ListAltIcon className="header-icon" />
          <div className="header-title">
            <h1>{t("header:title")}</h1>
            <p className="header-subtitle">{t("header:subtitle")}</p>
          </div>
        </div>

        <div className="header-right">
          <button onClick={toggleLanguage} className="btn-language">
            <LanguageIcon />
            <span>{t("header:switchLanguage")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
