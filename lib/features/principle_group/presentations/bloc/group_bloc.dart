import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/features/principle_group/domain/entities/group.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/add_group.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/delete_group.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/fetch_groups.dart';
import 'package:real_estate_helper/features/principle_group/domain/usecases/update_group.dart';

part 'group_event.dart';
part 'group_state.dart';

class GroupBloc extends Bloc<GroupEvent, GroupState> {
  final FetchGroups fetchGroups;
  final AddGroup addGroup;
  final UpdateGroup updateGroup;
  final DeleteGroup deleteGroup;

  GroupBloc({
    required this.fetchGroups,
    required this.addGroup,
    required this.updateGroup,
    required this.deleteGroup,
  }) : super(GroupInitial()) {
    on<FetchGroupsEvent>(_onFetchGroups);
    on<AddGroupEvent>(_onAddGroup);
    on<UpdateGroupEvent>(_onUpdateGroup);
    on<DeleteGroupEvent>(_onDeleteGroup);
  }

  Future<void> _onFetchGroups(FetchGroupsEvent event, Emitter<GroupState> emit) async {
    emit(GroupLoading());
    try {
      final groups = await fetchGroups();
      emit(GroupLoaded(groups));
    } catch (e) {
      emit(GroupError(e.toString()));
    }
  }

  Future<void> _onAddGroup(AddGroupEvent event, Emitter<GroupState> emit) async {
    emit(GroupLoading());
    try {
      await addGroup(event.group);
      add(FetchGroupsEvent());
      emit(GroupActionSuccess());
    } catch (e) {
      emit(GroupError(e.toString()));
    }
  }

  Future<void> _onUpdateGroup(UpdateGroupEvent event, Emitter<GroupState> emit) async {
    emit(GroupLoading());
    try {
      await updateGroup(event.group);
      add(FetchGroupsEvent());
      emit(GroupActionSuccess());
    } catch (e) {
      emit(GroupError(e.toString()));
    }
  }

  Future<void> _onDeleteGroup(DeleteGroupEvent event, Emitter<GroupState> emit) async {
    emit(GroupLoading());
    try {
      await deleteGroup(event.id);
      add(FetchGroupsEvent());
      emit(GroupActionSuccess());
    } catch (e) {
      emit(GroupError(e.toString()));
    }
  }
}