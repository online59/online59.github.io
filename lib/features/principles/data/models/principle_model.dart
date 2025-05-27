import 'package:real_estate_helper/features/principles/domain/entities/principle.dart';

class PrincipleModel {
  final String id;
  final String groupId;
  final String doctrine;

  const PrincipleModel({required this.id, required this.groupId, required this.doctrine});

  factory PrincipleModel.fromJson(Map<String, dynamic> json) {
    return PrincipleModel(
      id: json['id'] as String,
      groupId: json['groupId'] as String,
      doctrine: json['doctrine'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'groupId': groupId,
      'doctrine': doctrine,
    };
  }

  factory PrincipleModel.fromEntity(Principle principle) {
    return PrincipleModel(id: principle.id, groupId: principle.groupId, doctrine: principle.doctrine);
  }

  Principle toEntity() {
    return Principle(
      id: id,
      groupId: groupId,
      doctrine: doctrine,
    );
  }
}