import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';
import 'package:real_estate_helper/features/principles/domain/repositories/principle_repository.dart';

class AddPrinciple {
  final PrincipleRepository repository;
  AddPrinciple(this.repository);

  Future<void> call(Principle principle) {
    return repository.addPrinciple(principle);
  }
}