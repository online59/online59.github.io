import 'package:flutter/material.dart';
import 'package:real_estate_helper/di/injection.dart';
import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';
import 'package:real_estate_helper/features/principles/presentations/bloc/principle_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void showAddPrincipleDialog(BuildContext parentContext, String groupId) {
  final TextEditingController _controller = TextEditingController();

  showDialog(
    context: parentContext,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text('Add Principle'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(
                labelText: 'Title',
                hintText: 'Enter title',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                final doctrine = _controller.text.trim();
                if (doctrine.isNotEmpty) {
                  final id = DateTime.now().millisecondsSinceEpoch.toString();
                  final principle = Principle(
                    id: id,
                    doctrine: doctrine,
                    groupId: groupId,
                  );
                  parentContext.read<PrincipleBloc>().add(AddPrincipleEvent(principle));
                  Navigator.of(context).pop(true); // Return true on success
                }
              },
              child: const Text('Save'),
            ),
          ],
        ),
      );
    },
  );
}