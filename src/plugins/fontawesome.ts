import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faUserAlt,
  faHome,
  faFileAlt,
  faStar,
  faUser,
  faPlusCircle,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

library.add(
  faUserAlt,
  faHome,
  faFileAlt,
  faStar,
  faStarRegular,
  faUser,
  faPlusCircle,
  faHeart,
);

export default FontAwesomeIcon;
