import 'package:create_message/src/main_menu_page.dart';
import 'package:flutter/material.dart';

import 'src/features/message_generator/screens/text_generator_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        brightness: Brightness.light,
      ),
      home: const MainMenuPage(),
    );
  }
}

