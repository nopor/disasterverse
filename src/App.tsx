import './App.css';
import { BasicScene } from './Scene/BasicScene';

function App() {
  return (
    <div className="App">
      <h1>Disasterverse</h1>
      <BasicScene
        antialias={true}
        adaptToDeviceRatio={true}
      />
    </div>
  );
}

export default App;
