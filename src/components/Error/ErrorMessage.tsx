import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { errorMessageProps } from './interfaces'
import { colors } from '../../assets'

export default function ErrorMessage({errorMessage}:errorMessageProps) {
  return (
      <Text style={styles.error}>{errorMessage}</Text>
  )
}

const styles = StyleSheet.create({
    error:{
        color:colors.red
    }
})