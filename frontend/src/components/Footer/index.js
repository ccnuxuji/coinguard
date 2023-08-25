import "./Footer.css"

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} CoinGuard</p>
            <p>By Jimmy (Ji) Xu,</p>
            <p onClick={() => window.location.href = "https://www.linkedin.com/in/ccnuxuji/"}
                className="nav-to-linkedin" ><i className="fa-brands fa-linkedin"></i>  Linkedin</p>
            <p onClick={() => window.location.href = "https://github.com/ccnuxuji/coinguard"}
                className="nav-to-portfolio"><i className="fa-brands fa-github"></i>  Github</p>
            <p><i className="fa-regular fa-envelope"></i>  ccnuxuji@gmail.com</p>
        </footer>
    );
}

export default Footer;