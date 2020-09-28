import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImgaeLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Sighin/Signin';
import Register from './components/Register/Register';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: "8f59dc8c0ac04441bce46e976865a166",
 });

const particlesParams = {
  particles: {
    number:{
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: ' ',
      imageUrl: '',
      box: {}, 
      route: 'signin',
      isSignedIn: false, 
    }
  }

  calcFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox= (box) =>{
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value})
  }

  onRouteChange =(route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})
    }else if (route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route:route});
  }

  onBtnSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models
  .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  .then(response =>this.displayFaceBox(this.calcFaceLocation(response)))
  .catch(err =>console.log(err));
    }
  

  render(){
    const { isSignedIn, imageUrl, route, box}=this.state;
    return (
    <div className="App">
       <Particles className='particles'
              params={particlesParams}
            />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {route==='home'?
        <div>
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onBtnSubmit = {this.onBtnSubmit}/>
        <FaceRecognition imageUrl={imageUrl} box={box} />
        </div>
        :(
          route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange} />
          :<Register onRouteChange ={this.onRouteChange} />
        )
      }
    </div>
  );
  }
}

export default App;
