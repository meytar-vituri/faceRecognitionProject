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
const initialstate = {
  input: ' ',
  imageUrl: '',
  box: {}, 
  route: 'signin',
  isSignedIn: false, 
  user: {
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialstate;
  }

  loadUser = (data) =>{
    this.setState( {user:{
      id:data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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
    this.setState({input: event.target.value});
  }

  onRouteChange =(route) => {
    if (route === 'signin'){
      this.setState(initialstate);
    }else if (route === 'home'){
      this.setState({isSignedIn : true})
    }
    this.setState({route:route});
  }

  onBtnSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    fetch('https://obscure-scrubland-64592.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
    .then(response =>{
      if(response){
        fetch('https://obscure-scrubland-64592.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user, {entries:count}))
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calcFaceLocation(response));
      })
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
        <Rank name ={this.state.user.name} entries= {this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onBtnSubmit = {this.onBtnSubmit}/>
        <FaceRecognition imageUrl={imageUrl} box={box} />
        </div>
        :(
          route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          :<Register onRouteChange ={this.onRouteChange}  loadUser={this.loadUser}/>
        )
      }
    </div>
  );
  }
}

export default App;
