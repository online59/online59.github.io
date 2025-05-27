import 'package:firebase_database/firebase_database.dart';
import 'package:real_estate_helper/features/principles/data/models/principle_model.dart';

abstract class PrincipleRemoteDataSource {
  Future<List<PrincipleModel>> fetchPrinciples(String groupId);
  Future<void> setPrinciple(PrincipleModel principle);
  Future<void> updatePrinciple(PrincipleModel principle);
  Future<void> deletePrinciple(PrincipleModel principle);
}

class PrincipleRemoteDataSourceImpl extends PrincipleRemoteDataSource {
  final DatabaseReference _principleRef;

  PrincipleRemoteDataSourceImpl(this._principleRef);

  @override
  Future<List<PrincipleModel>> fetchPrinciples(String groupId) async {
    final snapshot = await _principleRef.orderByChild('groupId').equalTo(groupId).once();
    final data = snapshot.snapshot.value;

    if (data is Map) {
      return data.values
          .map<PrincipleModel>((item) =>
          PrincipleModel.fromJson(Map<String, dynamic>.from(item)))
          .toList();
    }
    return [];
  }

  @override
  Future<void> setPrinciple(PrincipleModel principle) async {
    // If you want to use the id as the key:
    await _principleRef.child(principle.id).set(principle.toJson());
  }

  @override
  Future<void> updatePrinciple(PrincipleModel principle) async {
    // This will update the principle with the given id
    await _principleRef.child(principle.id).update(principle.toJson());
  }

  @override
  Future<void> deletePrinciple(PrincipleModel principle) async {
    await _principleRef.child(principle.id).remove();
  }
}