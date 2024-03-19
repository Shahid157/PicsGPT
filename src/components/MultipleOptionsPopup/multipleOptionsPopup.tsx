import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {modalShow} from '../../store/reducers/popUpReducer';
import colors from '../../assets/colors';
import {hp, wp} from '../../constants';
import SvgIcon from '../../assets/SvgIcon';

interface ModalProps {
  isVisible: boolean;
  title: string;
  description?: string;
  style?: any;
  positiveBtnName?: string;
  negativeBtnName?: string;
  pressOut?: () => void;
  onOkPress: () => void;
  onCancelPress: () => void;
}

export default function MultipleOptionsPopup({
  isVisible,
  title,
  description,
  negativeBtnName,
  positiveBtnName,
  style,
  pressOut,
  onOkPress,
  onCancelPress,
}: ModalProps) {
  const dispatch = useDispatch();
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isVisible}
      backdropColor={'white'}
      style={style}>
      <Pressable onPressOut={pressOut} style={styles.mainView}>
        <View style={styles.modalView}>
          <SvgIcon.Styley />
          <View style={{alignItems: 'center', margin: 10}}>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: hp(2),
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onOkPress}
              style={{...styles.buttonView, backgroundColor: colors?.red}}>
              <Text style={{color: colors.white, textAlign: 'center'}}>
                {negativeBtnName ? negativeBtnName : 'No'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onCancelPress}
              style={styles.buttonView}>
              <Text style={{color: 'white', margin: 15}}>
                {positiveBtnName ? positiveBtnName : 'Yes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '90%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    elevation: 10,
    padding: 20,
  },
  buttonView: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    backgroundColor: 'blue',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    borderRadius: 5,
    bottom: 0,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginTop: hp(2),
    color: 'grey',
    textAlign: 'center',
  },
  title: {fontSize: 25, marginTop: 5},
});
