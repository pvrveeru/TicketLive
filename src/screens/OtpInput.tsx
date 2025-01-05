import React, { useEffect, useRef } from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
} from 'react-native';

interface OtpInputProps {
  onChange: (otpCode: string) => void;
  onBlur: () => void;
  otpCode: string;
  maxLength?: number;
  error?: boolean;
  size?: 'small' | 'large';
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  onChange,
  onBlur,
  otpCode,
  maxLength = 6,
  error,
  size = 'large',
  disabled = false,
}) => {
  const inputRef = useRef<TextInput | null>(null);
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    setTimeout(() => {
      if (!disabled) {
        Keyboard.dismiss();
        inputRef?.current?.focus();
      }
    }, 200);
  }, [disabled]);

  useEffect(() => {
    if (otpCode === '' && !disabled) {
      setTimeout(() => {
        Keyboard.dismiss();
        inputRef?.current?.focus();
      }, 200);
    }
  }, [otpCode, disabled]);

  return (
    <>
      <View style={styles.containerInput}>
        <TextInput
          onChangeText={onChange}
          onBlur={onBlur}
          value={otpCode}
          keyboardType="numeric"
          secureTextEntry={false}
          style={styles.otpHiddenInput}
          returnKeyType="done"
          ref={inputRef}
          editable={!disabled}
        />
        <View style={styles.containerInput}>
          {Array(maxLength)
            .fill(0)
            .map((_, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (!disabled) {
                    Keyboard.dismiss();
                    inputRef?.current?.focus();
                  }
                }}
                key={index}
                disabled={disabled}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.cellView,
                    size === 'small' && styles.smallCellView,
                    (!!otpCode?.[index] || !!otpCode?.[index - 1]) && styles.activeCellView,
                    !!error && styles.errorCellView,
                    isDarkTheme && styles.cellViewDark,
                  ]}
                >
                  <Text
                    style={[
                      styles.otpText,
                      (!!otpCode?.[index] || !otpCode?.[index - 1]) && styles.otpActiveText,
                      !!error && styles.errorActiveText,
                    ]}
                  >
                    {otpCode && otpCode?.length > 0
                      ? otpCode[index]
                        ? otpCode[index]
                        : index === 0 ||
                          (!!otpCode[index - 1] && !otpCode[index])
                        ? '_'
                        : ''
                      : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpHiddenInput: {
    width: 1,
    height: 1,
    position: 'absolute',
  },
  cellView: {
    width: 45,
    height: 50,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F0F2F9',
    borderRadius: 8,
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  cellViewDark: {
    width: 45,
    height: 50,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F9',
    borderRadius: 8,
    marginBottom: 40,
  },
  smallCellView: {
    width: 48,
    height: 48,
    marginHorizontal: 4,
  },
  activeCellView: {
    borderBottomWidth: 2,
  },
  otpText: {
    fontSize: 24,
    color: '#2e3038',
  },
  otpActiveText: {
    color: 'black',
  },
  errorCellView: {
    borderWidth: 1.6,
    borderColor: 'red',
    backgroundColor: '#fff',
  },
  errorActiveText: {
    fontWeight: '300',
    color: 'red',
  },
});

export default OtpInput;
