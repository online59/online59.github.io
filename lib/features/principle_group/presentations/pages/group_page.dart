import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/di/injection.dart';
import 'package:real_estate_helper/features/principle_group/presentations/bloc/group_bloc.dart';
import 'package:real_estate_helper/features/principle_group/presentations/widgets/group_card.dart';
import 'package:real_estate_helper/features/principle_group/presentations/widgets/group_dialog.dart';
import 'package:real_estate_helper/features/principles/presentations/bloc/principle_bloc.dart';
import 'package:real_estate_helper/features/principles/presentations/pages/principle_page.dart';

class GroupPage extends StatelessWidget {
  const GroupPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Principle Groups')),
      body: SafeArea(
        child: BlocBuilder<GroupBloc, GroupState>(
          builder: (context, state) {
            if (state is GroupLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is GroupLoaded) {
              if (state.groups.isEmpty) {
                return const Center(child: Text('No groups found.'));
              }
              return ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                itemCount: state.groups.length,
                itemBuilder: (context, index) {
                  final group = state.groups[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: GroupCard(
                      title: group.name,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => BlocProvider(
                              create: (_) => sl<PrincipleBloc>()
                                ..add(FetchPrinciplesEvent(group.id)),
                              child: PrinciplePage(groupId: group.id),
                            ),
                          ),
                        );
                      },
                      onLongPress: () {
                        context.read<GroupBloc>().add(DeleteGroupEvent(group.id));
                      },
                    ),
                  );
                },
              );
            } else if (state is GroupError) {
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
        onPressed: () => showAddGroupDialog(context),
        tooltip: "Add Group",
        child: const Icon(Icons.add),
      ),
    );
  }
}