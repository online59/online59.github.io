import 'package:flutter/material.dart';

class MainMenuPage extends StatelessWidget {
  const MainMenuPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Center(child: Text('Download Tax PDF')),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                InkWell(
                  onTap: () {
                    Navigator.pushNamed(context, '/message_generator');
                  },
                  child: const Card(
                    child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Text("Message Generator\nFor Accounting")),
                  ),
                ),
                const SizedBox(width: 20.0),
                InkWell(
                  onTap: () {
                    Navigator.pushNamed(context, '/portfolio');
                  },
                  child: const Card(
                    child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Text("My Portfolio")),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
