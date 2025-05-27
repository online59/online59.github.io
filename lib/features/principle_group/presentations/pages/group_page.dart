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
      body: BlocBuilder<GroupBloc, GroupState>(
        builder: (context, state) {
          if (state is GroupLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is GroupLoaded) {
            if (state.groups.isEmpty) {
              return const Center(child: Text('No groups found.'));
            }
            return ListView.builder(
              itemCount: state.groups.length,
              itemBuilder: (context, index) {
                final group = state.groups[index];
                return GroupCard(
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
                );
              },
            );
          } else if (state is GroupError) {
            return Center(child: Text('Error: ${state.message}'));
          }
          return const SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => showAddGroupDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }
}
