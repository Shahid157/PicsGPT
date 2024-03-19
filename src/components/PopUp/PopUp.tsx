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

interface ModalProps {
  isVisible: Boolean;
  title: string;
  description?: string;
  style?: any;
}

export default function PopUp({
  isVisible,
  title,
  description,
  style,
}: ModalProps) {
  const dispatch = useDispatch();
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={isVisible}
      backdropColor={'white'}
      style={style}>
      <Pressable
        onPressOut={() => dispatch(modalShow(false))}
        style={styles.mainView}>
        <View style={styles.modalView}>
          <View style={{alignItems: 'center', margin: 10}}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => dispatch(modalShow(false))}
            style={styles.buttonView}>
            <Text style={{color: 'white', margin: 15}}>OK</Text>
          </TouchableOpacity>
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
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '90%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    elevation: 10,
  },
  buttonView: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'blue',
    borderColor: '#ddd',
    borderBottomWidth: 0,
    borderRadius: 5,
    bottom: 0,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginTop: 10,
    color: 'grey',
    textAlign: 'center',
  },
  title: {fontSize: 25, marginTop: 5},
});
