import { css } from "../../styled-system/css";

const footer = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  gap: "0.5rem",
  paddingX: "1rem",
  fontSize: "0.875rem",
  color: "#666",
});

const link = css({
  textDecoration: "underline",
  _hover: {
    textDecoration: "none",
  },
});

export const Footer = () => {
  return (
    <footer className={footer}>
      <a
        href="https://github.com/gausie/www-o-techno"
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        About
      </a>
      🎵
      <div>Made by gausie</div>
    </footer>
  );
};
