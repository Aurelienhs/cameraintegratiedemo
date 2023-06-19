import styles from "./style.module.css";
import relivologo from "./relivologo.png";
const Header = () => {
  return (
    <div className={styles.header}>
      <img className={styles.logo} src={relivologo} alt="logo" />
      Camera integration demo
    </div>
  );
};
export default Header;
