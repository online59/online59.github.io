part of 'principle_bloc.dart';

abstract class PrincipleState extends Equatable {
  const PrincipleState();

  @override
  List<Object?> get props => [];
}

class PrincipleInitial extends PrincipleState {}

class PrincipleLoading extends PrincipleState {}

class PrincipleLoaded extends PrincipleState {
  final List<Principle> principles;
  const PrincipleLoaded(this.principles);

  @override
  List<Object?> get props => [principles];
}

class PrincipleError extends PrincipleState {
  final String message;
  const PrincipleError(this.message);

  @override
  List<Object?> get props => [message];
}

class PrincipleActionSuccess extends PrincipleState {}