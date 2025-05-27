import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';

abstract class PrincipleRepository {
  Future<List<Principle>> fetchPrinciples(String groupId);
  Future<void> addPrinciple(Principle principle);
  Future<void> updatePrinciple(Principle principle);
  Future<void> deletePrinciple(Principle principle);
}