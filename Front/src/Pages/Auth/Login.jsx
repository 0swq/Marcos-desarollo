import Header from '../../Components/Catalog/Header.jsx'
import Footer from '../../Components/Catalog/Footer.jsx'
import LoginRest from "../../Components/Rest/Auth/Login.jsx";


export default function Login() {
    return (
        <>
            <Header />
            <LoginRest />
            <Footer />
        </>
    )
}