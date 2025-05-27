part of 'group_bloc.dart';

abstract class GroupEvent extends Equatable {
  const GroupEvent();

  @override
  List<Object?> get props => [];
}

class FetchGroupsEvent extends GroupEvent {}

class AddGroupEvent extends GroupEvent {
  final Group group;
  const AddGroupEvent(this.group);

  @override
  List<Object?> get props => [group];
}

class UpdateGroupEvent extends GroupEvent {
  final Group group;
  const UpdateGroupEvent(this.group);

  @override
  List<Object?> get props => [group];
}

class DeleteGroupEvent extends GroupEvent {
  final String id;
  const DeleteGroupEvent(this.id);

  @override
  List<Object?> get props => [id];
}