import { connect } from 'react-redux';
import Installer from '../components/Installer';

function mapStateToProps(state) {
  return {
    installer: state.installer
  };
}

export default connect(mapStateToProps)(Installer);
