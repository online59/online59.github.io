part of 'principle_bloc.dart';

abstract class PrincipleEvent extends Equatable {
  const PrincipleEvent();

  @override
  List<Object?> get props => [];
}

class FetchPrinciplesEvent extends PrincipleEvent {
  final String groupId;
  const FetchPrinciplesEvent(this.groupId);

  @override
  List<Object?> get props => [groupId];
}

class AddPrincipleEvent extends PrincipleEvent {
  final Principle principle;
  const AddPrincipleEvent(this.principle);

  @override
  List<Object?> get props => [principle];
}

class UpdatePrincipleEvent extends PrincipleEvent {
  final Principle principle;
  const UpdatePrincipleEvent(this.principle);

  @override
  List<Object?> get props => [principle];
}

class DeletePrincipleEvent extends PrincipleEvent {
  final Principle principle;
  const DeletePrincipleEvent(this.principle);

  @override
  List<Object?> get props => [principle];
}