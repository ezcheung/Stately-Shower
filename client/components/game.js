export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.dbLoc = firebase.database().ref(`${this.props.loc}`);
    this.state = {

    };
    for (let i = 0; i < this.props.locs.length; i++) {
      this.state[this.props.locs[i]] = false;
      this[`${this.props.locs[i]}Ref`] = firebase.database().ref(`${this.props.locs[i]}`);
    }
  }

  componentWillMount() {
    this.dbLoc.on('value', (data) => {
      data = data.val();

    })
  }

  render() {
    return <div className="game"></div>
  }
}