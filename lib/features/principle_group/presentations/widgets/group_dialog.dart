import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/presentations/bloc/group_bloc.dart';

void showAddGroupDialog(BuildContext parentContext) {
  final TextEditingController _controller = TextEditingController();

  showDialog(
    context: parentContext,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text('New Group'),
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
                final name = _controller.text.trim();
                if (name.isNotEmpty) {
                  final id = DateTime.now().millisecondsSinceEpoch.toString(); // or use uuid
                  final group = Group(id: id, name: name);
                  parentContext.read<GroupBloc>().add(AddGroupEvent(group));
                  Navigator.of(context).pop(); // just pop, no return value
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