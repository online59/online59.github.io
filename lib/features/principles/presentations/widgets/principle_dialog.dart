import 'package:flutter/material.dart';
import 'package:real_estate_helper/di/injection.dart';
import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';
import 'package:real_estate_helper/features/principles/presentations/bloc/principle_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void showAddPrincipleDialog(BuildContext parentContext, String groupId) {
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
                const Row(
                  children: [
                    Icon(Icons.library_add, color: Colors.blue),
                    SizedBox(width: 8),
                    Text(
                      'Add Principle',
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
                  maxLines: 5,
                  minLines: 2,
                  textInputAction: TextInputAction.newline,
                  decoration: InputDecoration(
                    labelText: 'Principle',
                    hintText: 'Enter principle',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      vertical: 18,
                      horizontal: 16,
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Principle cannot be empty';
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
                        final doctrine = _controller.text.trim();
                        final id = DateTime.now().millisecondsSinceEpoch.toString();
                        final principle = Principle(
                          id: id,
                          doctrine: doctrine,
                          groupId: groupId,
                        );
                        parentContext.read<PrincipleBloc>().add(AddPrincipleEvent(principle));
                        Navigator.of(context).pop(true);
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