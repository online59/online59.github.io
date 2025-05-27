import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/presentations/bloc/group_bloc.dart';

void showAddGroupDialog(BuildContext parentContext) {
  final TextEditingController _controller = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  showDialog(
    context: parentContext,
    builder: (BuildContext context) {
      return Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: const [
                    Icon(Icons.group_add, color: Colors.blue),
                    SizedBox(width: 8),
                    Text(
                      'New Group',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _controller,
                  maxLength: 32,
                  decoration: InputDecoration(
                    labelText: 'Title',
                    hintText: 'Enter group name',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      vertical: 14,
                      horizontal: 16,
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Group name cannot be empty';
                    }
                    if (value.length > 32) {
                      return 'Group name must be 32 characters or less';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.save),
                    label: const Text(
                      'Save',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () {
                      if (_formKey.currentState?.validate() ?? false) {
                        final name = _controller.text.trim();
                        final id = DateTime.now().millisecondsSinceEpoch.toString();
                        final group = Group(id: id, name: name);
                        parentContext.read<GroupBloc>().add(AddGroupEvent(group));
                        Navigator.of(context).pop();
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
}