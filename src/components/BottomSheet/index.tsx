/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {wp} from '../../styles/responsiveScreen';

const BottomSheet = (props: any) => {
  const {
    height,
    withReactModal,
    withHandle,
    refName,
    autoClose,
    content,
    style,
  } = props;

  const renderContent = () => {
    return content;
  };

  return (
    <Modalize
      ref={refName}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
        scrollEnabled: false,
        keyboardShouldPersistTaps: 'handled',
      }}
      adjustToContentHeight
      withReactModal={withReactModal || false}
      withHandle={withHandle}
      modalStyle={[styles.modalStyle, style]}
      closeOnOverlayTap={autoClose}
      panGestureEnabled={autoClose}>
      {renderContent()}
    </Modalize>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    borderTopLeftRadius: wp(4),
    overflow: 'hidden',
  },
});

export default BottomSheet;
