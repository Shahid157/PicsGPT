import {Linking} from 'react-native';
import {modalShow} from '../store/reducers/popUpReducer';
export const url = {
  TikTok: 'https://www.tiktok.com/@styleyai',
  Twitter: 'https://twitter.com/StyleyMe',
  Facebook: ' https://www.facebook.com/profile.php?id=61552491909397',
  Instagram: 'https://www.instagram.com/styleyai/',
  PrivacyPolicy: 'https://styley.ai/home86?privacy_policy=true',
  defaultPicture:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAABlBMVEXY2Njo6Oie6BDVAAABDUlEQVR4nO3PAQ0AIAzAsOPfNCoIGbQKtpnHrdsBxznsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77Pjjcs3wA4s0RAgUAAAAASUVORK5CYII=',
};

export const urlHandler = (url: string, label: string, dispatch?: any) => {
  try {
    Linking.openURL(url).catch(err => {
      dispatch(modalShow(true));
    });
  } catch (error) {
    dispatch(modalShow(true));
  }
};
