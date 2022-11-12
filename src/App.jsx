import "./App.scss";
import Card from './components/Card';

function App() {
  const today = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <div className="App">
      <h1 className="title">
        <span>Hi, Today is {`${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`} </span>
      </h1>

      <div className="container">
        <Card/>
      </div>
    </div>
  );
}

export default App;
