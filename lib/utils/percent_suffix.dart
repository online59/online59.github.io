import 'package:flutter/services.dart';

class PercentSuffixInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    if (newValue.text.isEmpty) {
      return newValue.copyWith(text: '');
    }

    // Remove any non-numeric characters except the decimal point and minus sign
    String newText = newValue.text.replaceAll(RegExp(r'[^0-9.-]'), '');

    // Ensure only one decimal point is present
    if (newText.contains('.')) {
      final parts = newText.split('.');
      newText = '${parts[0]}.${parts[1].replaceAll('.', '')}';
    }

    // Ensure the minus sign is at the beginning if present
    if (newText.contains('-')) {
      newText = '-${newText.replaceAll('-', '')}';
    }

    // Append the percent sign
    newText += ' %';

    // Calculate the new selection index
    final int newSelectionIndex = newText.length - 2; // Adjust for the space and percent sign

    return TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: newSelectionIndex),
    );
  }
}