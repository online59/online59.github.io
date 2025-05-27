import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/fetch_principles.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/add_principle.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/update_principle.dart';
import 'package:real_estate_helper/features/principles/domain/usecases/delete_principle.dart';

part 'principle_event.dart';
part 'principle_state.dart';

class PrincipleBloc extends Bloc<PrincipleEvent, PrincipleState> {
  final FetchPrinciples fetchPrinciples;
  final AddPrinciple addPrinciple;
  final UpdatePrinciple updatePrinciple;
  final DeletePrinciple deletePrinciple;

  PrincipleBloc({
    required this.fetchPrinciples,
    required this.addPrinciple,
    required this.updatePrinciple,
    required this.deletePrinciple,
  }) : super(PrincipleInitial()) {
    on<FetchPrinciplesEvent>(_onFetchPrinciples);
    on<AddPrincipleEvent>(_onAddPrinciple);
    on<UpdatePrincipleEvent>(_onUpdatePrinciple);
    on<DeletePrincipleEvent>(_onDeletePrinciple);
  }

  Future<void> _onFetchPrinciples(
      FetchPrinciplesEvent event, Emitter<PrincipleState> emit) async {
    emit(PrincipleLoading());
    try {
      final principles = await fetchPrinciples(event.groupId);
      emit(PrincipleLoaded(principles));
    } catch (e) {
      emit(PrincipleError(e.toString()));
    }
  }

  Future<void> _onAddPrinciple(
      AddPrincipleEvent event, Emitter<PrincipleState> emit) async {
    emit(PrincipleLoading());
    try {
      await addPrinciple(event.principle);
      add(FetchPrinciplesEvent(event.principle.groupId));
      emit(PrincipleActionSuccess());
    } catch (e) {
      emit(PrincipleError(e.toString()));
    }
  }

  Future<void> _onUpdatePrinciple(
      UpdatePrincipleEvent event, Emitter<PrincipleState> emit) async {
    emit(PrincipleLoading());
    try {
      await updatePrinciple(event.principle);
      add(FetchPrinciplesEvent(event.principle.groupId));
      emit(PrincipleActionSuccess());
    } catch (e) {
      emit(PrincipleError(e.toString()));
    }
  }

  Future<void> _onDeletePrinciple(
      DeletePrincipleEvent event, Emitter<PrincipleState> emit) async {
    emit(PrincipleLoading());
    try {
      await deletePrinciple(event.principle);
      add(FetchPrinciplesEvent(event.principle.groupId));
      emit(PrincipleActionSuccess());
    } catch (e) {
      emit(PrincipleError(e.toString()));
    }
  }
}