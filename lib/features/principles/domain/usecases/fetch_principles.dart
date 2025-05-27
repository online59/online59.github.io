import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';
import 'package:real_estate_helper/features/principles/domain/repositories/principle_repository.dart';

class FetchPrinciples {
  final PrincipleRepository repository;
  FetchPrinciples(this.repository);

  Future<List<Principle>> call(String groupId) {
    return repository.fetchPrinciples(groupId);
  }
}