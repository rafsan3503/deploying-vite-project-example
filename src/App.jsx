import {CurrencyConverter } from './components';
import background from '../images/beartoken1.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const homeStyle = {
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: 'center',
  opacity: '100%'
}

const App = () => {
  return (
      <div className="min-h-screen">
        <div style={homeStyle}>
          <CurrencyConverter />
          <ToastContainer position="top-center" theme='dark' />
        </div>
      </div>
  );

}

export default App;
