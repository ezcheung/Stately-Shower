export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.locs = ["Shower", "Bath"];
    for (let i = 0; i < this.locs.length; i++) {
      this.state[this.locs[i]] = false;
      this[`${this.locs[i]}Ref`] = firebase.database().ref(`${this.locs[i]}`);
    }
  }

  componentWillMount() {
    
  }

  render() {
    return <div className="game"></div>
  }
}