import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String title;
  final String? description;
  final VoidCallback? onPressed;
  final double width;
  final double height;

  const CustomButton({
    required this.title,
    this.description,
    this.onPressed,
    this.width = 200,
    this.height = 100,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.all(16.0),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(0.0), // Rectangle shape
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            description != null
                ? Text(
                    description!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 14),
                  )
                : const SizedBox(),
          ],
        ),
      ),
    );
  }
}
