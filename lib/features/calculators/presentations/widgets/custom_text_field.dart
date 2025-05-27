import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../../utils/thousand_separator.dart';

class CustomTextField extends StatelessWidget {
  final TextEditingController controller;
  final String labelText;
  final TextInputType keyboardType;
  final List<TextInputFormatter> inputFormatters;

  CustomTextField({
    super.key,
    required this.controller,
    required this.labelText,
    this.keyboardType = const TextInputType.numberWithOptions(decimal: true, signed: true),
    List<TextInputFormatter>? inputFormatters,
  }) : inputFormatters = inputFormatters ?? [ThousandsSeparatorInputFormatter()];

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(labelText: labelText),
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
    );
  }
}