import { css } from "../../styled-system/css";

const headerStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  sm: {
    flexDirection: "row",
  },
});

const titleStyle = css({
  fontSize: "40px",
  overflowWrap: "break-word",
  textAlign: "center",
});

const logoStyle = css({
  height: "100px",
});

export const Header = () => {
  return (
    <header className={headerStyle}>
      <h1 className={titleStyle}>
        WorldWideWeb
        <wbr />
        'O'Techno
      </h1>
      <img src="/logo.png" alt="WorldWideWeb'O'Techno" className={logoStyle} />
    </header>
  );
};
