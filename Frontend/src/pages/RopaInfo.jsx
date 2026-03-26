import Header from "../components/Header";
import RopaInfoDetail from "../components/RopaInfo/RopaInfo.jsx";
import Footer from "../components/footer";
import Destacados from "../components/Destacados.jsx";


function RopaInfoPage() {
    return (
        <>
        <Header/>
        <RopaInfoDetail nombre="Remera" precio="$50.000" informacion="Jean calce balloon de 5 bolsillos con recorte en piernas delanteras . Posee botón en su cintura y remaches metálicos color Black Niquel personalizados con la marca. Ademas de etiquetas, grifa y badana marcarias. Su composición es de 100% algodón"/>
        <Destacados/>
        <Footer/>
        </>
    );
}

export default RopaInfoPage;
