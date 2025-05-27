import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/di/injection.dart';
import 'package:real_estate_helper/features/principles/presentations/bloc/principle_bloc.dart';
import 'package:real_estate_helper/features/principles/presentations/widgets/principle_card.dart';
import 'package:real_estate_helper/features/principles/presentations/widgets/principle_dialog.dart';
import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';

class PrinciplePage extends StatelessWidget {
  final String groupId;

  const PrinciplePage({required this.groupId, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Principles')),
      body: SafeArea(
        child: BlocBuilder<PrincipleBloc, PrincipleState>(
          builder: (context, state) {
            if (state is PrincipleLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is PrincipleLoaded) {
              if (state.principles.isEmpty) {
                return const Center(child: Text('No principles found.'));
              }
              return ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                itemCount: state.principles.length,
                itemBuilder: (context, index) {
                  final principle = state.principles[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: PrincipleCard(
                      title: principle.doctrine,
                      onTap: () {
                        // Optional: Add your onTap action here, e.g., show details or edit
                      },
                      onLongPress: () {
                        showEditDeletePrincipleDialog(context, principle);
                      },
                    ),
                  );
                },
              );
            } else if (state is PrincipleError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'Error: ${state.message}',
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            }
            return const SizedBox.shrink();
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => showAddPrincipleDialog(context, groupId),
        tooltip: "Add Principle",
        child: const Icon(Icons.add),
      ),
    );
  }
}