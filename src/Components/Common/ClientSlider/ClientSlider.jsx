import "./ClientSlider.scss";
import aldar from "../../../assets/Clients/Aldar.jpg";
import apparelGroup from "../../../assets/Clients/Apparel-Group.jpg";
import apple from "../../../assets/Clients/Apple.png";
import arada from "../../../assets/Clients/Arada.jpg";
import audi from "../../../assets/Clients/Audi.jpg";
import bmw from "../../../assets/Clients/BMW.jpg";
import boucheron from "../../../assets/Clients/Boucheron.jpg";
import burberry from "../../../assets/Clients/Burberry.jpg";
import cadillac from "../../../assets/Clients/Cadillac.jpg";
import cartier from "../../../assets/Clients/Cartier.jpg";
import celine from "../../../assets/Clients/Celine.jpg";
import centrepoint from "../../../assets/Clients/Centrepoint.jpg";
import chaumet from "../../../assets/Clients/Chaumet.jpg";
import dior from "../../../assets/Clients/Dior.jpg";
import ellington from "../../../assets/Clients/Ellington.jpg";
import fendi from "../../../assets/Clients/Fendi.jpg";
import flydubai from "../../../assets/Clients/Flydubai.jpg";
import imtiazProperties from "../../../assets/Clients/Imtiaz-Properties.jpg";
import lv from "../../../assets/Clients/LV.jpg";
import landmarkGroup from "../../../assets/Clients/Landmark-Group.jpg";
import levis from "../../../assets/Clients/Levis.jpg";
import mcdonalds from "../../../assets/Clients/McDonald's.jpg";
import mercedesBenz from "../../../assets/Clients/Mercedes-Benz.jpg";
import modon from "../../../assets/Clients/Modon.jpg";
import mrEight from "../../../assets/Clients/Mr-Eight.jpg";
import nissan from "../../../assets/Clients/Nissan.png";
import oneDevelopment from "../../../assets/Clients/One-Development.jpg";
import pAndG from "../../../assets/Clients/P&G.jpg";
import papaJohns from "../../../assets/Clients/Papa-John's.jpg";
import piaget from "../../../assets/Clients/Piaget.jpg";
import pizzaHut from "../../../assets/Clients/Pizza-Hut.jpg";
import prada from "../../../assets/Clients/Prada.jpg";
import qatarAirways from "../../../assets/Clients/Qatar-Airways.jpg";
import sephora from "../../../assets/Clients/Sephora.jpg";
import sharafDg from "../../../assets/Clients/Sharaf-DG.jpg";
import splash from "../../../assets/Clients/Splash.jpg";
import taraf from "../../../assets/Clients/Taraf.jpg";
import vacheron from "../../../assets/Clients/Vacheron.jpg";
import wadan from "../../../assets/Clients/Wadan.jpg";
import yango from "../../../assets/Clients/Yango.jpg";
import samsung from "../../../assets/Clients/samsung.png";
import sobha from "../../../assets/Clients/sobha.png";

const clients = [
    { id: 1, logo: aldar, name: "Aldar" },
    { id: 2, logo: apparelGroup, name: "Apparel Group" },
    { id: 3, logo: apple, name: "Apple" },
    { id: 4, logo: arada, name: "Arada" },
    { id: 5, logo: audi, name: "Audi" },
    { id: 6, logo: bmw, name: "BMW" },
    { id: 7, logo: boucheron, name: "Boucheron" },
    { id: 8, logo: burberry, name: "Burberry" },
    { id: 9, logo: cadillac, name: "Cadillac" },
    { id: 10, logo: cartier, name: "Cartier" },
    { id: 11, logo: celine, name: "Celine" },
    { id: 12, logo: centrepoint, name: "Centrepoint" },
    { id: 13, logo: chaumet, name: "Chaumet" },
    { id: 14, logo: dior, name: "Dior" },
    { id: 15, logo: ellington, name: "Ellington" },
    { id: 16, logo: fendi, name: "Fendi" },
    { id: 17, logo: flydubai, name: "Flydubai" },
    { id: 18, logo: imtiazProperties, name: "Imtiaz Properties" },
    { id: 19, logo: lv, name: "Louis Vuitton" },
    { id: 20, logo: landmarkGroup, name: "Landmark Group" },
    { id: 21, logo: levis, name: "Levis" },
    { id: 22, logo: mcdonalds, name: "McDonald's" },
    { id: 23, logo: mercedesBenz, name: "Mercedes-Benz" },
    { id: 24, logo: modon, name: "Modon" },
    { id: 25, logo: mrEight, name: "Mr Eight" },
    { id: 26, logo: nissan, name: "Nissan" },
    { id: 27, logo: oneDevelopment, name: "One Development" },
    { id: 28, logo: pAndG, name: "P&G" },
    { id: 29, logo: papaJohns, name: "Papa John's" },
    { id: 30, logo: piaget, name: "Piaget" },
    { id: 31, logo: pizzaHut, name: "Pizza Hut" },
    { id: 32, logo: prada, name: "Prada" },
    { id: 33, logo: qatarAirways, name: "Qatar Airways" },
    { id: 34, logo: sephora, name: "Sephora" },
    { id: 35, logo: sharafDg, name: "Sharaf DG" },
    { id: 36, logo: splash, name: "Splash" },
    { id: 37, logo: taraf, name: "Taraf" },
    { id: 38, logo: vacheron, name: "Vacheron" },
    { id: 39, logo: wadan, name: "Wadan" },
    { id: 40, logo: yango, name: "Yango" },
    { id: 41, logo: samsung, name: "Samsung" },
    { id: 42, logo: sobha, name: "Sobha" },
];

export default function ClientSlider() {
    return (
        <section className="client-slider-section">
            <div className="client-slider-wrapper">
                <div className="client-slider-track" onMouseEnter={(e) => e.currentTarget.classList.add('paused')} onMouseLeave={(e) => e.currentTarget.classList.remove('paused')}>
                    {clients.map((client, index) => (
                        <div key={client.id} className="client-image-wrapper">
                            <img 
                                src={client.logo} 
                                alt={client.name}
                                className="client-image"
                            />
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {clients.map((client, index) => (
                        <div key={`duplicate-${client.id}`} className="client-image-wrapper">
                            <img 
                                src={client.logo} 
                                alt={client.name}
                                className="client-image"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
