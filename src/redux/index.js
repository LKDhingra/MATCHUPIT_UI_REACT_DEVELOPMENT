import store from "../redux/store/index";
import { setAuthToken, setBasicInfo } from "../redux/actions/index";
window.store = store;
window.setAuthToken = setAuthToken;
window.setBasicInfo = setBasicInfo;