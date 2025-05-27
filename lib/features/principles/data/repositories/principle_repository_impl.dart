import 'package:real_estate_helper/features/principles/data/datasources/principle_remote_datasource.dart';
import 'package:real_estate_helper/features/principles/data/models/principle_model.dart';
import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';
import 'package:real_estate_helper/features/principles/domain/repositories/principle_repository.dart';

class PrincipleRepositoryImpl extends PrincipleRepository {
  final PrincipleRemoteDataSource remoteDataSource;

  PrincipleRepositoryImpl(this.remoteDataSource);

  @override
  Future<void> addPrinciple(Principle principle) {
    // Assume PrincipleModel.fromEntity for conversion
    return remoteDataSource.setPrinciple(PrincipleModel.fromEntity(principle));
  }

  @override
  Future<void> deletePrinciple(Principle principle) {
    return remoteDataSource.deletePrinciple(PrincipleModel.fromEntity(principle));
  }

  @override
  Future<List<Principle>> fetchPrinciples(String groupId) async {
    final models = await remoteDataSource.fetchPrinciples(groupId);
    return models.map((e) => e.toEntity()).toList();
  }

  @override
  Future<void> updatePrinciple(Principle principle) {
    return remoteDataSource.updatePrinciple(PrincipleModel.fromEntity(principle));
  }
}