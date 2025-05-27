import 'package:flutter/material.dart';

class PrincipleCard extends StatelessWidget {
  final String title;
  final Function()? onTap;
  final Function()? onLongPress;

  const PrincipleCard({required this.title, this.onTap, this.onLongPress, super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(title),
      onTap: onTap,
      onLongPress: onLongPress,
    );
  }
}
