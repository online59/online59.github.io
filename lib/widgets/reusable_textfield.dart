import 'package:flutter/material.dart';

typedef OnChangeCallback = void Function(String value);

class ReusableTextField extends StatelessWidget {
  final String title;
  final String? textHint;
  final int? maxLine;
  final double? height;
  final double? width;
  final OnChangeCallback onChange;
  final TextEditingController? controller;

  const ReusableTextField({
    super.key,
    required this.title,
    required this.onChange,
    this.textHint,
    this.maxLine,
    this.controller,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 100,
          child: Text(title, textAlign: TextAlign.end,),
        ),
        const SizedBox(
          width: 10.0,
        ),
        Container(
          width: 300,
          height: height,
          padding: const EdgeInsets.all(
            10.0,
          ),
          child: TextField(
            controller: controller,
            maxLines: maxLine ?? 1,
            minLines: 1,
            style: const TextStyle(
              color: Colors.black,
            ),
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.white,
              hintText: textHint,
              hintStyle: const TextStyle(
                color: Colors.grey,
              ),
              border: const OutlineInputBorder(),
            ),
            onChanged: (value) {
              onChange(value);
            },
          ),
        ),
      ],
    );
  }
}
