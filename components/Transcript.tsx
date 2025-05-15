import { View, Text } from 'react-native';
import React from 'react';

import useRecord from "@/hooks/useRecord";

const Transcript = () => {
  const { transcript } = useRecord();

  return (
    <Text>{transcript}</Text>
  )
}

export default Transcript