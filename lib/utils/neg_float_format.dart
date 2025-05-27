import 'package:flutter/services.dart';

class NegativeFloatingNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final text = newValue.text;

    // Allow empty input
    if (text.isEmpty) {
      return newValue;
    }

    // Allow negative sign at the beginning
    if (text == '-') {
      return newValue;
    }

    // Allow only one decimal point and one negative sign at the beginning
    final regex = RegExp(r'^-?\d*\.?\d*$');
    if (regex.hasMatch(text)) {
      return newValue;
    }

    // If the input is invalid, return the old value
    return oldValue;
  }
}